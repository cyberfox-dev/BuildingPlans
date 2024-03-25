using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface INotificationService
    {
        Task<Notification> AddUpdateNotification(int? notificationID, string? notificationName, string? notificationDescription, bool? isRead, string? userID, int? applicationID, string? createdByID, string? message);

        Task<List<NotificationDTO>> GetNotificationByID(int? applicationID);
        Task<List<NotificationDTO>> GetNotificationByUserID(string? createdByID);
        Task<List<NotificationDTO>> GetNotificationsForUserID(string? userID); //escalation Sindiswa 30 January 2024
        Task<List<NotificationDTO>> GetNotificationByNotificationID(int? notificationID); //escalation Sindiswa 31 January 2024
        Task<int> GetUnreadNotificationsCount(string? userID); //notifications Sindiswa 31 January 2024

    }
}
