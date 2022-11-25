using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.DTO;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRolesService _rolesService;

        public RolesController(IRolesService rolesService)
        {
            _rolesService = rolesService;
        }

        [HttpPost("AddUpdateRole")]
        public async Task<object> AddUpdateRole([FromBody] RolesBindingModel model)
        {
            try
            {

                if (model == null || model.RoleName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _rolesService.AddUpdateRole(model.RoleID, model.RoleName, model.RoleType, model.RoleDescription, model.DateCreated, model.DateUpdated, model.CreatedById, model.isActive);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.RoleID > 0 ? "Role Updated Sussessfully" : "Role Added Sussessfully"), result));
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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Role Deleted Sussessfully", result));
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
