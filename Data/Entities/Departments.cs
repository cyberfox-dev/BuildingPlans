using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Departments:BaseEntity
    {
        [Key]
        public int DepartmentID { get; set; }

        public string DepartmentName { get; set; }

        public bool hasSubDepartment { get; set; }
        public bool? needsZXNumber { get; set; } //zxNumberUpdate Sindiswa 01 March 2024


    }
}
