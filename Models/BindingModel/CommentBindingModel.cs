namespace WayleaveManagementSystem.Models.BindingModel
{
    public class CommentBindingModel
    {
        public int CommentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Comment { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public string? CreatedById { get; set; }

    }
}
