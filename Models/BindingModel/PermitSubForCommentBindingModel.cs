namespace WayleaveManagementSystem.Models.BindingModel
{
    public class PermitSubForCommentBindingModel
    {
        public int? PermitSubForCommentID { get; set; }

        public int? ApplicationID { get; set; }

        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }
        public string? PermitComment { get; set; }

        public string? PermitCommentStatus { get; set; }
        public string? CreatedById { get; set; }

        public int? ZoneID { get; set; }

        public string? ZoneName { get; set; }

        public bool? isPaid { get; set; }
        public bool? RequestForDelete { get; set; }

        #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
        //Each person who's been Assigned to Comment can upload a permit document?

        public string? PermitDocName { get; set; }
        public string? DocumentLocalPath { get; set; }
        #endregion
    }
}
