using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace vega.Core.Models
{
    public class Make
    {
        public int id { get; set; }
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        public ICollection<Model> Models { get; set; }

        // when using ICollection, initialize it in constructor
        public Make()
        {
            // difference between Collection and a List is,
            // that elements in List can be accessed by index
            // in this case, I just want to serialize Models of each Make,
            // that's why I use Collection
            Models = new Collection<Model>();  
        }
    }
}