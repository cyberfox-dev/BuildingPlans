using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPFlagApplication:BaseEntity
    {
        [Key]
        public int? ApplicationID { get; set; }
        public string? UserID { get; set; }
        public string? ApplicantName { get; set; }
        public string? ApplicantSurname {  get; set; }
        public string? ApplicantEmail { get; set; }
        public string? ApplicantFax { get; set; }
        public string? ApplicantCell { get; set; }
        public string? ApplicantTelephone { get; set; }
        public string? ApplicantAddress { get; set; }
        public string? ApplicationType { get; set; }
        public string? Location { get; set; }
        public string? PoleNumber { get; set; }
        public string? StartPole { get; set; }
        public string? EndPole { get; set; }
        public string? SubjectMatter { get; set; }
        public string? NoOfFlags { get; set; }
        public string? NoOfAgents { get; set; }
        public string? NatureOfAdvert { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? PlaceOfEvent { get; set; }
        public string? ApplicationFee { get; set; }
    }
}
