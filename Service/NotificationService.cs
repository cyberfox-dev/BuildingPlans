using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Service
{
    public class NotificationService : INotificationService
    {
        private readonly AppDBContext _context;

        public NotificationService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Notification> AddUpdateNotification(int? notificationID, string? notificationName, string? notificationDescription, bool? isRead, string? userID, int? applicationID, string? createdByID)
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
                    isActive = true
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
                where  Notification.isActive == true && Notification.ApplicationID == appliactionID
                select new NotificationDTO()
                {
                    NotificationID = Notification.NotificationID,
                    NotificationName = Notification.NotificationName,
                    NotificationDescription = Notification.NotificationDescription,
                    IsRead = Notification.IsRead,
                    UserID = Notification.UserID,
                    ApplicationID = Notification.ApplicationID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = Notification.CreatedById,
                    isActive = true
                }
                ).ToListAsync();
        }

    }
}