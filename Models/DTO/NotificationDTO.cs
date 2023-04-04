using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    public class NotificationDTO
    {


        public int? NotificationID { get; set; }
        public string? NotificationName { get; set; }

        public string? NotificationDescription { get; set; }
        public bool? IsRead { get; set; }

        public string? UserID { get; set; }
        public int? ApplicationID { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public bool isActive { get; set; }
        public string? CreatedById { get; set; }

    }

}
