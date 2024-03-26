namespace BuildingPlans.Models.DTO
{
    public class BPDocumentCategoryTableDTO
    {
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? FunctionalArea { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

        public Boolean? isActive { get; set; }
    }
}
