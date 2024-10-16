using System.Security.Policy;

namespace BuildingPlans.Models.DTO
{
    public class BPApplicationChecklistsDTO
    {
        public int? ChecklistItemID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ChecklistItem { get; set; }
        public string? FunctionalArea { get; set; }
        public string? StageName { get; set; }
        public bool? isChecked { get; set; }
        public string? CheckedBy { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
