namespace WayleaveManagementSystem.Models.DTO
{
    public class SubDepartmentsDTO
    {
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public int? DepartmentID { get; set; }
        public string? UserAssaignedToComment { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public int? MapLayerID { get; set; }
        public string? GLCode { get; set; }
        public string? ProfitCentre { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public int? CreatedById { get; set; }
        public bool isActive { get; set; }
        
    }
}
