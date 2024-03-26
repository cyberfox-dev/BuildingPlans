
using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPAddressType:BaseEntity
    {
        [Key]
        public int? AddresTypeID { get; set; }
        public string? TypeName { get; set; }

    }
}
