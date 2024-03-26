using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPDepartments: BaseEntity
    {
        [Key]
        public int DepartmentID { get; set; }

        public string? DepartmentName { get; set; }

        public bool? hasSubDepartment { get; set; }

        public string? FunctionalArea { get; set; }
    }
}
