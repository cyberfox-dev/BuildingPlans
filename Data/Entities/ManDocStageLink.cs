using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ManDocStageLink : BaseEntity
    {
        [Key]
        public int? ManDocStageLinkID { get; set; }

        public int? MandatoryDocumentID { get; set; }
        public int StageID { get; set; }

        public string? StageName { get; set; }

    }
}
