using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.NetworkInformation;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Data.Migrations;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;
        private readonly AppDBContext _context;

        public UserProfileController(IUserProfileService userProfileService, AppDBContext context)
        {
            _userProfileService = userProfileService;
            _context = context;
        }


        [HttpPost("AddUpdateUserProfiles")]
        public async Task<object> AddUpdateUserProfiles([FromBody] UsersProfileBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.UserProfileID < 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    //  var result = await _userProfileService.AddUpdateUserProfiles(model.UserProfileID, model.UserID, model.FullName, model.Email, model.PhoneNumber, model.isInternal, model.BP_Number, model.CompanyName, model.CompanyRegNo, model.PhyscialAddress, model.Directorate, model.DepartmentID, model.SubDepartmentID, model.Branch, model.CostCenterNumber, model.CostCenterOwner, model.CopyOfID, model.CreatedById, model.IdNumber, model.zoneID, model.VatNumber, model.refNumber, model.companyType, model.SubDepartmentName, model.isDepartmentAdmin, model.isZoneAdmin);
                    if (model.UserProfileID == 0)
                    {
                        model.UserProfileID = null;
                    }
                    //this checks is the record exists in the db
                    var tempUserProfile = _context.UserProfilesTable.FirstOrDefault(x => x.UserProfileID == model.UserProfileID);

                    //if the object is null assume that the user is tying to add a new Professional
                    if (tempUserProfile == null)
                    {
                        //create a new object of professional entity class then initialize the object with given infomation
                        tempUserProfile = new UserProfile()
                        {

                            UserID = model.UserID,
                            Name = model.Name,
                            FullName = model.FullName,
                            Surname = model.Surname,
                            Email = model.Email,
                            AlternativeEmail = model.AlternativeEmail,
                            isInternal = model.isInternal,
                            isDefault = model.isDefault,

                            PhoneNumber = model.PhoneNumber,
                            AlternativePhoneNumber = model.AlternativePhoneNumber,
                            BP_Number = model.BP_Number,
                            CompanyName = model.CompanyName,
                            CompanyRegNo = model.CompanyRegNo,
                            PhyscialAddress = model.PhyscialAddress,
                            CopyOfID = model.CopyOfID,
                            IdNumber = model.IdNumber,
                            VatNumber = model.VatNumber,
                            ICASALicense = model.ICASALicense,

                            Directorate = model.Directorate,
                            DepartmentID = model.DepartmentID,
                            DepartmentName = model.DepartmentName,
                            Branch = model.Branch,
                            CostCenterNumber = model.CostCenterNumber,
                            CostCenterOwner = model.CostCenterOwner,
                            depConfirmation = model.depConfirmation,
                            zoneID = model.zoneID,
                            zoneName = model.zoneName,
                            refNumber = model.refNumber,
                            companyType = model.companyType,
                            SubDepartmentID = model.SubDepartmentID,
                            SubDepartmentName = model.SubDepartmentName,
                            isDepartmentAdmin = model.isDepartmentAdmin,
                            isZoneAdmin = model.isZoneAdmin,


                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true,
                        };

                        //After the inizlization add to the db
                        await _context.UserProfilesTable.AddAsync(tempUserProfile);
                        await _context.SaveChangesAsync();

                        result = tempUserProfile;

                    }
                    else //if it is not null then user is doing an update 
                    {
                        if (model.UserProfileID != null)
                        {
                            tempUserProfile.UserProfileID = model.UserProfileID;
                        }

                        if (model.UserID != null)
                        {
                            tempUserProfile.UserID = model.UserID;
                        }

                        if (model.Name != null)
                        {
                            tempUserProfile.Name = model.Name;
                        }

                        if (model.FullName != null)
                        {
                            tempUserProfile.FullName = model.FullName;
                        }

                        if (model.Surname != null)
                        {
                            tempUserProfile.Surname = model.Surname;
                        }

                        if (model.Email != null)
                        {
                            tempUserProfile.Email = model.Email;
                        }

                        if (model.AlternativeEmail != null)
                        {
                            tempUserProfile.AlternativeEmail = model.AlternativeEmail;
                        }

                        if (model.isInternal != null)
                        {
                            tempUserProfile.isInternal = model.isInternal;
                        }

                        if (model.isDefault != null)
                        {
                            tempUserProfile.isDefault = model.isDefault;
                        }

                        if (model.PhoneNumber != null)
                        {
                            tempUserProfile.PhoneNumber = model.PhoneNumber;
                        }

                        if (model.AlternativePhoneNumber != null)
                        {
                            tempUserProfile.AlternativePhoneNumber = model.AlternativePhoneNumber;
                        }

                        if (model.BP_Number != null)
                        {
                            tempUserProfile.BP_Number = model.BP_Number;
                        }

                        if (model.CompanyName != null)
                        {
                            tempUserProfile.CompanyName = model.CompanyName;
                        }

                        if (model.CompanyRegNo != null)
                        {
                            tempUserProfile.CompanyRegNo = model.CompanyRegNo;
                        }

                        if (model.PhyscialAddress != null)
                        {
                            tempUserProfile.PhyscialAddress = model.PhyscialAddress;
                        }

                        if (model.CopyOfID != null)
                        {
                            tempUserProfile.CopyOfID = model.CopyOfID;
                        }

                        if (model.IdNumber != null)
                        {
                            tempUserProfile.IdNumber = model.IdNumber;
                        }

                        if (model.VatNumber != null)
                        {
                            tempUserProfile.VatNumber = model.VatNumber;
                        }

                        if (model.ICASALicense != null)
                        {
                            tempUserProfile.ICASALicense = model.ICASALicense;
                        }

                        if (model.Directorate != null)
                        {
                            tempUserProfile.Directorate = model.Directorate;
                        }

                        if (model.DepartmentID != null)
                        {
                            tempUserProfile.DepartmentID = model.DepartmentID;
                        }

                        if (model.DepartmentName != null)
                        {
                            tempUserProfile.DepartmentName = model.DepartmentName;
                        }

                        if (model.Branch != null)
                        {
                            tempUserProfile.Branch = model.Branch;
                        }

                        if (model.CostCenterNumber != null)
                        {
                            tempUserProfile.CostCenterNumber = model.CostCenterNumber;
                        }

                        if (model.CostCenterOwner != null)
                        {
                            tempUserProfile.CostCenterOwner = model.CostCenterOwner;
                        }

                        if (model.depConfirmation != null)
                        {
                            tempUserProfile.depConfirmation = model.depConfirmation;
                        }

                        if (model.zoneID != null)
                        {
                            tempUserProfile.zoneID = model.zoneID;
                        }

                        if (model.zoneName != null)
                        {
                            tempUserProfile.zoneName = model.zoneName;
                        }

                        if (model.refNumber != null)
                        {
                            tempUserProfile.refNumber = model.refNumber;
                        }

                        if (model.companyType != null)
                        {
                            tempUserProfile.companyType = model.companyType;
                        }

                        if (model.SubDepartmentID != null)
                        {
                            tempUserProfile.SubDepartmentID = model.SubDepartmentID;
                        }

                        if (model.SubDepartmentName != null)
                        {
                            tempUserProfile.SubDepartmentName = model.SubDepartmentName;
                        }

                        if (model.isDepartmentAdmin != null)
                        {
                            tempUserProfile.isDepartmentAdmin = model.isDepartmentAdmin;
                        }

                        if (model.isZoneAdmin != null)
                        {
                            tempUserProfile.isZoneAdmin = model.isZoneAdmin;
                        }

                        
                       
                        tempUserProfile.DateUpdated = DateTime.Now;

                        if (model.CreatedById != null)
                        {
                            tempUserProfile.CreatedById = model.CreatedById;
                        }

                      
                        _context.Update(tempUserProfile);
                        await _context.SaveChangesAsync();
                        result = tempUserProfile;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.UserProfileID > 0 ? "User Profile Updated Successfully" : "User Profile Added Successfully"), result));
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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professional Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("UserGainsApproval")]
        public async Task<object> UserGainsApproval([FromBody] int userProfileID)
        {
            try
            {

                if (userProfileID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _userProfileService.UserGainsApproval(userProfileID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User Given Access", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        [HttpPost("UserDoesntGainApproval")]
        public async Task<object> UserDoesntGainApproval([FromBody] int userProfileID)
        {
            try
            {

                if (userProfileID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _userProfileService.UserDoesntGainApproval(userProfileID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User NOT Given Access", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        //[FromBody] string userId UserGainsApproval
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


        /*Get external users*/
        [HttpGet("GetExternalUsers")]
        public async Task<object> GetExternalUsers()
        {
            try
            {


                    var result = await _userProfileService.GetExternalUsers();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "UserProfile List fetched", result));
                


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("GetDefaltUserProfile")]
        public async Task<object> GetDefaltUserProfile([FromBody] UsersProfileBindingModel model)
        {
            try
            {
                var result = await (
          from UserProfile in _context.UserProfilesTable
          where UserProfile.UserID == model.UserID && UserProfile.isDefault == true && UserProfile.isActive == true || UserProfile.UserID == model.UserID && UserProfile.isDefault == null && UserProfile.isActive == true
          select new UserProfileDTO()
          {
              UserProfileID = UserProfile.UserProfileID,
              UserID = UserProfile.UserID,
              Name = UserProfile.Name,
              FullName = UserProfile.FullName,
              Surname = UserProfile.Surname,
              Email = UserProfile.Email,
              AlternativeEmail = UserProfile.AlternativeEmail,
              isInternal = UserProfile.isInternal,
              isDefault = UserProfile.isDefault,
              PhoneNumber = UserProfile.PhoneNumber,
              AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
              BP_Number = UserProfile.BP_Number,
              CompanyName = UserProfile.CompanyName,
              CompanyRegNo = UserProfile.CompanyRegNo,
              PhyscialAddress = UserProfile.PhyscialAddress,
              CopyOfID = UserProfile.CopyOfID,
              IdNumber = UserProfile.IdNumber,
              VatNumber = UserProfile.VatNumber,
              ICASALicense = UserProfile.ICASALicense,
              Directorate = UserProfile.Directorate,
              DepartmentID = UserProfile.DepartmentID,
              DepartmentName = UserProfile.DepartmentName,
              Branch = UserProfile.Branch,
              CostCenterNumber = UserProfile.CostCenterNumber,
              CostCenterOwner = UserProfile.CostCenterOwner,
              depConfirmation = UserProfile.depConfirmation,
              zoneID = UserProfile.zoneID,
              zoneName = UserProfile.zoneName,
              refNumber = UserProfile.refNumber,
              companyType = UserProfile.companyType,
              SubDepartmentID = UserProfile.SubDepartmentID,
              SubDepartmentName = UserProfile.SubDepartmentName,
              isDepartmentAdmin = UserProfile.isDepartmentAdmin,
              isZoneAdmin = UserProfile.isZoneAdmin,
              DateCreated = DateTime.Now,
              DateUpdated = DateTime.Now,
              CreatedById = UserProfile.CreatedById,


          }

          ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }


        }


        [HttpPost("GetUserByUserProfileID")]
        public async Task<object> GetUserByUserProfileID([FromBody] UsersProfileBindingModel model)
        {
            try
            {
                var result = await (
          from UserProfile in _context.UserProfilesTable
          where UserProfile.UserProfileID == model.UserProfileID && UserProfile.isActive == true
          select new UserProfileDTO()
          {
              UserProfileID = UserProfile.UserProfileID,
              UserID = UserProfile.UserID,
              Name = UserProfile.Name,
              FullName = UserProfile.FullName,
              Surname = UserProfile.Surname,
              Email = UserProfile.Email,
              AlternativeEmail = UserProfile.AlternativeEmail,
              isInternal = UserProfile.isInternal,
              isDefault = UserProfile.isDefault,
              PhoneNumber = UserProfile.PhoneNumber,
              AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
              BP_Number = UserProfile.BP_Number,
              CompanyName = UserProfile.CompanyName,
              CompanyRegNo = UserProfile.CompanyRegNo,
              PhyscialAddress = UserProfile.PhyscialAddress,
              CopyOfID = UserProfile.CopyOfID,
              IdNumber = UserProfile.IdNumber,
              VatNumber = UserProfile.VatNumber,
              ICASALicense = UserProfile.ICASALicense,
              Directorate = UserProfile.Directorate,
              DepartmentID = UserProfile.DepartmentID,
              DepartmentName = UserProfile.DepartmentName,
              Branch = UserProfile.Branch,
              CostCenterNumber = UserProfile.CostCenterNumber,
              CostCenterOwner = UserProfile.CostCenterOwner,
              depConfirmation = UserProfile.depConfirmation,
              zoneID = UserProfile.zoneID,
              zoneName = UserProfile.zoneName,
              refNumber = UserProfile.refNumber,
              companyType = UserProfile.companyType,
              SubDepartmentID = UserProfile.SubDepartmentID,
              SubDepartmentName = UserProfile.SubDepartmentName,
              isDepartmentAdmin = UserProfile.isDepartmentAdmin,
              isZoneAdmin = UserProfile.isZoneAdmin,
              DateCreated = DateTime.Now,
              DateUpdated = DateTime.Now,
              CreatedById = UserProfile.CreatedById,


          }

          ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }


        }


        [HttpPost("GetUserByEmail")] //The goal will be to get only confirmed people via email
        public async Task<object> GetUserByEmailD([FromBody] UsersProfileBindingModel model)
        {
            try
            {
                var result = await (
          from UserProfile in _context.UserProfilesTable
          where UserProfile.Email == model.Email && UserProfile.isActive == true && UserProfile.depConfirmation == true
          select new UserProfileDTO()
          {
              UserProfileID = UserProfile.UserProfileID,
              UserID = UserProfile.UserID,
              Name = UserProfile.Name,
              FullName = UserProfile.FullName,
              Surname = UserProfile.Surname,
              Email = UserProfile.Email,
              AlternativeEmail = UserProfile.AlternativeEmail,
              isInternal = UserProfile.isInternal,
              isDefault = UserProfile.isDefault,
              PhoneNumber = UserProfile.PhoneNumber,
              AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
              BP_Number = UserProfile.BP_Number,
              CompanyName = UserProfile.CompanyName,
              CompanyRegNo = UserProfile.CompanyRegNo,
              PhyscialAddress = UserProfile.PhyscialAddress,
              CopyOfID = UserProfile.CopyOfID,
              IdNumber = UserProfile.IdNumber,
              VatNumber = UserProfile.VatNumber,
              ICASALicense = UserProfile.ICASALicense,
              Directorate = UserProfile.Directorate,
              DepartmentID = UserProfile.DepartmentID,
              DepartmentName = UserProfile.DepartmentName,
              Branch = UserProfile.Branch,
              CostCenterNumber = UserProfile.CostCenterNumber,
              CostCenterOwner = UserProfile.CostCenterOwner,
              depConfirmation = UserProfile.depConfirmation,
              zoneID = UserProfile.zoneID,
              zoneName = UserProfile.zoneName,
              refNumber = UserProfile.refNumber,
              companyType = UserProfile.companyType,
              SubDepartmentID = UserProfile.SubDepartmentID,
              SubDepartmentName = UserProfile.SubDepartmentName,
              isDepartmentAdmin = UserProfile.isDepartmentAdmin,
              isZoneAdmin = UserProfile.isZoneAdmin,
              DateCreated = DateTime.Now,
              DateUpdated = DateTime.Now,
              CreatedById = UserProfile.CreatedById,
          }

          ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPost("AdminConfig")]
        public async Task<object> AdminConfig([FromBody] UsersProfileBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null || model.UserProfileID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

                // Retrieve the existing profile
                var existingProfile = _context.UserProfilesTable.FirstOrDefault(x => x.UserProfileID == model.UserProfileID);

                if (existingProfile == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "User profile not found", null));
                }

                // Update only if the corresponding property in the model is not null
                if (model.isDepartmentAdmin != null)
                {
                    existingProfile.isDepartmentAdmin = model.isDepartmentAdmin;
                }

                if (model.isZoneAdmin != null)
                {
                    existingProfile.isZoneAdmin = model.isZoneAdmin;
                }

                if (model.CreatedById != null)
                {
                    existingProfile.CreatedById = model.CreatedById;
                }

                existingProfile.DateUpdated = DateTime.Now;

                _context.Update(existingProfile);
                await _context.SaveChangesAsync();
                result = existingProfile;

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department and/or Zone Admin privileges have been changed", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpGet("GetInternalUsers")]
        public async Task<object> GetInternalUsers()
        {
            try
            {


                var result = await _userProfileService.GetInternalUsers();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "UserProfile List fetched", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllDepartmentAdmins")]
        public async Task<object> GetAllDepartmentAdmins()
        {
            try
            {


                var result = await _userProfileService.GetAllDepartmentAdmins();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department Admins List fetched", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        

       [HttpPost("GetAllUsersToLinkToDep")]
        public async Task<object> GetAllUsersToLinkToDep([FromBody] int depID)
        {
            try
            {

                if (depID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {

                    var result = await _userProfileService.GetAllUsersToLinkToDep(depID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Users fetched", result));

                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetUsersBySubDepartmentName")]
        public async Task<object> GetUsersBySubDepartmentName([FromBody] AccessGroupsBindingModel model)
        {
            try
            {

                if (model.SubDepartmentName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _userProfileService.GetUsersBySubDepartmentName(model.SubDepartmentName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "UserProfile List fetched", result));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("UpdateActingDepartment")]
        public async Task<object> UpdateActingDepartment([FromBody] int userProfileID)
        {
            try
            {
                if (userProfileID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Invalid UserProfileID", null));
                }
                else
                {
                    var result = await _userProfileService.UpdateActingDepartment(userProfileID);
                    if (result)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Changed department successfully", result));
                    }
                    else
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Request for department change unsuccessful ", null));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }


    }
}
