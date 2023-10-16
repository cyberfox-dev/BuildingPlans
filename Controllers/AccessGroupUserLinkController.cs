using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessGroupUserLinkController : ControllerBase
    {
        private readonly AppDBContext _context;


        public AccessGroupUserLinkController(AppDBContext context)
        {
            _context = context;

        }

        [HttpPost("GetAccessGroupByUserID")]
        public async Task<IActionResult> GetAccessGroupByUserID([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.UserID == model.UserID
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        UserID = accessGL.UserID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all access groups the user is linked to", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetAccessGroupsBySubDeptAndUserID")]
        public async Task<IActionResult> GetAccessGroupsBySubDeptAndUserID([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.UserID == model.UserID && accessGL.SubDepartmentID == model.SubDepartmentID
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all access groups the user is linked to", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetAccessGroupsBySubDeptZoneAndUserID")]
        public async Task<IActionResult> GetAccessGroupsBySubDeptZoneAndUserID([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.UserID == model.UserID && accessGL.ZoneID == model.ZoneID && accessGL.SubDepartmentID == model.SubDepartmentID
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all access groups the user is linked to in specified zone", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
