using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class GLCode : BaseEntity
    {
        [Key]
        public int GLCodeID { get; set; }
        public string? GLCodeName { get; set; }
    }
}
