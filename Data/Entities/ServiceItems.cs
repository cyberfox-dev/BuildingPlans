using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ServiceItems : BaseEntity
    {
        [Key]
        public int? ServiceItemID { get; set; }
        public string? ServiceItemCode { get; set; }
        public string? Description { get; set; }
        public double? Rate { get; set; }
        public double? TotalVat { get; set; }
        public int? DepartmentID { get; set; }
        public string? Category { get; set; }
        public bool? VatApplicable { get; set; }
        public string? Remarks { get; set; }

    }
}
