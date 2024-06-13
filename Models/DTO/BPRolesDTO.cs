namespace BuildingPlans.Models.DTO
{
    public class BPRolesDTO
    {
        public int RoleID { get; set; }
        public string? RoleName { get; set; }
        public string? RoleType { get; set; }
        public string? RoleDescription { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
