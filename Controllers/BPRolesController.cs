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
using System.Security.Cryptography.X509Certificates;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPRolesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPRolesController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateRole")]
        public async Task<object> AddUpdateRole([FromBody] BPRolesBindingModel model)
        {
            try
            {
                var result = new object();
                if(model == null || model.RoleName == null || model.RoleDescription == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.RoleID == 0)
                    {
                        model.RoleID = null;
                    }

                    var tempRole = _context.BPRoles.FirstOrDefault(x => x.RoleID == model.RoleID);

                    if (tempRole == null)
                    {
                        tempRole = new BPRoles()
                        {
                            RoleName = model.RoleName,
                            RoleDescription = model.RoleDescription,
                            RoleType = model.RoleType,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true,

                        };

                        await _context.BPRoles.AddAsync(tempRole);
                        await _context.SaveChangesAsync();

                        result = tempRole; 
                    }
                    else
                    {
                        if (model.RoleName != null)
                        {
                            tempRole.RoleName = model.RoleName;
                        }
                        if (model.RoleDescription == null)
                        {
                            tempRole.RoleDescription = model.RoleDescription;
                        }
                        if (model.RoleType != null)
                        {
                            tempRole.RoleType = model.RoleType;
                        }
                        tempRole.DateUpdated = DateTime.Now;

                        _context.Update(tempRole);
                        await _context.SaveChangesAsync();

                        result = tempRole;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.RoleID > 0 ? "BP Role Updated Successfully " : "BP Role Created Successfully"), result));
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
                var result = await (from roles in _context.BPRoles
                                    where roles.isActive == true
                                    select new BPRolesDTO()
                                    {
                                        RoleID = roles.RoleID,
                                        RoleName = roles.RoleName,
                                        RoleDescription = roles.RoleDescription,
                                        RoleType = roles.RoleType,
                                        DateCreated = roles.DateCreated,
                                        DateUpdated = roles.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All BP Roles", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetRoleByRoleID")]
        public async Task<object> GetRoleByRoleID([FromBody] BPRolesBindingModel model)
        {
            try
            {
                var result = await (from roles in _context.BPRoles
                                    where roles.RoleID == model.RoleID && roles.isActive == true
                                    select new BPRolesDTO()
                                    {
                                        RoleID = roles.RoleID,
                                        RoleName = roles.RoleName,
                                        RoleDescription = roles.RoleDescription,
                                        RoleType = roles.RoleType,
                                        DateCreated = roles.DateCreated,
                                        DateUpdated = roles.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Role By Role ID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteRoleByRoleID")]
        public async Task<object> DeleteRoleByRoleID([FromBody] BPRolesBindingModel model)
        {
            try
            {
                if(model.RoleID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempRole = _context.BPRoles.FirstOrDefault(x => x.RoleID == model.RoleID);

                    if(tempRole == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not find role in database", false));
                    }
                    else
                    {
                        tempRole.isActive = false;
                        tempRole.DateUpdated = DateTime.Now;

                        _context.Update(tempRole);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Role Deleted Successfully", true));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllRolesAndAccessGroupLinks")]
        public async Task<object> GetAllRolesAndAccessGroupLinks([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from bpr in _context.BPRoles
                                    join rl in _context.BPAccessGroupRoleLink on bpr.RoleID equals rl.RoleID into bprRlJoin
                                    from rl in bprRlJoin.DefaultIfEmpty()
                                    where bpr.isActive == true
                                    select new AccessGroupsDTO()
                                    {
                                       RoleID = bpr.RoleID,
                                       RoleName = bpr.RoleName,
                                       RoleType= bpr.RoleType,
                                       RoleDescription = bpr.RoleDescription,
                                       DateCreated = bpr.DateCreated,
                                       DateUpdated = bpr.DateUpdated,
                                        CreatedById = bpr.CreatedById,
                                        isActive = rl.isActive,
                                        AccessGroupRoleLinkID =(rl.AccessGroupName == model.AccessGroupName )?rl.AccessGroupRoleLinkID:(int?)null,
                                       AccessGroupName =  (rl.AccessGroupName == model.AccessGroupName)?rl.AccessGroupName:null
                                    }).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Roles and Access Group Role links", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
