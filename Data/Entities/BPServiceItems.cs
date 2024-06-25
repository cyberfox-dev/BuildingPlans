using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPServiceItems:BaseEntity
    {
        [Key]
        public int? ServiceItemID { get; set; }
        public string? ServiceItemCode { get; set; }
        public string? Description { get; set; }
        public double? Rate { get; set; }
        public double? TotalVat { get; set; }
        public string? Category { get; set; } 

        public string? FunctionalArea { get; set; }
        public bool? VAtApplicable { get; set; }
        public string? Remarks { get; set; }
    }
}
