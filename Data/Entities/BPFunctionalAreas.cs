using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPFunctionalAreas : BaseEntity
    {
        [Key]
        public int? FunctionalAreaID { get; set; }
        public string? FAName { get; set; }
        public string? FAItemCode { get; set; }

    }
}
