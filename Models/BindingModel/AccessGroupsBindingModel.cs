namespace WayleaveManagementSystem.Models.BindingModel
{
    public class AccessGroupsBindingModel
    {

        //Access Groups
        public int? AccessGroupID { get; set; } // this is also shareed across all 3 tables
        public string? AccessGroupName { get; set; }

        public string? AccessGroupDescription { get; set; }


        //Role Link
        public int? AccessGroupRoleLinkID { get; set; }

        public int? RoleID { get; set; }
        public string? RoleName { get; set; }


        //Userlink
        public int? AccessGroupUserLinkID { get; set; }

        public string? UserID { get; set; }
        public int? UserProfileID { get; set; }

        //Base Entity
        public string? CreatedById { get; set; }
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }
        public int? ZoneID { get; set; }
    }
}
