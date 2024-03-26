namespace BuildingPlans.Models.BindingModel
{
    public class StagesChecklistsBindingModel
    {
        public int? CheckListItemID { get; set; }
        public string? ChecklistItem { get; set; }
        public string? FunctionalArea { get; set; }
        public string? StageName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }
    }
}
