using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class PermitSubForComment : BaseEntity
    {

        [Key]
        public int? PermitSubForCommentID { get; set; }

        public int? ApplicationID { get; set; }
        
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }

        public string? PermitComment { get; set; }

        public string? PermitCommentStatus { get; set; }




        //Waiting
        //Approved
        //Rejected
        //Clarify
        //Clarified
        //Refered 
       // public string? CommentStatus { get; set; }

      //  public bool? isAwaitingClarity { get; set; }

        //public bool? IsRefered { get; set; }

       // public string? ReferedToUserID { get; set; }


        //Is Set for final Approval
       // public bool? FinalApproval { get; set; }










    }
}
