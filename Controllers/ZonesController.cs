using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;

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
                    var result = await _zonesServices.AddUpdateZones(model.ZoneID, model.ZoneName, model.DepartmentID, model.SubDepartmentID,model.CreatedById);
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
        public async Task<object> GetZonesList()
        {
            try
            {
                var result = await _zonesServices.GetAllZones();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zones List Created", result));

               

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetZoneBySubDepartmentID")]
        public async Task<object> GetZoneBySubDepartmentID([FromBody] ZoneSubDepartmentIDBindingModel model)
        {
            try
            {

                if (model.SubDepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.GetZoneBySubDepartmentID(model.SubDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Zones for given Sub Departments", result));
                }





            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

    }
}
