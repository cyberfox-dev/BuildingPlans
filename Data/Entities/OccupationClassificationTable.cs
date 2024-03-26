using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class OccupationClassificationTable:BaseEntity
    {
        [Key]
        public int? OccupationID { get; set; }
        public string? OccupationName {  get; set; }
        public string? OccupationCode {  get; set; }
       
        public string? Occupancy {  get; set; }
        public string? OccupancyDescription { get; set; }
        public string? FunctionalArea { get; set; }
    }
}
