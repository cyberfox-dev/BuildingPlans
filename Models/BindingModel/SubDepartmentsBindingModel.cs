namespace WayleaveManagementSystem.Models.BindingModel
{
    public class SubDepartmentsBindingModel
    {
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public int? DepartmentID { get; set; }

        public string? SubDepartmentAdminUserID { get; set; }
        public string? GlCode { get; set; }
        public string? ProfitCenter { get; set; }
        public string? CreatedById { get; set; }
        public bool? isActive { get; set; }
    }
}
