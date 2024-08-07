﻿using BuildingPlans.DTO;
using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRolesService _rolesService;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolesController(IRolesService rolesService, RoleManager<IdentityRole> roleManager)
        {
            _rolesService = rolesService;
            _roleManager = roleManager;
        }

        [HttpPost("AddUpdateRole")]
        public async Task<object> AddUpdateRole([FromBody] RolesBindingModel model)
        {
            try
            {

                //For Identity Roles
                //if (model == null || model.RoleName.Length < 1)
                //{
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                //}

                //else
                //{
                //    if (!(await _roleManager.RoleExistsAsync(model.RoleName)))
                //    {
                //        var result = await _roleManager.CreateAsync(new IdentityRole(model.RoleName));
                //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Role Added Successfully", result));
                //    }
                //    else
                //    {
                //        //var tempRoleTable = _roleManager.FindByIdAsync(model.RoleID);

                //        var result = await _roleManager.UpdateAsync(new IdentityRole(model.RoleName));
                //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Role Updated Successfully", result));
                //    }
                //}



                if (model == null || model.RoleName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _rolesService.AddUpdateRole(model.RoleID, model.RoleName, model.RoleType, model.RoleDescription, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.RoleID > 0 ? "Role Updated Successfully" : "Role Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteRole")]
        public async Task<object> DeleteRole([FromBody] int roleID)
        {
            try
            {

                if (roleID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _rolesService.DeleteRole(roleID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Role Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetRoleByRoleID")]
        public async Task<object> GetRoleByRoleID([FromBody] int roleId)
        {
            try
            {

                if (roleId < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _rolesService.GetRoleByRoleID(roleId);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Roles List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllRoles")]
        public async Task<object> GetAllRoles()
        {
            try
            {
                List<RolesDTO> roleDTOs = new List<RolesDTO>();
                var result = await _rolesService.GetAllRoles();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Roles", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }









    }
}
