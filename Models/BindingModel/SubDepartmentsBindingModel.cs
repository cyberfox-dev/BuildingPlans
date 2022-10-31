namespace WayleaveManagementSystem.Models.BindingModel
{
    public class SubDepartmentsBindingModel
    {
        public int SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public int DepartmentID { get; set; }


        public int? CreatedById { get; set; }
        public bool isActive { get; set; }
    }
}
