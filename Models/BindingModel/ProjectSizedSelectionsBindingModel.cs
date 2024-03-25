namespace BuildingPlans.Models.BindingModel
{
    public class ProjectSizedSelectionsBindingModel
    {

        public int? SelectionID { get; set; }
        public string? UserFullName { get; set; }
        public int? ApplicationID { get; set; }
        public string? SelectedProject { get; set; }
        public string? ProjectDescription { get; set; }
        public string? CreatedById { get; set; }
    }
}
