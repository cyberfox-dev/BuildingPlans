namespace BuildingPlans.Models.DTO
{
    public class CoOrdinatesDTO
    {
        public int? CoOrdinateID { get; set; }
        public int? ApplicationID { get; set; }
        public string? DrawingType { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public string? Radius { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
