using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Models;
using vega.Persistence;

namespace vega.Controllers
{
    public class ModelsController : Controller
    {
        private readonly VegaDbContext context;
        private readonly IMapper mapper;

        public ModelsController(VegaDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet("/api/makes/{id}/models/")]
        public async Task<IEnumerable<ModelResource>> GetModelsOfMake(int id)
        {
            var models = await context.Models.Where(x => x.MakeId == id).ToListAsync();
            // var models = await context.Models.ToListAsync();
            
            return mapper.Map<List<Model>, List<ModelResource>>(models);
        }
    }
}