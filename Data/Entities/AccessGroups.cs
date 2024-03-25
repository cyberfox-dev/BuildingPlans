using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class AccessGroups : BaseEntity
    {
        [Key]
        public int AccessGroupID { get; set; }
        public string? AccessGroupName { get; set; }
        //  public int? RoleID { get; set; }
        public string? AccessGroupDescription { get; set; }

        //public string? AccessGroupsUserID { get; set; }



    }
}
