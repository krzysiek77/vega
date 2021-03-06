
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class MakeResource : KeyValuePairResource
    {
        public ICollection<KeyValuePairResource> Models { get; set; }

        // when using ICollection, initialize it in constructor
        public MakeResource()
        {
            // difference between Collection and a List is,
            // that elements in List can be accessed by index
            // in this case, I just want to serialize Models of each Make,
            // that's why I use Collection
            Models = new Collection<KeyValuePairResource>();  
        }
    }
}