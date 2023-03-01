namespace WayleaveManagementSystem.Models.DTO
{
    public class MandatoryDocumentStageLinkDTO
    {
        public int? MandatoryDocumentStageLinkID { get; set; }

        public int? MandatoryDocumentID { get; set; }
        public int StageID { get; set; }

        public string? StageName { get; set; }

        public string? CreatedById { get; set; }
        public string? MandatoryDocumentName { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public bool isActive { get; set; }

    }
}
