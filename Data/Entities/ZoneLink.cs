using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ZoneLink : BaseEntity
    {
        [Key]
        public int? ZoneLinkID { get; set; }

        public int DepartmentID { get; set; }

        public int SubDepartmentID { get; set; }

        public string? AssignedUserID { get; set; }

        public string? UserType { get; set; }

    }
}
