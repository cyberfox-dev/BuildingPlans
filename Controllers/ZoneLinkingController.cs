using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZoneLinkingController : Controller
    {
        private readonly IZoneLinkServices _zonesLinkingServices;

        public ZoneLinkingController(IZoneLinkServices zoneLinkService)
        {
            _zonesLinkingServices = zoneLinkService;
        }
        [HttpPost("AddUpdateZoneLink")]
        public async Task<object> AddUpdateZoneLink([FromBody] ZoneLinkBindingModel model)
        {
            try
            {

                if (model == null || model.ZoneLinkID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesLinkingServices.AddUpdateZoneLink(model.ZoneLinkID, model.DepartmentID, model.SubDepartmentID, model.AssignedUserID, model.UserType);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ZoneLinkID > 0 ? "Zone Link Updated Sussessfully" : "Zone Link Added Sussessfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteZoneLink")]
        public async Task<object> DeleteZoneLink([FromBody] int zoneID)
        {
            try
            {

                if (zoneID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesLinkingServices.DeleteZoneLink(zoneID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetZoneLinkList")]
        public async Task<object> GetAllZoneLinks()
        {
            try
            {
                var result = await _zonesLinkingServices.GetAllZoneLinks();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
