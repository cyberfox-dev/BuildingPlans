﻿using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubDepartmentsController : Controller
    {
        private readonly ISubDepartmentService _subDepartmentService;

        public SubDepartmentsController(ISubDepartmentService subDepartmentService)
        {
            _subDepartmentService = subDepartmentService;
        }

        [HttpPost("AddUpdateSubDepartments")]
        public async Task<object> AddUpdateSubDepartment([FromBody] SubDepartmentsBindingModel model)
        {
            try
            {

                if (model == null || model.SubDepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.AddUpdateSubDepartments(model.SubDepartmentID, model.SubDepartmentName, model.DepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepartmentID > 0 ? "Sub Department Updated Sussessfully" : "Sub Department Added Sussessfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteSubDepartments")]
        public async Task<object> DeleteSubDepartments([FromBody] int SubDepartmentID)
        {
            try
            {

                if (SubDepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.DeleteSubDepartments(SubDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Department Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetDepartmentsList")]
        public async Task<object> GetSubDepartmentsList([FromBody] string userId)
        {
            try
            {

                if (userId.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentService.GetAllSubDepartments(userId);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Sub Departments List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}