namespace BuildingPlans.Models.DTO
{
    public class StageDTO
    {
        public int? StageID { get; set; }
        public string? StageName { get; set; }
        public int? StageOrderNumber { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
    }
}
