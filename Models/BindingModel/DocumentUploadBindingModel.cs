namespace WayleaveManagementSystem.Models.BindingModel
{
    public class DocumentUploadBindingModel
    {

        public int DocumentID { get; set; }
        public string? DocumentName { get; set; }

        public byte[]? DocumentData { get; set; }

        public int? ApplicationID { get; set; }

        public string? AssignedUserID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public bool isActive { get; set; }
    }
}
