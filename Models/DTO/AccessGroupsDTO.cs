using Microsoft.EntityFrameworkCore;

namespace WayleaveManagementSystem.Models.DTO
{
    [Keyless]
    public class AccessGroupsDTO
    {

        //Access Groups
        public int? AccessGroupID { get; set; }
        public string? AccessGroupName { get; set; }

        public string? AccessGroupDescription { get; set; }


        //Role Link
        public int? AccessGroupRoleLinkID { get; set; }

        public int? RoleID { get; set; }
        public string? RoleName { get; set; }


        //Userlink
        public int? AccessGroupUserLinkID { get; set; }

        public string? UserID { get; set; }

        //Base Entity
        public string? CreatedById { get; set; }

    }
}
