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
        private readonly IVehicleRepository repository;

        public VehiclesController(VegaDbContext context, IMapper mapper, IVehicleRepository repository)
        {
            this.repository = repository;
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<VehicleResource>> GetVehicleAsync()
        {
            var vehicles = await context.Vehicles.Include(v => v.Features).Include(v => v.Model).ToListAsync();

            return mapper.Map<List<Vehicle>, List<VehicleResource>>(vehicles);
        }

        [HttpGet("{id}", Name = "GetVehicle")]
        public async Task<IActionResult> GetById(int id)
        {
            var vehicle = await repository.GetVehicle(id);

            if (vehicle == null)
                return NotFound();

            return new ObjectResult(mapper.Map<Vehicle, VehicleResource>(vehicle));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // how to implement business
            // if (true)
            // {
            //     ModelState.AddModelError("key", "error message");
            //     return BadRequest(ModelState);
            // }
            // var model = await context.Models.FindAsync(vehicleResource.ModelId);
            // if (model == null){
            //     ModelState.AddModelError("ModelId", "Invalid modelId.");
            //     return BadRequest(ModelState);
            // }

            Vehicle vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdated = DateTime.Now;

            context.Vehicles.Add(vehicle);
            await context.SaveChangesAsync();

            vehicle = await repository.GetVehicle(vehicle.Id);

            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return CreatedAtRoute("GetVehicle", new { id = vehicle.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = await repository.GetVehicle(id);

            if (vehicle == null)
                return NotFound();

            mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            vehicle.LastUpdated = DateTime.Now;

            await context.SaveChangesAsync();

            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return new OkObjectResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var vehicle = await context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);
            if (vehicle == null)
                return NotFound();

            context.Vehicles.Remove(vehicle);
            await context.SaveChangesAsync();

            return new NoContentResult();
        }
    }
}