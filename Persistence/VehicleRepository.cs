using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core;
using vega.Extensions;
using vega.Models;

namespace vega.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;
        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetVehicles(VehicleQuery queryObj)
        {
            var query = context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .AsQueryable();

            // filtering
            if (queryObj.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId);

            if (queryObj.ModelId.HasValue)
                query = query.Where(v => v.ModelId == queryObj.ModelId);

            // sorting - poor way
            var columnMap = new Dictionary<string, Expression<Func<Vehicle, object>>>()
            {
                // the way provided in C#6
                ["make"] = v => v.Model.Make.Name
                , ["model"] = v => v.Model.Name
                , ["contactName"] = v => v.ContactName
                // , ["id"] = v => v.Id,  // EF add sorty by id by itself, so we can't use it ()
            };
            
            // the old way
            // columnMap.Add("make", v => v.Model.Make.Name);
            // columnMap.Add("model", v => v.Model.Name);
            // columnMap.Add("contactName", v => v.ContactName);
            // columnMap.Add("id", v => v.Id);

            query = query.ApplyOrdering(queryObj, columnMap);

            return await query.ToListAsync();
        }

        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {
            if (!includeRelated)
                return await context.Vehicles.FindAsync(id);

            return await context.Vehicles
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }

        public void Remove(Vehicle vehicle)
        {
            context.Remove(vehicle);
        }
    }
}