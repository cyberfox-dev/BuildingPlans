using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class Stages : BaseEntity
    {
        [Key]
        public int? StageID { get; set; }
        public string? StageName { get; set; }
        public int? StageOrderNumber { get; set; }

    }
}
