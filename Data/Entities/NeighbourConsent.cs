using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class NeighbourConsent : BaseEntity
    {
        [Key]
        public int? ConsentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Address { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentLocalPath { get; set; }
        public string? ConsentStatus { get; set; }
    }   
}
