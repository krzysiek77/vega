using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IHostingEnvironment host;
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly PhotoSettings photoSettings;
        private readonly IMapper mapper;
        public PhotosController(IHostingEnvironment host, IVehicleRepository repository,
            IUnitOfWork unitOfWork, IMapper mapper, IOptionsSnapshot<PhotoSettings> options)
        {
            this.photoSettings = options.Value;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.host = host;
        }

    [HttpPost]
    public async Task<IActionResult> Upload(int vehicleId, IFormFile file) //IFormCollection to upload multiple files
    {
        var vehicle = await repository.GetVehicle(vehicleId, includeReleated: false);
        if (vehicle == null)
            return NotFound();

        if (file == null) return BadRequest("Null file.");
        if (file.Length == 0) return BadRequest("Empty file.");
        if (file.Length > photoSettings.MaxBytes) return BadRequest("Maximum file size exceeded.");
        if (!photoSettings.IsSupported(file.FileName))
            return BadRequest("Invalid file type.");

        var uploadFolderPath = Path.Combine(host.WebRootPath, "upload");
        if (!Directory.Exists(uploadFolderPath))
            Directory.CreateDirectory(uploadFolderPath);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadFolderPath, fileName);

        // copy file using stream
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var photo = new Photo { FileName = fileName };
        vehicle.Photos.Add(photo);
        await unitOfWork.CompleteAsync();

        return Ok(mapper.Map<Photo, PhotoResource>(photo));
    }
}
}