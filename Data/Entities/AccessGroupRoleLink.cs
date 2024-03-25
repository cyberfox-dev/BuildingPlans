using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class AccessGroupRoleLink : BaseEntity
    {
        [Key]
        public int AccessGroupRoleLinkID { get; set; }
        public int? AccessGroupID { get; set; }
        public int? RoleID { get; set; }
        public string? RoleName { get; set; }



    }
}
