using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }
        public ContactResource Contact { get; set; }
        public KeyValuePairResource Model { get; set; }
        public KeyValuePairResource Make { get; set; }
        public bool IsRegistered { get; set; }
        public DateTime LastUpdated { get; set; }

        public ICollection<KeyValuePairResource> Features { get; set; }

        // best practice: always initialize Collections
        public VehicleResource()
        {
            Features = new Collection<KeyValuePairResource>();
        }
    }
}