using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class SubDepartments:BaseEntity
    {

        [Key]
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public int? DepartmentID { get; set; }


    }
}
