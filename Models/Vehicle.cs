using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using vega.Models;

namespace vega.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        [Required]
        [StringLength(255)]
        public string ContactName { get; set; }
        [StringLength(255)]
        public string ContactPhone { get; set; }
        [StringLength(255)]
        public string ContactEmail { get; set; }

        // public Make Make { get; set; }
        // public int MakeId { get; set; }
        public int ModelId { get; set; }
        //public Model Model { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; }

        public ICollection<VehicleFeature> VehicleFeatures { get; } = new List<VehicleFeature>();
    }
}