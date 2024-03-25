using System.ComponentModel.DataAnnotations;


namespace BuildingPlans.Data.Entities
{
    public class ProjectSizedSelections : BaseEntity
    {
        [Key]
        public int? SelectionID { get; set; }
        public string? UserFullName { get; set; }
        public int? ApplicationID { get; set; }
        public string? SelectedProject { get; set; }
        public string? ProjectDescription { get; set; }


    }
}

