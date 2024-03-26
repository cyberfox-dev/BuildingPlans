using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class UserLinkToArchitect:BaseEntity
    {
        [Key]
        public int UserLinkID { get; set; }
        public string ?ArchitectUserID { get; set; }
        public string? ArchitectName { get; set; }
        public string? ClientUserId { get; set; }
        public string? CLientFullName { get; set; }
        public string? Address { get; set; }
    }
}
