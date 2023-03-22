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

        //The CreatedBy is the user who created the comment
        // public string? UserCommentedID { get; set; }

    }
}