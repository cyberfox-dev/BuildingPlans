namespace BuildingPlans.Models.DTO
{
    public class NeighbourConsentDTO
    {
        public int? ConsentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Address { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentLocalPath { get; set; }
        public string? ConsentStatus { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public string? OwnerName { get; set; }
        public string? OwnerCell { get; set; }
        public string? OwnerEmail { get; set; }
    }
}
