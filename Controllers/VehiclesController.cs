using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Models;
using vega.Persistence;

namespace vega.Controllers
{
    [Route("api/[controller]")]
    public class VehiclesController : Controller
    {
        private readonly VegaDbContext context;
        private readonly IMapper mapper;

        public VehiclesController(VegaDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<VehicleResource>> GetVehicleAsync()
        {
            var vehicles = await context.Vehicles.ToListAsync();

            return mapper.Map<List<Vehicle>, List<VehicleResource>>(vehicles);
        }

        [HttpGet("{id}", Name = "GetVehicle")]
        public async Task<IActionResult> GetById(long id)
        {
            var vehicle = await context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound();

            return new ObjectResult(mapper.Map<Vehicle, VehicleResource>(vehicle));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VehicleResource vehicleResource)
        {
            if (vehicleResource == null)
                return BadRequest();

            Vehicle vehicle = mapper.Map<VehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdated = DateTime.Now;
            
            context.Vehicles.Add(vehicle);
            await context.SaveChangesAsync();

            return CreatedAtRoute("GetVehicle", new { id = vehicle.Id }, vehicle);
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] VehicleResource vehicleResource)
        {
            if (vehicleResource == null || vehicleResource.Id != id)
                return BadRequest();

            var vehicle = await context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);
            if (vehicle == null)
                return NotFound();

            vehicle = mapper.Map<VehicleResource, Vehicle>(vehicleResource, vehicle);
            vehicle.LastUpdated = DateTime.Now;
            
            context.Vehicles.Update(vehicle);
            await context.SaveChangesAsync();

            return new NoContentResult();
            
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var vehicle = await context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);
            if (vehicle == null)
                return NotFound();

            context.Vehicles.Remove(vehicle);
            context.SaveChanges();

            return new NoContentResult();
        }
    }
}