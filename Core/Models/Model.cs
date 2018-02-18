using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vega.Models
{
    // [Table("Models")] - by DataAnnotations its possible to change tbl name
    public class Model
    {
        public int Id { get; set; }
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        // inverse property
        // and foreign key, for easier access to make id
        // following below convension, allows the Entity Framework to take care of everything;
        // no MakeId column will be in fact created
        // for foreign key use the same data type as the property of id of parent model
        public Make Make { get; set; }
        public int MakeId { get; set; }
    }
}