using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class EmailMessages:BaseEntity
    {
        [Key]
        public int? EmailMessageID { get; set; }
        public string? EmailMessage { get; set; }

        public string? Category { get; set; }
      
    }
}
