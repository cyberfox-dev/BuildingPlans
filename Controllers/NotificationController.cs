using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;



        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;

        }

        [HttpPost("AddUpdateNotification")]
        public async Task<object> AddUpdateNotification([FromBody] NotificationBindingModel model)
        {
            try
            {

                if (model == null || model.NotificationName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _notificationService.AddUpdateNotification(model.NotificationID, model.NotificationName, model.NotificationDescription, model.IsRead, model.UserID, model.ApplicationID, model.CreatedById, model.Message);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.NotificationID > 0 ? "Notifications Updated Successfully" : "Notification Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetNotificationByID")]
        public async Task<object> GetNotificationByID([FromBody] int? appliactionID)
        {
            try
            {

                if (appliactionID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _notificationService.GetNotificationByID(appliactionID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Notifications List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetNotificationByUserID")]
        public async Task<object> GetNotificationByUserID([FromBody] NotificationBindingModel model)
        {
            try
            {

                if (model.CreatedById.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _notificationService.GetNotificationByUserID(model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all notifications for user", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetNotificationsForUserID")]
        public async Task<object> GetNotificationsForUserID([FromBody] NotificationBindingModel model)
        {
            try
            {

                if (model.UserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _notificationService.GetNotificationsForUserID(model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all notifications for user", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        [HttpPost("GetNotificationByNotificationID")]
        public async Task<object> GetNotificationByNotificationID([FromBody] int? notificationID)
        {
            try
            {

                if (notificationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _notificationService.GetNotificationByNotificationID(notificationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Notifications List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        [HttpPost("GetUnreadNotificationsCount")]
        public async Task<object> GetUnreadNotificationsCount([FromBody] NotificationBindingModel model)
        {
            try
            {

                if (model.UserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _notificationService.GetUnreadNotificationsCount(model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Notifications Count Acquired", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }

}
