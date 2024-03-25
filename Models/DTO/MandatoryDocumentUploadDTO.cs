namespace BuildingPlans.DTO
{
    public class MandatoryDocumentUploadDTO
    {

        public int? MandatoryDocumentID { get; set; }
        public string? MandatoryDocumentName { get; set; }
        public int? StageID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public bool isActive { get; set; }

        public string? MandatoryDocumentCategory { get; set; }



    }
}


