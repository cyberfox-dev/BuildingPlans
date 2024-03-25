using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class ZXNumberLog : BaseEntity
    {
        [Key]
        public int ZXNumberID { get; set; }
        public int? ApplicationID { get; set; }
        public int? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? ZXNumber { get; set; }
    }
}
