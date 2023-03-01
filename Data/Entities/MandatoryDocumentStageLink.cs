using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class MandatoryDocumentStageLink : BaseEntity
    {
        [Key]
        public int? MandatoryDocumentStageLinkID { get; set; }

        public int? MandatoryDocumentID { get; set; }
        public int StageID { get; set; }

        public string? StageName { get; set; }

    }
}
