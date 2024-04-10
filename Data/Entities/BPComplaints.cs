using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPComplaints : BaseEntity
    {
        [Key]
        public int? ComplaintID { get; set; }
        public string? IDNumber { get; set; }
        public string? FullName { get; set; }
        public string? EmailAddress { get; set; }
        public string? CellNumber { get; set; }
        public string? TelephoneNumber { get; set; }
        public string? Address { get; set; }
        public string? CadastralDescription { get; set; }
        public string? LotNumber { get; set; }
        public string? Portion { get; set; }
        public string? Township { get; set; }
        public string? Details { get; set; } 
    }
}
