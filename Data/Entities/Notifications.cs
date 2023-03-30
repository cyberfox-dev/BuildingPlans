using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Notification : BaseEntity
    {
        [Key]
        public int? NotificationID { get; set; }
        public string? NotificationName { get; set; }

        public string? NotificationDescription { get; set; }
        public bool? IsRead { get; set; }

        public int? UserID { get; set; }
        public int? ApplicationID { get; set; }


    }
}
