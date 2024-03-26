using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPDepartmentLinkTable:BaseEntity
    {
        [Key]
        public int DepartmentLinkID { get; set; }
        public string? FunctionalArea { get; set; }
        public int? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? AssignedUserID { get; set; }
        public bool? isAdmin { get; set; }
        public string? AccessGroupName { get; set; }
        public int? AccessGroupUserLinkID { get; set; }

    }
}
