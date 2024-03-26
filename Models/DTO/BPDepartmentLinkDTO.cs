namespace BuildingPlans.Models.DTO
{
    public class BPDepartmentLinkDTO
    {
        public int? DepartmentLinkID { get; set; }
        public string? FunctionalArea { get; set; }
        public int? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? AssignedUserID { get; set; }
        public bool? isAdmin { get; set; }
        public string? AccessGroupName { get; set; }
        public int? AccessGroupUserLinkID { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

        public bool? isActive { get; set; }
    }
}
