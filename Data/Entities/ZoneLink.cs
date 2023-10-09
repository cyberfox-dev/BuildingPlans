using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ZoneLink : BaseEntity
    {
        [Key]
        public int? ZoneLinkID { get; set; }

        public int? ZoneID { get; set; }

        public string? ZoneName { get; set; }
        public int? DepartmentID { get; set; }

        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }

        public string? AssignedUserID { get; set; }

        public string? UserType { get; set; }

        public bool? isDepartmentAdmin { get; set; }
        public bool? isZoneAdmin { get; set; }
        public bool? isDefault { get; set; }

    }
}
