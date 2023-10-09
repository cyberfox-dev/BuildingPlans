using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Models.BindingModel
{
    public class ManuallyAssignUsersBindingModel
    {
        public int? ReferalID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ProjectNumber { get; set; }
        public string? AssignedToUserId { get; set; }
        public string? Description { get; set; }
        public string? CreatedById { get; set; }
    }
}
