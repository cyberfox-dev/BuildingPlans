using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPDepartmentChecklists:BaseEntity
    {
        [Key]
        public int? ChecklistItemID { get; set; }
        public string? ChecklistItem {  get; set; }
        public string? FunctionalArea { get; set; }
        public string? DepartmentName { get; set; }

    }
}
