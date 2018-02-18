using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using vega.Models;

namespace vega.Models
{
    public class VehicleFeature
    {
        public Vehicle Vehicle { get; set; }
        public int VehicleId { get; set; }
        public Feature Feature { get; set; }
        public int FeatureId { get; set; }
    }
}