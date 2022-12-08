using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessionalsLinksController : ControllerBase
    {
        private readonly IProfessionalsLinksService _professionalsLinksService;

        public ProfessionalsLinksController(IProfessionalsLinksService professionalsLinksService)
        {
            _professionalsLinksService = professionalsLinksService;
        }


        [HttpPost("AddUpdateProfessionalsLink")]
        public async Task<object> AddUpdateProfessionalsLink([FromBody] ProfessionalsLinksBindingModel model)
        {
            try
            {

                if (model == null || ModelState.IsValid && model.ProfessionalID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsLinksService.AddUpdateProfessionalsLink(model.ProfessionalsLinkID, model.ApplicationID, model.ProfessionalID, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ProfessionalsLinkID > 0 ? "ProfessionalsLink Updated Sussessfully" : "ProfessionalsLink Added Sussessfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteProfessionalsLink")]
        public async Task<object> DeleteProfessionalsLink([FromBody] int professionalsLinkID)
        {
            try
            {

                if (professionalsLinkID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsLinksService.DeleteProfessionalsLink(professionalsLinkID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "ProfessionalsLink Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllProfessionalsLink")]
        public async Task<object> GetAllProfessionalsLink([FromBody] string userId)
        {
            try
            {

                if (userId.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _professionalsLinksService.GetAllProfessionalsLink(userId);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "ProfessionalsLink List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
