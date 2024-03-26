using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using BuildingPlans.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.Data.Entities;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPDepartmentsController : ControllerBase
    {
        private readonly IBPDepartmentsService _bpDepartmentsService;

        public BPDepartmentsController(IBPDepartmentsService bpDepartmentsService)
        {
            _bpDepartmentsService = bpDepartmentsService;

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
                    var result = await _bpDepartmentsService.AddUpdateDepartments(model.DepartmentID, model.DepartmentName, model.hasSubDepartment,model.FunctionalArea, model.CreatedById );
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
                    var result = await _bpDepartmentsService.DeleteDepartments(DepartmentID);
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
                var result = await _bpDepartmentsService.GetAllDepartments();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Departments", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetDepartmentByDepartmentID")]
        public async Task<object> GetDepartmentByDepartmentID([FromBody] int DepartmentID)
        {
            try
            {

                if (DepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    //var result = await _departmentsService.DeleteDepartments(DepartmentID);//hebana?
                    var result = await _bpDepartmentsService.GetDepartmentByDepartmentID(DepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Department", result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllDepartmentsForFunctionalArea")]
        public async Task<object> GetAllDepartmentsForFunctionalArea([FromBody] DepartmentsBindingModel model)
        {
            try
            {
                if(model.FunctionalArea == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _bpDepartmentsService.GetAllDepartmentsForFunctionalArea(model.FunctionalArea);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Departments For Functional Area", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
