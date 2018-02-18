using System.ComponentModel.DataAnnotations;

namespace vega.Controllers.Resources
{
    public class ContactResource
    {
        // data annotations in resource allows to get 'friendly' json erro messages
        // because I'm using resource as an input for all controller methods
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        [Required]
        [StringLength(255)]
        public string Phone { get; set; }
        [StringLength(255)]
        public string Email { get; set; }
    }
}