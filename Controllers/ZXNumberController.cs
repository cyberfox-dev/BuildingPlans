using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZXNumberController : ControllerBase
    {
        private readonly IZXNumberService _zxNumberService;

        public ZXNumberController(IZXNumberService zXNumberService)
        {
            _zxNumberService = zXNumberService;
        }

        [HttpPost("AddUpdateZXNumber")]
        public async Task<object> AddUpdateZXNumber([FromBody] ZXNumberBindingModel model)
        {
            try
            {

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    //AddUpdateZXNumber(int? zxNumberID, int? applicationID, int? departmentID, string? departmentName, string? zxNumber, string? creadtedByID);
                    var result = await _zxNumberService.AddUpdateZXNumber(model.ZXNumberID, model.ApplicationID, model.DepartmentID, model.DepartmentName, model.ZXNumber, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ZXNumberID > 0 ? "ZX Number Updated Successfully" : "ZX Number Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetZXNumbersByApplicationID")]
        public async Task<object> GetZXNumbersByApplicationID([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zxNumberService.GetZXNumbersByApplicationID(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Recorded ZX Numbers for Application", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        [HttpPost("GetZXNumbersByDepartmentID")]
        public async Task<object> GetZXNumbersByDepartmentID([FromBody] ZXNumberBindingModel model)
        {
            try
            {

                if (model.ApplicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zxNumberService.GetZXNumbersByDepartmentID(model.ApplicationID, model.DepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "ZX Number by Department Fetched", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

    }
}
