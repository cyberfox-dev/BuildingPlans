namespace BuildingPlans.Models.DTO
{
    public class ProjectSizedSelectionDTO
    {
        public int? SelectionID { get; set; }
        public string? UserID { get; set; }
        public int? ApplicationID { get; set; }
        public string? SelectedProject { get; set; }
        public string? ProjectDescription { get; set; }
        public DateTime? DateCreated { get; set; }
        public string? CreatedById { get; set; }
    }
}
