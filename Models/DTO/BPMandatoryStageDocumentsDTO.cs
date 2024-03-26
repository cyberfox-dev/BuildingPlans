namespace BuildingPlans.Models.DTO
{
    public class BPMandatoryStageDocumentsDTO
    {
        public int? DocumentID { get; set; }
        public string? FunctionalArea { get; set; }
        public string? StageName { get; set; }
        public string? DocumentName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }
        public bool isActive { get; set; }
    }
}
