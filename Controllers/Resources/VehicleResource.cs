using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }
        public ContactResource Contact { get; set; }
        public ModelResource Model { get; set; }
        public MakeResource Make { get; set; }
        public bool IsRegistered { get; set; }
        public DateTime LastUpdated { get; set; }

        public ICollection<FeatureResource> Features { get; set; }

        // best practice: always initialize Collections
        public VehicleResource()
        {
            Features = new Collection<FeatureResource>();
        }
    }
}