namespace BuildingPlans.Models.DTO
{
    public class UserLinkToArchitectDTO
    {
        public int? UserLinkID { get; set; }
        public string? ArchitectUserID { get; set; }
        public string? ArchitectName { get; set; }
        public string? ClientUserId { get; set; }
        public string? CLientFullName { get; set; }
        public string? Address { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set;}
    }
}
