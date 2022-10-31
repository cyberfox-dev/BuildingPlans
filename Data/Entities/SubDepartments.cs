using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class SubDepartments:BaseEntity
    {

        [Key]
        public int SubDepartmentID { get; set; }

        public string SubDepartmentName { get; set; }

        public int DepartmentID { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public int? CreatedById { get; set; }
        public bool isActive { get; set; }

    }
}
