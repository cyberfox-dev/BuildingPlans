using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    public class CommentDTO
    {
        public int CommentID { get; set; }
        public string? Comment { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }
        public string? CommentStatus { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public int? ApplicationID { get; set; }

        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
    }

}
