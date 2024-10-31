using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPDemolitionApplication:BaseEntity
    {
        [Key]
        public int? DemolitionID { get; set; }
        public string? MainMunicipality { get; set; }
        public string? ApplicantName { get; set; }
        public string? ApplicantSurname {  get; set; }
        public string? ApplicantIDNumber { get; set; }
        public string? ApplicantEmailAddress { get; set; }
        public string? ApplicantContactNumber { get; set; }
        public bool? isPropertyOwner { get; set; }
        public string? OwnerIDNumber { get; set; }
        public string? OwnerName { get; set;}
        public string? OwnerSurname { get; set; }
        public string? OwnerEmailAddress { get; set; }
        public string? OwnerContactNumber { get; set; }
        public string? ApplicantAddress { get; set; }
        public string? SiteAddress { get; set; }
        public string? SiteERFNumber { get; set; }
        public string? SiteCadastralDescription { get; set; }
        public string? ReasonForDemolition { get; set; }
        public string? PropertyUse { get; set; }
        public string? DemolitionFees { get; set; }
        public bool? isArchive { get; set; }
        public string? PreviousStage { get; set; }
        public string? CurrentStage { get; set; }
        public string? ProjectNumber { get; set; }

    }
}
