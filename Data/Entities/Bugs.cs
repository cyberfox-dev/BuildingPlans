using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class Bugs : BaseEntity
    {
        [Key]
        public int? BugID { get; set; }
        public string? Description { get; set; }
        public bool? isFixed { get; set; }
        public string? FixedBy { get; set; }

        public string? Component { get; set; }
        public string? Category { get; set; }
    }
}


