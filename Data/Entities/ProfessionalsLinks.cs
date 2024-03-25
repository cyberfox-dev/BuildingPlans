using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class ProfessionalsLinks : BaseEntity
    {
        [Key]
        public int? ProfessionalsLinkID { get; set; }
        public int? ApplicationID { get; set; }
        public int? ProfessionalID { get; set; }
    }
}
