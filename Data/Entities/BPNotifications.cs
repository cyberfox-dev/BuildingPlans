using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPNotifications:BaseEntity
    {
        [Key]
        public int NotificationID { get; set; }
        public int? ApplicationID { get; set; }
        public string? NotificationName { get; set; }
        public string? NotificationDescription { get; set; }
        public bool? isRead { get; set; }
        public string? UserId { get; set; }

       
    }
}
