using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class AuditTrail:BaseEntity
    {
        //Audit Trail Kyle 
        [Key]
        public int? AuditTrailID { get; set; } 
        public int? ApplicationID { get; set; }
        public string? Description { get; set; }
        public bool? IsInternal { get; set; }
        public string? SubDepartmentName { get; set; }
        public string? ZoneName { get; set; }
    }
}
