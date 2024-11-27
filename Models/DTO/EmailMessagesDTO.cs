namespace BuildingPlans.Models.DTO
{
    public class EmailMessagesDTO
    {
        public int? EmailMessageID { get; set; }
        public string? EmailMessage { get; set; }
        public string? Category { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

    }
}
 