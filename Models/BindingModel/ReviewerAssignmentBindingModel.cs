using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Models.BindingModel
{
    public class ReviewerAssignmentBindingModel
    {
       
        public int? ReviewerForCommentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ReviewerAssignedToComment { get; set; }
        public string? CommentStatus { get; set; }
        public string? Comment { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }
        public string? CreatedById { get; set; }
    }
}
