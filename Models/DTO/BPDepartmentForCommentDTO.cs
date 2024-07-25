namespace BuildingPlans.DTO
{
    // DTO - Data Trasfer Object
    public class BPDepartmentForCommentDTO
    {
        public int? BPDepartmentForCommentID { get; set; }

        public int? ApplicationID { get; set; }

        public int? DepartmentID { get; set; }

        public string? DepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }

        public string? CommentStatus { get; set; }

        public bool? isAwaitingClarity { get; set; }

        public bool? isFinalApproved { get; set; }
        public string? CreatedByID { get; internal set; }
    }

}
