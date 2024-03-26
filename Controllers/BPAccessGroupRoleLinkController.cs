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

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPAccessGroupRoleLinkController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPAccessGroupRoleLinkController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateAccessGroupRole")]
        public async Task<object> AddUpdateAccessGroupRole([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model.AccessGroupName == null || model.RoleName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.AccessGroupRoleLinkID == 0)
                    {
                        model.AccessGroupRoleLinkID = null;
                    }
                    var tempAccessGroupRole = _context.BPAccessGroupRoleLink.FirstOrDefault(x => x.AccessGroupRoleLinkID == model.AccessGroupRoleLinkID);

                    if (tempAccessGroupRole == null)
                    {
                        tempAccessGroupRole = new BPAccessGroupRoleLink()
                        {
                            AccessGroupName = model.AccessGroupName,
                            RoleName = model.RoleName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,


                        };
                        await _context.BPAccessGroupRoleLink.AddAsync(tempAccessGroupRole);
                        await _context.SaveChangesAsync();
                        result = tempAccessGroupRole;
                    }
                    else
                    {
                        if (model.AccessGroupName != null)
                        {
                            tempAccessGroupRole.AccessGroupName = model.AccessGroupName;
                        }

                        if (model.RoleName != null)
                        {
                            tempAccessGroupRole.RoleName = model.RoleName;
                        }
                        tempAccessGroupRole.DateUpdated = DateTime.Now;

                        _context.Update(tempAccessGroupRole);
                        await _context.SaveChangesAsync();

                        result = tempAccessGroupRole;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupID > 0 ? "Access Group Role Updated Successfully" : "Access Group Role Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllRolesForAccessGroup")]
        public async Task<object> GetAllRolesForAccessGroup([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from AccessGroupRoles in _context.BPAccessGroupRoleLink
                                    where AccessGroupRoles.AccessGroupName == model.AccessGroupName && AccessGroupRoles.isActive == true
                                    select new AccessGroupsDTO()
                                    {
                                        AccessGroupRoleLinkID = AccessGroupRoles.AccessGroupRoleLinkID,
                                        AccessGroupName = AccessGroupRoles.AccessGroupName,
                                        RoleName = AccessGroupRoles.RoleName,
                                        CreatedById = AccessGroupRoles.CreatedById,
                                        DateCreated = AccessGroupRoles.DateCreated,
                                        DateUpdated = AccessGroupRoles.DateUpdated,
                                        isActive = true

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Got all roles for Access Group", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAccessGroupRoleLinkByID")]
        public async Task<object> GetAccessGroupRoleLinkByID([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                if (model.AccessGroupRoleLinkID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from AccessGroupRoles in _context.BPAccessGroupRoleLink
                                        where AccessGroupRoles.isActive == true && AccessGroupRoles.AccessGroupRoleLinkID == model.AccessGroupRoleLinkID
                                        select new AccessGroupsDTO()
                                        {
                                            AccessGroupRoleLinkID = AccessGroupRoles.AccessGroupRoleLinkID,
                                            AccessGroupName = AccessGroupRoles.AccessGroupName,
                                            RoleName = AccessGroupRoles.RoleName,
                                            CreatedById = AccessGroupRoles.CreatedById,
                                            DateCreated = AccessGroupRoles.DateCreated,
                                            DateUpdated = AccessGroupRoles.DateUpdated,
                                            isActive = true
                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Got Role", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteAccessGroupRoleLinkByID")]
        public async Task<object> DeleteAccessGroupRoleLinkByID([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var tempAccessGroupRoleLink = _context.BPAccessGroupRoleLink.FirstOrDefault(x => x.AccessGroupRoleLinkID == model.AccessGroupRoleLinkID);

                if (tempAccessGroupRoleLink == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    tempAccessGroupRoleLink.DateUpdated = DateTime.Now;
                    tempAccessGroupRoleLink.isActive = false;

                    _context.Update(tempAccessGroupRoleLink);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Access Group Role Link deleted successfully",true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
