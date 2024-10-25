using BuildingPlans.Data;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Controllers
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
                    where accessGL.isActive && accessGL.UserID == model.UserID && accessGL.UserProfileID != null
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        UserID = accessGL.UserID,
                        ZoneID = accessGL.ZoneID,
                        UserProfileID = accessGL.UserProfileID,
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
                    where accessGL.isActive && accessGL.UserID == model.UserID && accessGL.SubDepartmentID == model.DepartmentID && accessGL.UserProfileID != null
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        UserProfileID = accessGL.UserProfileID,
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
                    where accessGL.isActive && accessGL.UserID == model.UserID && accessGL.ZoneID == model.ZoneID && accessGL.SubDepartmentID == model.DepartmentID //&& accessGL.UserProfileID != null
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        UserProfileID = accessGL.UserProfileID,
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
        [HttpPost("GetAccessGroupsByUserProfileID")]
        public async Task<IActionResult> GetAccessGroupsByUserProfileID([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.UserProfileID == model.UserProfileID
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        UserProfileID = accessGL.UserProfileID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all access groups the user is linked to a particular user profileID", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetPeopleByAccessGroupZoneAndSubDept")]
        public async Task<IActionResult> GetPeopleByAccessGroupZoneAndSubDept([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.AccessGroupID == model.AccessGroupID && accessGL.ZoneID == model.ZoneID && (model.DepartmentID == null || accessGL.SubDepartmentID == model.DepartmentID)
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        UserProfileID = accessGL.UserProfileID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all these zone users in specified access group", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetPeopleByAccessGroupAndSubDept")]
        public async Task<IActionResult> GetPeopleByAccessGroupAndSubDept([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.AccessGroupID == model.AccessGroupID && accessGL.SubDepartmentID == model.DepartmentID
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        UserProfileID = accessGL.UserProfileID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all these subdepartment users in specified access group", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetPeopleByZone")]
        public async Task<IActionResult> GetPeopleByZone([FromBody] AccessGroupUserLinkBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGL in _context.AccessGroupUserLink
                    where accessGL.isActive && accessGL.ZoneID == model.ZoneID
                    select new AccessGroupsDTO()
                    {
                        AccessGroupUserLinkID = accessGL.AccessGroupUserLinkID,
                        AccessGroupID = accessGL.AccessGroupID,
                        ZoneID = accessGL.ZoneID,
                        UserProfileID = accessGL.UserProfileID,
                        SubDepartmentID = accessGL.SubDepartmentID,
                        UserID = accessGL.UserID,
                        DateCreated = accessGL.DateCreated,
                        DateUpdated = accessGL.DateUpdated,
                        CreatedById = accessGL.CreatedById,
                    }
                ).ToListAsync();

                // Return an Ok response with the data
                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got all users in specified zone", result));
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the error message
                return BadRequest(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }


    }
}
