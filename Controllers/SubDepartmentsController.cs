using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubDepartmentsController : ControllerBase
    {
        private readonly ISubDepartmentService _subDepartmentService;

        public SubDepartmentsController(ISubDepartmentService subDepartmentService)
        {
            _subDepartmentService = subDepartmentService;
        }

        [HttpPost("AddUpdateSubDepartments")]
        public async Task<object> AddUpdateSubDepartments([FromBody] SubDepartmentsBindingModel model)
        {

            try
            {

                if (model == null || model.SubDepartmentName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.AddUpdateSubDepartments(model.SubDepartmentID, model.SubDepartmentName, model.DepartmentID, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepartmentID > 0 ? "Sub Department Updated Sussessfully" : "Sub Department Added Sussessfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteSubDepartments")]
        public async Task<object> DeleteSubDepartments([FromBody] string SubDepartmentName)
        {
            try
            {

                if (SubDepartmentName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.DeleteSubDepartments(SubDepartmentName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Department Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetDepartmentsList")]
        public async Task<object> GetSubDepartmentsList()
        {
            try
            {
                var result = await _subDepartmentService.GetAllSubDepartments();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Departments List Created", result));

                

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetSubDepartmentByDepartmentID")]
        public async Task<object> GetSubDepartmentByDepartmentID([FromBody]  SubDepartmentsByDepartmentIdBindingModel model)
        {
            try
            {

                if (model.DepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.GetAllSubDepartmentsBydepartmentID(model.DepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Sub Departments for given department", result));
                }

               



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
