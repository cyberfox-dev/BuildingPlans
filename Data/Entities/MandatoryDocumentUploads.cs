using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class MandatoryDocumentUpload : BaseEntity
    {
        [Key]
        public int? MandatoryDocumentID { get; set; }
        public string? MandatoryDocumentName { get; set; }
        public int? StageID { get; set; }

    }
}
