using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ManuallyAssignUsers:BaseEntity
    {

        [Key]
        public int? ReferalID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ProjectNumber { get; set; }
        public string? AssignedToUserId { get; set; }
        public string? Description { get; set; }
    }
}
