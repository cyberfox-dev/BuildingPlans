using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController: ControllerBase
    {

        private readonly IDepartmentsService _departmentsService;

        public DepartmentsController(IDepartmentsService deparmtnetsService)
        {
            _departmentsService = deparmtnetsService;
        }


        [HttpPost("AddUpdateDepartments")]
        public async Task<object> AddUpdateDepartments([FromBody] DepartmentsBindingModel model)
        {
            try
            {

                if (model == null || model.DepartmentName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _departmentsService.AddUpdateDepartments(model.DepartmentID, model.DepartmentName, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepartmentID > 0 ? "Department Updated Successfully" : "Department Added Successfully"), result));
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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetDepartmentsList")]
        public async Task<object> GetDepartmentsList()
        {
            try
            {
                List<DepartmentsDTO> departmentsDTOs = new List<DepartmentsDTO>();
                var result = await _departmentsService.GetAllDepartments();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Departments", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
