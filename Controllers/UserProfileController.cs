using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.NetworkInformation;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }


        [HttpPost("AddUpdateUserProfiles")]
        public async Task<object> AddUpdateUserProfiles([FromBody] UsersProfileBindingModel model)
        {
            try
            {

                if (model == null || model.UserProfileID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _userProfileService.AddUpdateUserProfiles(model.UserProfileID, model.UserID, model.FullName, model.Email, model.PhoneNumber, model.isInternal, model.BP_Number, model.CompanyName, model.CompanyRegNo, model.PhyscialAddress, model.Directorate, model.DepartmentID, model.SubDepartmentID, model.Branch, model.CostCenterNumber, model.CostCenterOwner, model.CopyOfID, model.CreatedById, model.IdNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.UserProfileID > 0 ? "User Profile Updated Sussessfully" : "User Profile Added Sussessfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteUserProfile")]
        public async Task<object> DeleteUserProfile([FromBody] int userProfileID)
        {
            try
            {

                if (userProfileID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _userProfileService.DeleteUserProfile(userProfileID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professional Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        //[FromBody] string userId
        [HttpPost("GetUserByUserID")]
        public async Task<object> GetUserByUserID([FromBody] UsersProfileIdOnlyBindingModel model)
        {
            try
            {

                if (model.UserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _userProfileService.GetUserByUserID(model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "UserProfile List fetched", result));
                    }


                }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
