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
    public class DepartmentsController:Controller
    {

        private readonly IDepartmentsService _departmentsService;

        public DepartmentsController(IDepartmentsService deparmtnetsService)
        {
            _departmentsService = deparmtnetsService;
        }


        [HttpPost("AddUpdateDepartments")]
        public async Task<object> AddUpdateDepartment([FromBody] DepartmentsBindingModel model)
        {
            try
            {

                if (model == null || model.DepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _departmentsService.AddUpdateDepartments(model.DepartmentID, model.DepartmentName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepartmentID > 0 ? "Department Updated Sussessfully" : "Department Added Sussessfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteDepartments")]
        public async Task<object> DeleteDepartment([FromBody] int DepartmentID)
        {
            try
            {

                if (DepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _departmentsService.DeleteDepartments(DepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetDepartmentsList")]
        public async Task<object> GetDepartmentsList([FromBody] string userId)
        {
            try
            {

                if (userId.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _departmentsService.GetAllDepartments(userId);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Departments List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
