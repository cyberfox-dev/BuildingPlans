using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Models.DTO
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
        public string? RoleType { get; set; }
        public string? RoleDescription { get; set; } 
        //Userlink
        public int? AccessGroupUserLinkID { get; set; }

        public string? UserID { get; set; }

        //Base Entity
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public bool? isActive { get; set; }

        public int? SubDepartmentID { get; set; }
        public int? ZoneID { get; set; }

        //Zone Link Tings
        public int? UserProfileID { get; set; }

        public string? SubDepartmentName { get; set; }
        public string? ZoneName { get; set; }
        public string? DepartmentName { get; set;}
        public string? FunctionalArea { get; set; }
    }
}
