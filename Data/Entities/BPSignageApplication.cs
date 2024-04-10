using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPSignageApplication:BaseEntity
    {
        [Key]
        public int? ApplicationID { get; set; }
        public string? ApplicationType { get; set; }
        public string? ApplicantType { get; set; }
        public string? OrganisationName { get; set; }
        public string? UserID { get; set; }
        public string? ApplicantName { get; set; }  
        public string? ApplicantSurname { get; set; }
        public string? ApplicantCell { get; set; }
        public string? ApplicantTelephone { get; set; }
        public string? ApplicantFax { get; set; }
        public string? ApplicantEmail { get; set; }
        public string? AddressType { get; set; }
        public string? Address { get; set; }
        public string? NatureOfAdvertisement { get; set; }
        public string? AreasOfControl { get; set; }
        public string? Height { get; set; }
        public string? Width { get; set; }
        public string? NoOfFaces { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? ApplicationFee { get; set; }
        public string? MonthlyFee { get; set; }
        public string? Voltage { get; set; }
        public bool? ElectrictyRequired { get; set; }
        public bool? EnvironmentalImpactAssessment { get; set; }
        public bool? AdvertisingSignRight { get; set; }
        public bool? Encroachment { get; set; }
        public string? PreviousStage { get; set; }
       public string? CurrentStage { get; set; }
        public string? NextStage { get; set; }

    }
}
