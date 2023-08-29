using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class PermitSubForComment : BaseEntity
    {

        [Key]
        public int? PermitSubForCommentID { get; set; }

        public int? ApplicationID { get; set; }
        
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? UserAssaignedToComment { get; set; }

        public string? PermitComment { get; set; }

        public string? PermitCommentStatus { get; set; }

        public int? ZoneID { get; set; }

        public string? ZoneName { get; set; }

    }
}
