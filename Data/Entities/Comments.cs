using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Comments : BaseEntity
    {
        [Key]
        public int CommentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Comment { get; set; }

        /// <summary>
        /// Approved
        /// Approved(Conditional)
        /// Rejected
        /// Clarify
        /// Refered
        /// </summary>

        public string? CommentStatus { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
        public int? isClarifyCommentID { get; set; }
        public string? isApplicantReplay { get; set; }

        public string? UserName { get; set; }

        public string? ZoneName { get; set; }

        //Clarify Alerts Kyle 
        public string? CanReplyUserID{ get; set; }
        //Clarify Alert Kyle 
        

        //The CreatedBy is the user who created the comment
        // public string? UserCommentedID { get; set; }

    }
}