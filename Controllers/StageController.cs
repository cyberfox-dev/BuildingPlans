using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StageController : Controller
    {
        private readonly IStageServices _stageServices;
        public StageController(IStageServices stageService)
        {
            _stageServices = stageService;
        }
        [HttpPost("AddUpdateStage")]
        public async Task<object> AddUpdateStage([FromBody] StageBindingModel model)
        {
            try
            {

                if (model == null || model.StageName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _stageServices.AddUpdateStages(model.StageID, model.StageName, model.StageOrderNumber,model.CreatedById );
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.StageID > 0 ? "Updated Sussessfully" : "Stage Added Sussessfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteStage")]
        public async Task<object> DeleteStage([FromBody] int StageID)
        {
            try
            {

                if (StageID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _stageServices.DeleteStage(StageID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Stage Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetStageList")]
        public async Task<object> GetStageList()
        {
            try
            {
                var result = await _stageServices.GetAllStages();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Stage List Created", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllStages")]
        public async Task<object> GetAllStages()
        {
            try
            {
                List<StageDTO> stageDTOs = new List<StageDTO>();
                var result = await _stageServices.GetAllStages();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Stages", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
