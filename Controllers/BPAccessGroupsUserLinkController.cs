using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Service;
using BuildingPlans.Models.DTO;
using BuildingPlans.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPAccessGroupsUserLinkController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPAccessGroupsUserLinkController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateAccessGroupUserLink")]
        public async Task<object> AddUpdateAccessGroupUserLink([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null || model.AccessGroupID == null || model.AccessGroupName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

               

                else
                {
                    if(model.AccessGroupUserLinkID == 0)
                    {
                        model.AccessGroupUserLinkID = null;
                    }
                    var tempAccessGroupUserLink = _context.BPAccessGroupsUserLinks.FirstOrDefault(x => x.AccessGroupUserLinkID == model.AccessGroupUserLinkID);

                    if (tempAccessGroupUserLink == null)
                    {
                        tempAccessGroupUserLink = new BPAccessGroupsUserLink
                        {
                            AccessGroupID = model.AccessGroupID,
                            AccessGroupName = model.AccessGroupName,
                            ZoneID = model.ZoneID,
                            ZoneName = model.ZoneName,
                            SubdepartmentName = model.SubDepartmentName,
                            UserID = model.UserID,
                            FunctionalArea = model.FunctionalArea,
                            DepartmentName = model.DepartmentName,
                            UserProfileID = model.UserProfileID,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                            
                        };

                        await _context.BPAccessGroupsUserLinks.AddAsync(tempAccessGroupUserLink);
                        await _context.SaveChangesAsync();

                        result = tempAccessGroupUserLink;
                    }

                    else
                    {
                        if(model.AccessGroupName != null)
                        {
                             tempAccessGroupUserLink.AccessGroupName = model.AccessGroupName;
                        }

                        if(model.AccessGroupID != null)
                        {
                            tempAccessGroupUserLink.AccessGroupID = model.AccessGroupID;
                        }

                        if(model.ZoneID != null)
                        {
                            tempAccessGroupUserLink.ZoneID = model.ZoneID;
                        }

                        if(model.ZoneName != null)
                        {
                            tempAccessGroupUserLink.ZoneName = model.ZoneName;
                        }

                        if(model.SubDepartmentName != null)
                        {
                            tempAccessGroupUserLink.SubdepartmentName = model.SubDepartmentName;
                        }

                        if(model.UserID != null)
                        {
                            tempAccessGroupUserLink.UserID = model.UserID;

                        }
                        if(model.FunctionalArea != null)
                        {
                            tempAccessGroupUserLink.FunctionalArea = model.FunctionalArea;
                        }
                        if(model.DepartmentName != null)
                        {
                            tempAccessGroupUserLink.DepartmentName = model.DepartmentName;
                        }
                        if(model.UserProfileID != null)
                        {
                            tempAccessGroupUserLink.UserProfileID = model.UserProfileID;
                        }
                        tempAccessGroupUserLink.DateUpdated = DateTime.Now;
                        tempAccessGroupUserLink.isActive = true;

                         _context.Update(tempAccessGroupUserLink);
                        await _context.SaveChangesAsync();

                        result = tempAccessGroupUserLink;

                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupUserLinkID > 0 ? " Access Group User Link Updated Successfully" : "Access Group User Link Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllUsersForAccessGroupAndZone")]
        public async Task<object> GetAllUsersForAccessGroupAndZone([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from users in _context.BPAccessGroupsUserLinks
                                    where users.ZoneName == model.ZoneName && users.AccessGroupName == model.AccessGroupName && users.SubdepartmentName == model.SubDepartmentName && users.isActive == true
                                    select new AccessGroupsDTO()
                                    {
                                        AccessGroupRoleLinkID = users.AccessGroupUserLinkID,
                                        AccessGroupID = users.AccessGroupID,
                                        AccessGroupName = users.AccessGroupName,
                                        ZoneID = users.ZoneID,
                                        ZoneName = users.ZoneName,
                                        SubDepartmentName =users.SubdepartmentName,
                                        FunctionalArea = users.FunctionalArea,
                                        DepartmentName = users.DepartmentName,
                                        UserID = users.UserID,
                                        UserProfileID = users.UserProfileID
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Users For AccessGroup Area", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteUserFromAccessGroup")]
        public async Task<object> DeleteUserFromAccessGroup([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var tempAccessGroupLink = _context.BPAccessGroupsUserLinks.FirstOrDefault(x => x.AccessGroupUserLinkID == model.AccessGroupUserLinkID);
                if (tempAccessGroupLink == null)
                {

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    tempAccessGroupLink.isActive = false;
                    tempAccessGroupLink.DateUpdated = DateTime.Now;

                    _context.Update(tempAccessGroupLink);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User successfully removed from access group", true));

                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllAccessGroupsForUser")]
        public async Task<object> GetAllAccessGroupsForUser([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from accessGroups in _context.BPAccessGroupsUserLinks
                                    where accessGroups.UserID == model.UserID && accessGroups.isActive == true
                                    select new AccessGroupsDTO()
                                    {
                                        AccessGroupUserLinkID = accessGroups.AccessGroupUserLinkID,
                                        AccessGroupID = accessGroups.AccessGroupID,
                                        AccessGroupName = accessGroups.AccessGroupName,
                                        UserID = accessGroups.UserID,
                                        FunctionalArea = accessGroups.FunctionalArea,
                                        DepartmentName = accessGroups.DepartmentName,
                                        DateCreated = accessGroups.DateCreated,
                                        DateUpdated = accessGroups.DateUpdated,
                                        CreatedById = accessGroups.CreatedById

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Access Groups For User", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllAccessGroupLinksForUserInDepartment")]
        public async Task<object> GetAllAccessGroupLinksForUserInDepartment([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from accessGroups in _context.BPAccessGroupsUserLinks
                                    where accessGroups.UserID == model.UserID && accessGroups.FunctionalArea == model.FunctionalArea &&
                                    accessGroups.DepartmentName == model.DepartmentName && accessGroups.isActive == true
                                    select new AccessGroupsDTO()
                                    {
                                        AccessGroupUserLinkID = accessGroups.AccessGroupUserLinkID,
                                        AccessGroupName = accessGroups.AccessGroupName,
                                        AccessGroupID = accessGroups.AccessGroupID,
                                        DateCreated = accessGroups.DateCreated,
                                        DateUpdated = accessGroups.DateUpdated,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "All Access Group Links For User In Department", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllRolesForUserForAG")]
        public async Task<object> GetAllRolesForUserForAG([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var accessGroupIDs = await _context.BPAccessGroupsUserLinks
                    .Where(ag => ag.UserProfileID == model.UserProfileID && ag.isActive)
                    .Select(ag => ag.AccessGroupID)
                    .ToListAsync();
                
                var distinctRoleIds = await _context.BPAccessGroupRoleLink
                    .Where(agrl => agrl.isActive && accessGroupIDs.Contains(agrl.AccessGroupID))
                    .Select(agrl => agrl.RoleID)
                    .Distinct()
                    .ToListAsync();

                var roles = new List<AccessGroupsDTO>();
                foreach (var roleId in distinctRoleIds)
                {
                    var role = await _context.BPRoles
                        .Where(r => r.RoleID == roleId)
                        .Select(r => new AccessGroupsDTO
                        {
                            RoleID = r.RoleID,
                            RoleName = r.RoleName,
                            // Add additional properties as required
                            // ...

                        })
                        .FirstOrDefaultAsync();

                    if (role != null) roles.Add(role);
                }

                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got All Roles", roles));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

       
    }
}

