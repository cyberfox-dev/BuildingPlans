namespace WayleaveManagementSystem.Models.BindingModel
{
    public class DocumentUploadBindingModel
    {

        public int? DocumentID { get; set; }
        public string? DocumentName { get; set; }

        public string? DocumentLocalPath { get; set; }

        public int? ApplicationID { get; set; }

        public string? AssignedUserID { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }


        public string? CreatedById { get; set; }

        public bool? isActive { get; set; }
        public string? DocumentGroupName { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
        public bool? isPlanning { get; set; }
        public bool? isRepository { get; set; }

    }
}
