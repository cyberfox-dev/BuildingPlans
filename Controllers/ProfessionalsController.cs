using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;

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
                    var result = await _professionalsService.AddUpdateProfessional(model.ProfessinalID, model.ProfessinalType, model.FullName, model.BP_Number, model.BpVerified, model.Email, model.PhoneNumber, model.ProfessionalRegNo, model.AppUserID, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ProfessinalID > 0 ? "Professional Updated Sussessfully": "Professional Added Sussessfully"), result));
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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professional Deleted Sussessfully", result));
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


    }
}
