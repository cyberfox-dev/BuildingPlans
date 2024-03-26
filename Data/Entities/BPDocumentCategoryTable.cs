using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPDocumentCategoryTable:BaseEntity
    {
        [Key]
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? FunctionalArea {  get; set; }
        
    }
}
