using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessionalsController : ControllerBase
    {

        private readonly IProfessionalsService _professionalsService;

        public ProfessionalsController(IProfessionalsService professionalsService)
        {
            _professionalsService = professionalsService;
        }


        [HttpPost("AddUpdateProfessional")]
        public async Task<object> AddUpdateProfessional([FromBody] ProfessinalsBindingModel model)
        {
            try
            {

                if (model == null || model.ProfessinalType.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsService.AddUpdateProfessional(model.ProfessinalID, model.ProfessinalType, model.FullName, model.BP_Number, model.BpVerified, model.Email, model.PhoneNumber, model.ProfessionalRegNo, model.AppUserID, model.IdNumber, model.CreatedById, model.CIBRating);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ProfessinalID > 0 ? "Professional Updated Successfully": "Professional Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteProfessional")]
        public async Task<object> DeleteProfessional([FromBody] int professionalID)
        {
            try
            {

                if (professionalID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsService.DeleteProfessional(professionalID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professional Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetProfessionalsList")]
        public async Task<object> GetProfessionalsList([FromBody] string userId)
        {
            try
            {

                if (userId.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsService.GetAllProfessionals(userId);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professionals List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetProfessionalsListByProfessionalType")]
        public async Task<object> GetProfessionalsListByProfessionalType([FromBody] ProfessinalsGetByUserProfTypeBindingModel model)
        {
            try
            {

                if (model.AppUserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsService.GetProfessionalsListByProfessionalType(model.AppUserID, model.ProfessinalType);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professionals List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllProfessionalsLinkByApplicationID")]
        public async Task<object> GetAllProfessionalsLinkByApplicationID([FromBody] ProfessinalsGetByUserProfTypeBindingModel model)
        {
            try
            {

                if (model.ApplicationID < 1)
                {
                   
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsService.GetAllProfessionalsLinkByApplicationID(model.ApplicationID, model.ProfessinalType);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All linked Professionals", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
