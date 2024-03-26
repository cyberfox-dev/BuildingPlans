using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Service;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPManDocController : ControllerBase
    {
        private readonly IBPManDocService _bpMandatoryDocumentUploadsService;

        public BPManDocController(IBPManDocService bpMandatoryDocumentUploadsService)
        {
            _bpMandatoryDocumentUploadsService = bpMandatoryDocumentUploadsService;

        }
        [HttpGet("GetAllMandatoryDocuments")]
        public async Task<object> GetAllMandatoryDocuments()
        {
            try
            {


                var result = await _bpMandatoryDocumentUploadsService.GetAllMandatoryDocuments();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Mandatory Documents", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
