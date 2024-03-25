using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class GLCode : BaseEntity
    {
        [Key]
        public int GLCodeID { get; set; }
        public string? GLCodeName { get; set; }

        public int? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? ProfitCenter { get; set; }


    }
}
