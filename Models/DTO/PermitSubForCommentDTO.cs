namespace WayleaveManagementSystem.Models.DTO
{
    public class PermitSubForCommentDTO
    {
        public int? PermitSubForCommentID { get; set; }

        public int? ApplicationID { get; set; }

        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }
        public string? PermitComment { get; set; }
        public string? CreatedById { get; set; }
        public string? PermitCommentStatus { get; set; }
        public int? ZoneID { get; set; }

        public string? ZoneName { get; set; }

        

        public bool? isPaid { get; set; }
        public bool? RequestForDelete { get; set; }
        public bool? hasSuperVisionFee { get; set; }
        public DateTime? MoveToPaidDate { get; set; }

        #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
        public string? PermitDocName { get; set; }
        public string? DocumentLocalPath { get; set; }
        #endregion

    }
}
