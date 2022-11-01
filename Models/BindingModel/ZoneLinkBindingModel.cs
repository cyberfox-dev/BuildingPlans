namespace WayleaveManagementSystem.Models.BindingModel
{
    public class ZoneLinkBindingModel
    {
        public int? ZoneLinkID { get; set; }

        public int DepartmentID { get; set; }

        public int SubDepartmentID { get; set; }

        public string? AssignedUserID { get; set; }

        public string? UserType { get; set; }

        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
    }
}
