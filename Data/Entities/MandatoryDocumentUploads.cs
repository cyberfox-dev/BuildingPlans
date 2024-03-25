using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class MandatoryDocumentUpload : BaseEntity
    {
        [Key]
        public int? MandatoryDocumentID { get; set; }
        public string? MandatoryDocumentName { get; set; }
        public string? MandatoryDocumentCategory { get; set; }


        /*   public int? StageID { get; set; }*/

    }
}
