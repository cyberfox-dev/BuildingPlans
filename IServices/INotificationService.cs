using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface INotificationService
    {
        Task<Notification> AddUpdateNotification(int? notificationID, string? notificationName, string? notificationDescription, bool? isRead, string? userID, int? applicationID, string? createdByID);

        Task<List<NotificationDTO>> GetNotificationByID(int? applicationID);


    }
}
