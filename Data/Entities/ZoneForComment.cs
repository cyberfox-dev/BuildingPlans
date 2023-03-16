using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ZoneForComment : BaseEntity
    {

        [Key]
        public int? ZoneForCommentID { get; set; }

        public int? ApplicationID { get; set; }
        
        public int? SubDepartmentID { get; set; }

        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }












    }
}
