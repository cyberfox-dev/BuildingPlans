using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPComments:BaseEntity
    {
        [Key]
        public int CommentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? FunctionalArea { get; set; }
        
        public string? Comment { get; set; }
         
        public string? CommentStatus { get; set; }
       
        public int? SubDepartmentForCommentID { get; set; }
       
        public string? isApplicantReply { get; set; }

        public string? SecondReply { get; set; }
        public string? UserName { get; set; }

      
        public string? CanReplyUserID { get; set; }
       
    }
}
