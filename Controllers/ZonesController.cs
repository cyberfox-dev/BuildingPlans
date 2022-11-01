using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZonesController : Controller
    {
        private readonly IZonesServices _zonesServices;
        public ZonesController(IZonesServices zonesService)
        {
            _zonesServices = zonesService;
        }

        [HttpPost("AddUpdateZones")]
        public async Task<object> AddUpdateZones([FromBody] ZonesBindingModel model)
        {
            try
            {

                if (model == null || model.ZoneName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.AddUpdateZones(model.ZoneID, model.ZoneName, model.DepartmentID, model.SubDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ZoneID > 0 ? "Zone Updated Sussessfully" : "Zone Added Sussessfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteZones")]
        public async Task<object> DeleteZone([FromBody] int ZoneID)
        {
            try
            {

                if (ZoneID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.DeleteZone(ZoneID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetZonesList")]
        public async Task<object> GetZonesList([FromBody] string ZoneName)
        {
            try
            {

                if (ZoneName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.GetAllZones(ZoneName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zones List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

    }
}
