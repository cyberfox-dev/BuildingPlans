using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class Roles : BaseEntity
    {
        [Key]
        public int RoleID { get; set; }
        public string? RoleName { get; set; }
        public string? RoleType { get; set; }
        public string? RoleDescription { get; set; }


    }
}
