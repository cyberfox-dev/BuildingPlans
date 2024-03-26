using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPMandatoryStageDocuments:BaseEntity
    {
        [Key]
        public int? DocumentID { get; set; }
        public string? FunctionalArea { get; set; }
        public string? StageName { get; set; }
        public string? DocumentName { get; set; }
    }
}
