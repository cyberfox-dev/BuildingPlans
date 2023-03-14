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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepartmentID > 0 ? "Sub Department Updated Successfully" : "Sub Department Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("AddSubDepartmentAdmin")]
        public async Task<object> AddSubDepartmentAdmin([FromBody] SubDepartmentsBindingModel model)
        {

            try
            {

                if (model == null || model.SubDepartmentAdminUserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.AddSubDepartmentAdmin(model.SubDepartmentID, model.SubDepartmentAdminUserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Department Admin Added Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("DeleteSubDepartments")]
        public async Task<object> DeleteSubDepartments([FromBody] int subDepartmentID)
        {
            try
            {

                if (subDepartmentID < 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.DeleteSubDepartments(subDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Department Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllSubDepartments")]
        public async Task<object> GetAllSubDepartments()
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

        [HttpPost("GetAllNotLinkedSubDepartmentsForComment")]
        public async Task<object> GetAllNotLinkedAndActiveSubDepartments([FromBody] int applicationID)
        {
            try
            {
                var result = await _subDepartmentService.GetAllNotLinkedSubDepartmentsForComment(applicationID);
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Departments List Created", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllLinkedSubDepartmentsForComment")]
        public async Task<object> GetAllLinkedSubDepartmentsForComment([FromBody] int applicationID)
        {
            try
            {
                var result = await _subDepartmentService.GetAllLinkedSubDepartmentsForComment(applicationID);
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
