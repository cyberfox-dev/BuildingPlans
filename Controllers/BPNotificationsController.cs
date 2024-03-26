using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Service;
using BuildingPlans.Models.DTO;
using BuildingPlans.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;
using System.Net.WebSockets;
using System.Security.Cryptography.Xml;
using BuildingPlans.Data.Migrations;


namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPNotificationsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPNotificationsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateNotification")]
        public async Task<object> AddUpdateNotification([FromBody]NotificationBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.NotificationID == 0)
                    {
                        model.NotificationID = null;
                    }

                    var tempNotification = _context.BPNotifications.FirstOrDefault(x => x.NotificationID == model.NotificationID);

                    if(tempNotification == null)
                    {
                        tempNotification = new BPNotifications()
                        {
                            ApplicationID = model.ApplicationID,
                            NotificationName = model.NotificationName,
                            NotificationDescription = model.NotificationDescription,
                            isRead = model.IsRead,
                            UserId = model.UserID,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true,
                        };

                        await _context.BPNotifications.AddAsync(tempNotification);
                        await _context.SaveChangesAsync();

                        result = tempNotification;
                    }

                    else
                    {
                        if(model.NotificationName != null)
                        {
                            tempNotification.NotificationName = model.NotificationName;
                        }
                        if (model.NotificationDescription != null)
                        {
                            tempNotification.NotificationDescription = model.NotificationDescription;
                        }
                        if(model.IsRead != null)
                        {
                            tempNotification.isRead = model.IsRead;
                        }
                        tempNotification.DateUpdated = DateTime.Now;
                        _context.Update(tempNotification);
                        await _context.SaveChangesAsync();

                        result = tempNotification;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.NotificationID > 0 ? "Notification Updated Successfully" : "Notification Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllNotifications")]
        public async Task<object> GetAllNotifications()
        {
            try
            {
                var result = await (from notifications in _context.BPNotifications
                                    where notifications.isActive == true
                                    select new NotificationDTO()
                                    {
                                        NotificationID = notifications.NotificationID,
                                        ApplicationID = notifications.ApplicationID,
                                        NotificationName = notifications.NotificationName,
                                        NotificationDescription = notifications.NotificationDescription,
                                        IsRead = notifications.isRead,
                                        UserID = notifications.UserId,
                                        DateCreated = notifications.DateCreated,
                                        DateUpdated = notifications.DateUpdated,
                                        CreatedById = notifications.CreatedById,
                                        
                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Notifications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }


        }

        [HttpPost("GetAllNewNotificationsForUser")]
        public async Task<object> GetAllNewNotificationsForUser([FromBody] NotificationBindingModel model)
        {
            try
            {
                var result = await (from notifications in _context.BPNotifications
                                    where notifications.UserId == model.UserID && notifications.isActive == true 
                                    && notifications.isRead == false
                                    select new NotificationDTO()
                                    {
                                        NotificationID = notifications.NotificationID,
                                        ApplicationID = notifications.ApplicationID,
                                        NotificationName = notifications.NotificationName,
                                        NotificationDescription = notifications.NotificationDescription,
                                        IsRead = notifications.isRead,
                                        UserID = notifications.UserId,
                                        DateCreated = notifications.DateCreated,
                                        DateUpdated = notifications.DateUpdated,
                                        CreatedById = notifications.CreatedById,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Notifications for user", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteNotificationByNotificationID")]
        public async Task<object> DeleteNotificationByNotificationID([FromBody] NotificationBindingModel model)
        {
            try
            {
                var tempNofication = _context.BPNotifications.FirstOrDefault(x => x.NotificationID == model.NotificationID);

                if ( tempNofication == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    _context.Remove(tempNofication);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Notification Deleted Succesfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllReadNotificationsForUser")]
        public async Task<object> GetAllReadNotificationsForUser([FromBody] NotificationBindingModel model)
        {
            try
            {
                var result = await (from notifications in _context.BPNotifications
                                    where notifications.isActive == true && notifications.isRead == true
                                    && notifications.UserId == model.UserID
                                    select new NotificationDTO()
                                    {
                                        NotificationID = notifications.NotificationID,
                                        ApplicationID = notifications.ApplicationID,
                                        NotificationName = notifications.NotificationName,
                                        NotificationDescription = notifications.NotificationDescription,
                                        IsRead = notifications.isRead,
                                        UserID = notifications.UserId,
                                        DateCreated = notifications.DateCreated,
                                        DateUpdated = notifications.DateUpdated,
                                        CreatedById = notifications.CreatedById,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Notifications for user", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetNotificationByNotificationID")]
        public async Task<object> GetNotificationByNotificationID([FromBody] NotificationBindingModel model)
        {
            try
            {
                var result = await (from notifications in _context.BPNotifications
                                    where notifications.NotificationID == model.NotificationID && notifications.isActive == true
                                    select new NotificationDTO()
                                    {
                                        NotificationID = notifications.NotificationID,
                                        ApplicationID = notifications.ApplicationID,
                                        NotificationName = notifications.NotificationName,
                                        NotificationDescription = notifications.NotificationDescription,
                                        IsRead = notifications.isRead,
                                        UserID = notifications.UserId,
                                        DateCreated = notifications.DateCreated,
                                        DateUpdated = notifications.DateUpdated,
                                        CreatedById = notifications.CreatedById,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Notifications for by NotificationID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

      

        [HttpPost("GetNotificationByApplicationID")]
        public async Task<object> GetNotificationByApplicationID([FromBody]NotificationBindingModel model)
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from notifications in _context.BPNotifications
                                        where notifications.ApplicationID == model.ApplicationID && notifications.isActive == true
                                        select new NotificationDTO()
                                        {
                                            NotificationID = notifications.NotificationID,
                                            ApplicationID = notifications.ApplicationID,
                                            NotificationName = notifications.NotificationName,
                                            NotificationDescription = notifications.NotificationDescription,
                                            IsRead = notifications.isRead,
                                            UserID = notifications.UserId,
                                            DateCreated = notifications.DateCreated,
                                            DateUpdated = notifications.DateUpdated,
                                            CreatedById = notifications.CreatedById,
                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all notifications for application", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }

   
}
