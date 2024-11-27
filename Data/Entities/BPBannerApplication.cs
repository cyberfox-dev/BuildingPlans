using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPBannerApplication:BaseEntity
    {
        [Key]
        public int ApplicationID { get; set; }
        public string? UserID { get; set; }
        public string? ApplicantName { get; set; }
        public string? ApplicantSurname { get; set; }
        public string? ApplicantEmail { get; set; }
        public string? ApplicantFax { get; set; }
        public string? ApplicantCell { get; set; }
        public string? ApplicantTelephone { get; set; }
        public string? Address { get; set; }
        public string? TypeOfAdvert { get; set; }
        public string? NatureOfEvent { get; set; }
        public string? DescriptionOfAdvert { get; set; }
        public string? NameOfEvent { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? SizeOfPoster { get; set; }
        public string? NumberOfPosters { get; set; }
        public string? ApplicationFee { get; set; }
        public string? PreviousStage { get; set; }
        public string? CurrentStage { get; set; }
        public string? ProjectNumber { get; set; }
    }
}
