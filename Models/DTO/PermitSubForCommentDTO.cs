namespace WayleaveManagementSystem.Models.DTO
{
    public class PermitSubForCommentDTO
    {
        public int? PermitSubForCommentID { get; set; }

        public int? ApplicationID { get; set; }

        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }
        public string? PermitComment { get; set; }
        public string? CreatedById { get; set; }
        public string? PermitCommentStatus { get; set; }



    }
}
