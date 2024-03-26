namespace BuildingPlans.Models.BindingModel
{
    public class StagesTableBPBindingModel
    {
        public int?StageID { get; set; }
        public string? StageName { get; set; }
        public int? StageOrder { get; set; }
        public string? CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool isActive { get; set; }
        public string? FunctionalArea { get; set; }
        public bool SkipTrigger { get; set; }
    }
}
