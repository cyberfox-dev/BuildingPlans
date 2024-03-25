using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class NotificationService : INotificationService
    {
        private readonly AppDBContext _context;

        public NotificationService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Notification> AddUpdateNotification(int? notificationID, string? notificationName, string? notificationDescription, bool? isRead, string? userID, int? applicationID, string? createdByID, string? message)
        {

            if (notificationID == 0)
            {
                notificationID = null;
            }

            var tempNotificationTable = _context.Notification.FirstOrDefault(x => x.NotificationID == notificationID);


            if (tempNotificationTable == null)
            {

                tempNotificationTable = new Notification()
                {
                    NotificationName = notificationName,
                    NotificationDescription = notificationDescription,
                    IsRead = isRead,
                    UserID = userID,
                    ApplicationID = applicationID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdByID,
                    isActive = true,
                    Message = message
                };


                await _context.Notification.AddAsync(tempNotificationTable);
                await _context.SaveChangesAsync();

                return tempNotificationTable;

            }
            else
            {

                tempNotificationTable.NotificationName = notificationName;
                tempNotificationTable.NotificationDescription = notificationDescription;
                tempNotificationTable.DateUpdated = DateTime.Now;
                tempNotificationTable.IsRead = isRead;
                tempNotificationTable.isActive = true;

                _context.Update(tempNotificationTable);
                await _context.SaveChangesAsync();
                return tempNotificationTable;
            }



        }

        public async Task<List<NotificationDTO>> GetNotificationByID(int? appliactionID)
        {
            return await (
                from Notification in _context.Notification
                where Notification.isActive == true && Notification.ApplicationID == appliactionID
                select new NotificationDTO()
                {
                    NotificationID = Notification.NotificationID,
                    NotificationName = Notification.NotificationName,
                    NotificationDescription = Notification.NotificationDescription,
                    IsRead = Notification.IsRead,
                    UserID = Notification.UserID,
                    ApplicationID = Notification.ApplicationID,
                    DateCreated = Notification.DateCreated,
                    DateUpdated = DateTime.Now,
                    CreatedById = Notification.CreatedById,
                    Message = Notification.Message,
                    isActive = true
                }
                ).ToListAsync();
        }
        public async Task<List<NotificationDTO>> GetNotificationByUserID(string? createdByID)
        {
            return await (
                from Notification in _context.Notification
                where Notification.isActive == true && Notification.CreatedById == createdByID
                select new NotificationDTO()
                {
                    NotificationID = Notification.NotificationID,
                    NotificationName = Notification.NotificationName,
                    NotificationDescription = Notification.NotificationDescription,
                    IsRead = Notification.IsRead,
                    UserID = Notification.UserID,
                    ApplicationID = Notification.ApplicationID,
                    DateCreated = Notification.DateCreated,
                    DateUpdated = DateTime.Now,
                    CreatedById = Notification.CreatedById,
                    Message = Notification.Message,
                    isActive = true
                }
                ).ToListAsync();
        }
        #region escalation Sindiswa 30 January 2024 & 31 January 2024
        public async Task<List<NotificationDTO>> GetNotificationsForUserID(string? userID)
        {
            return await (
                from Notification in _context.Notification
                where Notification.isActive == true && Notification.UserID == userID
                select new NotificationDTO()
                {
                    NotificationID = Notification.NotificationID,
                    NotificationName = Notification.NotificationName,
                    NotificationDescription = Notification.NotificationDescription,
                    IsRead = Notification.IsRead,
                    UserID = Notification.UserID,
                    ApplicationID = Notification.ApplicationID,
                    DateCreated = Notification.DateCreated,
                    DateUpdated = Notification.DateUpdated,
                    CreatedById = Notification.CreatedById,
                    Message = Notification.Message,
                    isActive = true
                }
                ).ToListAsync();
        }
        public async Task<List<NotificationDTO>> GetNotificationByNotificationID(int? notificationID)
        {
            return await (
                from Notification in _context.Notification
                where Notification.isActive == true && Notification.NotificationID == notificationID
                select new NotificationDTO()
                {
                    NotificationID = Notification.NotificationID,
                    NotificationName = Notification.NotificationName,
                    NotificationDescription = Notification.NotificationDescription,
                    IsRead = Notification.IsRead,
                    UserID = Notification.UserID,
                    ApplicationID = Notification.ApplicationID,
                    DateCreated = Notification.DateCreated,
                    DateUpdated = Notification.DateUpdated,
                    CreatedById = Notification.CreatedById,
                    Message = Notification.Message,
                    isActive = true
                }
                ).ToListAsync();
        }
        #endregion
        //notifications Sindiswa 31 January 2024
        public async Task<int> GetUnreadNotificationsCount(string? userID)
        {
            return await (
                from Notification in _context.Notification
                where Notification.isActive == true && Notification.UserID == userID && Notification.IsRead == false
                select Notification
            ).CountAsync();
        }
    }
}