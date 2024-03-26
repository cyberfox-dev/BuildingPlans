namespace BuildingPlans.Models.DTO
{
    public class OccupationClassificationTableDTO
    {
        public int? OccupationID { get; set; }
        public string? OccupationName { get; set; }
        public string? OccupationCode { get; set; }
        public string? FunctionalArea{ get; set; }
        public string? Occupancy { get; set; }
        public string? OccupancyDescription { get; set; }
        public string? createdById { get; set; }
        public DateTime dateCreated {  get; set; }
        public DateTime dateUpdated {  get; set; }
        
    }
}
