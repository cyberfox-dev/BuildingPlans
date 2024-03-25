namespace BuildingPlans.Models.DTO
{
    public class ManuallyAssignUsersDTO
    {
        public int? ReferalID { get; set; }
        public int? ApplicationID { get; set; }
        public string? PorjectNumber { get; set; }
        public string? AssignedToUserId { get; set; }
        public string? Description { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
