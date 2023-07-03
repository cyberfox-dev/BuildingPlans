using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Zones:BaseEntity
    {
        [Key]
        public int? ZoneID { get; set; }

        public string ZoneName { get; set; }

        public int DepartmentID { get; set; }

        public int SubDepartmentID { get; set; }
        public int MapObjectID { get; set; }

    }
}
