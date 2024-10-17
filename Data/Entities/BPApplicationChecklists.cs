using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPApplicationChecklists:BaseEntity
    {
        [Key]
        public int? ChecklistItemID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ChecklistItem { get; set; }
        public string? FunctionalArea { get; set; }
        public string? StageName { get; set; }
        public bool? isChecked { get; set; }
        public string? CheckedBy { get; set; }

    }
}
