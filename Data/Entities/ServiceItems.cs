using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ServiceItems : BaseEntity
    {
        [Key]
        public int? ServiceItemID { get; set; }
  
       public string? ServiceItemCode { get; set; }
        public string? Description { get; set; }
        public int? Rate { get; set; }

        public int? TotalVat { get; set; }

    }
}
