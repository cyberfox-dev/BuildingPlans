using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using System.Security.Policy;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using System.Net.Http.Headers;

namespace WayleaveManagementSystem.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MandatoryDocumentUploadsController : ControllerBase
    {
        private readonly IMandatoryDocumentUploadsService _mandatoryDocumentUploadsService;



        public MandatoryDocumentUploadsController(IMandatoryDocumentUploadsService mandatoryDocumentUploadsService)
        {
            _mandatoryDocumentUploadsService = mandatoryDocumentUploadsService;

        }

        [HttpPost("AddUpdateMandatoryDocument")]
        public async Task<object> AddUpdateMandatoryDocument([FromBody] MandatoryDocumentUploadsBindingModel model)
        {
            try
            {

                if (model == null || model.MandatoryDocumentName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _mandatoryDocumentUploadsService.AddUpdateMandatoryDocument(model.MandatoryDocumentID, model.MandatoryDocumentName, model.CreatedById,model.MandatoryDocumentCategory);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.MandatoryDocumentID > 0 ? "Mandatory Document Updated Successfully" : "Mandatory Document Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteMandatoryDocument")]
        public async Task<object> DeleteMandatoryDocument([FromBody] int mandatoryDocumentID)
        {
            try
            {

                if (mandatoryDocumentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _mandatoryDocumentUploadsService.DeleteMandatoryDocument(mandatoryDocumentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comment Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllMandatoryDocumentsByID")]
        public async Task<object> GetAllMandatoryDocumentsByID([FromBody] int mandatoryDocumentID)
        {
            try
            {

                if (mandatoryDocumentID < 3)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _mandatoryDocumentUploadsService.GetAllMandatoryDocumentsByID(mandatoryDocumentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllMandatoryDocuments")]
        public async Task<object> GetAllMandatoryDocuments()
        {
            try
            {


                var result = await _mandatoryDocumentUploadsService.GetAllMandatoryDocuments();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Mandatory Documents", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllByMandatoryDocumentCategory")]
        public async Task<object> GetAllByMandatoryDocumentCategory([FromBody] MandatoryDocumentUploadsBindingModel model)
        {
            try
            {
             
                if (model.MandatoryDocumentCategory == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _mandatoryDocumentUploadsService.GetAllByMandatoryDocumentCategory(model.MandatoryDocumentCategory);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllMandatoryDocumentsLinkedToStage")]
        public async Task<object>GetAllMandatoryDocumentsLinkedToStage([FromBody] MandatoryDocumentStageLinkBindingModel model)
        {
            try
            {
                if(model.StageName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _mandatoryDocumentUploadsService.GetAllMandatoryDocumentsLinkedToStage(model.StageName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }

}
