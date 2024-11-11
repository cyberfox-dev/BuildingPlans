namespace BuildingPlans.Models.BindingModel
{
    public class BugsBindingModel
    {
        public int? BugID { get; set; }
        public string? Description { get; set; }
        public bool? isFixed { get; set; }
        public string? FixedBy { get; set; }
        public string? Component { get; set; }
        public string? Category { get; set; }

        public string? CreatedById { get; set; }

    }
}
