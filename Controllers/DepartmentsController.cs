﻿using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
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
                    var result = await _departmentsService.AddUpdateDepartments(model.DepartmentID, model.DepartmentName, model.hasSubDepartment, model.CreatedById, /*zxNumberUpdate Sindiswa 01 March 2024*/model.needsZXNumber);
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
                    var result = await _departmentsService.GetDepartmentByDepartmentID(DepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Department", result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        #region zxNumberUpdate Sindiswa 04 March 2024
        [HttpGet("CountDepartmentsThatNeedZXNumber")]
        public async Task<object> CountDepartmentsThatNeedZXNumber()
        {
            try
            {
                // Assuming you have a service method to count departments with true needsZXNumber
                var count = await _departmentsService.CountDepartmentsThatNeedZXNumber();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got the number of Departments that need ZX Number", count));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        #endregion
    }
}
