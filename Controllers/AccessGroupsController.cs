using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using System.Threading.Tasks;
using System;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessGroupsController : ControllerBase
    {
        private readonly AppDBContext _context;


        public AccessGroupsController(AppDBContext context)
        {
            _context = context;

        }

        [HttpPost("AddUpdateAccessGroup")]
        public async Task<object> AddUpdateAccessGroup([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.AccessGroupName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.AccessGroupID == 0)
                    {
                        model.AccessGroupID = null;
                    }

                    var tempAccessGroup = _context.AccessGroups.FirstOrDefault(x => x.AccessGroupID == model.AccessGroupID);

                    if (tempAccessGroup == null)
                    {
                        tempAccessGroup = new AccessGroups()
                        {
                            AccessGroupDescription = model.AccessGroupDescription,
                            AccessGroupName = model.AccessGroupName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };

                        await _context.AccessGroups.AddAsync(tempAccessGroup);
                        await _context.SaveChangesAsync();

                        result = tempAccessGroup;
                    }
                    else
                    {
                        tempAccessGroup.AccessGroupDescription = model.AccessGroupDescription;
                        tempAccessGroup.AccessGroupName = model.AccessGroupName;
                        tempAccessGroup.DateUpdated = DateTime.Now;

                        _context.Update(tempAccessGroup);
                        await _context.SaveChangesAsync();
                        result = tempAccessGroup;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupID > 0 ? "Zone Link Updated Successfully" : "Service Item Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }


        [HttpPost("AddUpdateAccessGroupUserLink")]
        public async Task<object> AddUpdateAccessGroupUserLink([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.UserID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.AccessGroupUserLinkID == 0)
                    {
                        model.AccessGroupUserLinkID = null;
                    }

                    var tempAccessGroup = _context.AccessGroupUserLink.FirstOrDefault(x => x.AccessGroupUserLinkID == model.AccessGroupUserLinkID);

                    if (tempAccessGroup == null)
                    {
                        tempAccessGroup = new AccessGroupUserLink()
                        {
                            AccessGroupID = model.AccessGroupID,
                            UserID = model.UserID,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };

                        await _context.AccessGroupUserLink.AddAsync(tempAccessGroup);
                        await _context.SaveChangesAsync();

                        result = tempAccessGroup;
                    }
                    else
                    {
                        tempAccessGroup.AccessGroupID = model.AccessGroupID;
                        tempAccessGroup.UserID = model.UserID;
                        tempAccessGroup.DateUpdated = DateTime.Now;

                        _context.Update(tempAccessGroup);
                        await _context.SaveChangesAsync();
                        result = tempAccessGroup;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupUserLinkID > 0 ? "Zone Link Updated Successfully" : "Service Item Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }


        [HttpPost("AddUpdateAccessGroupUserLink")]
        public async Task<object> AddUpdateAccessGroupRoleLink([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.RoleName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.AccessGroupRoleLinkID == 0)
                    {
                        model.AccessGroupRoleLinkID = null;
                    }

                    var tempAccessGroup = _context.AccessGroupRoleLink.FirstOrDefault(x => x.AccessGroupRoleLinkID == model.AccessGroupRoleLinkID);

                    if (tempAccessGroup == null)
                    {
                        tempAccessGroup = new AccessGroupRoleLink()
                        {
                            RoleID = (int)model.RoleID,
                             RoleName = model.RoleName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };

                        await _context.AccessGroupRoleLink.AddAsync(tempAccessGroup);
                        await _context.SaveChangesAsync();

                        result = tempAccessGroup;
                    }
                    else
                    {
                        tempAccessGroup.RoleID = (int)model.RoleID;
                        tempAccessGroup.RoleName = model.RoleName;
                        tempAccessGroup.DateUpdated = DateTime.Now;

                        _context.Update(tempAccessGroup);
                        await _context.SaveChangesAsync();
                        result = tempAccessGroup;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupUserLinkID > 0 ? "Access Group Role Link Updated Successfully" : "Service Item Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }



        [HttpPost("DeleteAccessGroupByID")]
        public async Task<object> DeleteAccessGroupByID([FromBody] int accessGroupID)
        {
            try
            {

                var tempAccessGroup = _context.AccessGroups.FirstOrDefault(x => x.AccessGroupID == accessGroupID);

                if (tempAccessGroup == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempAccessGroup.DateUpdated = DateTime.Now;
                    tempAccessGroup.isActive = false;
                    _context.Update(tempAccessGroup);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Access Group Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("DeleteAccessGroupUserLinkByID")]
        public async Task<object> DeleteAccessGroupUserLinkByID([FromBody] int accessGroupUserLinkID)
        {
            try
            {

                var tempAccessGroup = _context.AccessGroupUserLink.FirstOrDefault(x => x.AccessGroupUserLinkID == accessGroupUserLinkID);

                if (tempAccessGroup == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempAccessGroup.DateUpdated = DateTime.Now;
                    tempAccessGroup.isActive = false;
                    _context.Update(tempAccessGroup);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Access Group Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("DeleteAccessGroupByID")]
        public async Task<object> DeleteAccessGroupRoleLinkByID([FromBody] int accessGroupRoleLinkID)
        {
            try
            {

                var tempAccessGroup = _context.AccessGroupRoleLink.FirstOrDefault(x => x.AccessGroupRoleLinkID == accessGroupRoleLinkID);

                if (tempAccessGroup == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempAccessGroup.DateUpdated = DateTime.Now;
                    tempAccessGroup.isActive = false;
                    _context.Update(tempAccessGroup);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Access Group Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }



        [HttpGet("GetAllAccessGroups")]
        public async Task<object> GetAllAccessGroups()
        {
            try
            {
                var result = await (
                from accessGroups in _context.AccessGroups
                where accessGroups.isActive == true
                select new AccessGroups()
                {
                    AccessGroupID = accessGroups.AccessGroupID,
                    AccessGroupDescription = accessGroups.AccessGroupDescription,
                    CreatedById = accessGroups.CreatedById,
                    DateCreated = accessGroups.DateCreated,
                    DateUpdated = accessGroups.DateUpdated,
                    AccessGroupName = accessGroups.AccessGroupName,
                    isActive = true,

                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        //[HttpGet("GetAllAccessGroups")]
        //public async Task<object> GetAllAccessGroups()
        //{
        //    try
        //    {
        //        var result = await (
        //        from accessGroupRoleLink in _context.AccessGroupRoleLink
        //        where accessGroupRoleLink.isActive == true
        //        select new AccessGroupRoleLink()
        //        {
                    
        //            AccessGroupRoleLinkID = accessGroupRoleLink.AccessGroupRoleLinkID,
        //            AccessGroupID = accessGroupRoleLink.AccessGroupID,
        //            CreatedById = accessGroupRoleLink.CreatedById,
        //            DateCreated = accessGroupRoleLink.DateCreated,
        //            DateUpdated = accessGroupRoleLink.DateUpdated,
        //            isActive = true,

        //        }
        //        ).ToListAsync();



        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));



        //    }
        //    catch (Exception ex)
        //    {


        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

        //    }
        //}


    }
}
