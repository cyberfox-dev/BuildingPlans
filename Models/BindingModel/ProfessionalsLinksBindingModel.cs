namespace BuildingPlans.Models.BindingModel
{
    public class ProfessionalsLinksBindingModel
    {
        public int? ProfessionalsLinkID { get; set; }
        public int? ApplicationID { get; set; }
        public int? ProfessionalID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public bool isActive { get; set; }


    }
}
