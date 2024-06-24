namespace BuildingPlans.Models.BindingModel
{
    public class DepartmentsBindingModel
    {
        public int DepartmentID { get; set; }
        public string? DepartmentName { get; set; } //BPRegister Sindiswa 20062024 - made it a nullable string because for some reason, without doing so the fetch department by functional area method was failing

        public string? CreatedById { get; set; }
        public bool isActive { get; set; }

        public bool hasSubDepartment { get; set; }
        public bool? needsZXNumber { get; set; } //zxNumberUpdate Sindiswa 01 March 2024
        public string? FunctionalArea { get; set; }
    }
}
