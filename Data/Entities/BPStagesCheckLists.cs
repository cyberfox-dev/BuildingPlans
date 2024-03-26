using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPStagesCheckLists:BaseEntity
    {
        [Key]
        public int? CheckListItemID {  get; set; }
        public string? ChecklistItem { get; set; }
        public string? FunctionalArea { get; set; }
        public string? StageName {  get; set; }

    }
}
