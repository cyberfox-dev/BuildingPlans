using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPMandatoryDepartmentDocuments:BaseEntity
    {
        [Key]
        public int? DocumentID { get; set; }
        public string? DocumentName { get; set; }
        public string? DepartmentName {  get; set; }
        public string? FunctionalArea {  get; set; }
    }
}
