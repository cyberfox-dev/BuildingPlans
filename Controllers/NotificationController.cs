using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;

namespace WayleaveManagementSystem.Controllers
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
                    var result = await _notificationService.AddUpdateNotification(model.NotificationID, model.NotificationName, model.NotificationDescription, model.IsRead,model.UserID, model.ApplicationID,model.CreatedById);
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



    }

}
