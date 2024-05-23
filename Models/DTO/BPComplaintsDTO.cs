namespace BuildingPlans.Models.DTO
{
    public class BPComplaintsDTO
    {
        public int? ComplaintID { get; set; }
        public string? IDNumber { get; set; }
        public string? FullName { get; set; }
        public string? EmailAddress { get; set; }
        public string? CellNumber { get; set; }
        public string? TelephoneNumber { get; set; }
        public string? Address { get; set; }
        public string? CadastralDescription { get; set; }
        public string? LotNumber { get; set; }
        public string? Portion { get; set; }
        public string? Township { get; set; }
        public string? Details { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
