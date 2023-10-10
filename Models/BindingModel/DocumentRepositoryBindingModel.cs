namespace WayleaveManagementSystem.Models.BindingModel
{
    public class DocumentRepositoryBindingModel
    {
        public int? DocumentsRepositoryID { get; set; }
        public string? DocumentsCategory { get; set; }
        public int? DepartmentID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }

        public bool? isActive { get; set; }
    }
}
