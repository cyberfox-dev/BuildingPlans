namespace WayleaveManagementSystem.Models.BindingModel
{
    public class NotificationBindingModel
    {
        public int? NotificationID { get; set; }
        public string? NotificationName { get; set; }

        public string? NotificationDescription { get; set; }
        public bool? IsRead { get; set; }

        public string? CreatedById { get; set; }
        public int? UserID { get; set; }
        public int? ApplicationID { get; set; }

    }
}
