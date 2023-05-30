namespace WayleaveManagementSystem.Models.BindingModel
{
    public class SubDepartmentForCommentBindingModel
    {
        public int SubDepartmentForCommentID { get; set; }
        
        public int? ApplicationID { get; set; }

        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }

        public string? CommentStatus { get; set; }

        public bool? isAwaitingClarity { get; set; }

        public bool? IsRefered { get; set; }

        public string? ReferedToUserID { get; set; }
        public string? CreatedById { get; set; }
        //Is Set for final Approval
        public bool? FinalApproval { get; set; }


    }
}
