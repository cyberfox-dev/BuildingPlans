namespace BuildingPlans.Models.DTO
{
    public class BPDepartmentChecklistsDTO
    {
        public int? ChecklistItemID { get; set; }
        public string? ChecklistItem { get; set; }
        public string? FunctionalArea { get; set; }
        public string? DepartmentName { get; set; }
        public string? CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
    }
}