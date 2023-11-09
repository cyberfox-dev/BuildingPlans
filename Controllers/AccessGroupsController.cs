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
using System.Linq;
using System.Data;

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
                            SubDepartmentID = model.SubDepartmentID,
                            ZoneID = model.ZoneID,
                            UserID = model.UserID,
                            UserProfileID = model.UserProfileID,
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
                        tempAccessGroup.UserProfileID = model.UserProfileID;
                        tempAccessGroup.SubDepartmentID = model.SubDepartmentID;
                        tempAccessGroup.ZoneID = model.ZoneID;
                        tempAccessGroup.UserID = model.UserID;
                        tempAccessGroup.DateUpdated = DateTime.Now;

                        _context.Update(tempAccessGroup);
                        await _context.SaveChangesAsync();
                        result = tempAccessGroup;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupUserLinkID > 0 ? "Zone and Access Group Link Updated Successfully" : "Zone and Access Group Link Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }


        [HttpPost("AddUpdateAccessGroupRoleLink")]
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
                            AccessGroupID = model.AccessGroupID,
                            RoleID = model.RoleID,
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
                        tempAccessGroup.RoleID = model.RoleID;
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


        [HttpPost("DeleteAccessGroupRoleLinkByID")]
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

        [HttpGet("GetAllAccessGroupRoles")]
        public async Task<object> GetAllAccessGroupRoles()                                                       
        {
            try
            {
                var result = await (
                from accessGroupRoleLink in _context.AccessGroupRoleLink
                where accessGroupRoleLink.isActive == true
                select new AccessGroupRoleLink()
                {

                    AccessGroupRoleLinkID = accessGroupRoleLink.AccessGroupRoleLinkID,
                    AccessGroupID = accessGroupRoleLink.AccessGroupID,
                    RoleID = accessGroupRoleLink.RoleID,
                    RoleName = accessGroupRoleLink.RoleName,
                    CreatedById = accessGroupRoleLink.CreatedById,
                    DateCreated = accessGroupRoleLink.DateCreated,
                    DateUpdated = accessGroupRoleLink.DateUpdated,
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

        [HttpGet("GetAllAccessGroupUsers")]
        public async Task<object> GetAllAccessGroupUsers()
        {
            try
            {
                var result = await (
                from accessGroupUserLink in _context.AccessGroupUserLink
                where accessGroupUserLink.isActive == true
                select new AccessGroupUserLink()
                {

                    AccessGroupUserLinkID = accessGroupUserLink.AccessGroupUserLinkID,
                    AccessGroupID = accessGroupUserLink.AccessGroupID,
                    UserID = accessGroupUserLink.UserID,
                    CreatedById = accessGroupUserLink.CreatedById,
                    DateCreated = accessGroupUserLink.DateCreated,
                    DateUpdated = accessGroupUserLink.DateUpdated,
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

        [HttpPost("GetAllRolesForUserForAllAG")]
        public async Task<IActionResult> GetAllRolesForUserForAllAG([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var accessGroupIDs = await _context.AccessGroupUserLink
                    .Where(ag => ag.UserProfileID == model.UserProfileID && ag.isActive)
                    .Select(ag => ag.AccessGroupID)
                    .ToListAsync();

                var distinctRoleIds = await _context.AccessGroupRoleLink
                    .Where(agrl => agrl.isActive && accessGroupIDs.Contains(agrl.AccessGroupID))
                    .Select(agrl => agrl.RoleID)
                    .Distinct()
                    .ToListAsync();

                var roles = new List<AccessGroupsDTO>();
                foreach (var roleId in distinctRoleIds)
                {
                    var role = await _context.Role
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
                // Log exception using a logging framework
                return StatusCode(500, new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        // Implement a custom IEqualityComparer<> to compare roles in .Distinct() method
        public class RoleEqualityComparer : IEqualityComparer<AccessGroupsDTO>
        {
            public bool Equals(AccessGroupsDTO x, AccessGroupsDTO y)
            {
                // Compare roles based on RoleID or other unique properties
                return x.RoleID == y.RoleID;
            }

            public int GetHashCode(AccessGroupsDTO obj)
            {
                // Use RoleID or other unique properties for hash code
                return obj.RoleID.GetHashCode();
            }
        }


        [HttpPost("GetAllRolesForUser")]
        public async Task<object> GetAllRolesForUser([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var accessGroupIDs = await (
                    from accessGroup in _context.AccessGroupUserLink
                    where accessGroup.UserID == model.UserID && accessGroup.isActive == true
                    select accessGroup.AccessGroupID).ToListAsync();

                var result = await (
                    from accessGroupRoleLink in _context.AccessGroupRoleLink
                    where accessGroupRoleLink.isActive == true && accessGroupIDs.Contains(accessGroupRoleLink.AccessGroupID)
                    select new AccessGroupsDTO()
                    {
                        AccessGroupRoleLinkID = accessGroupRoleLink.AccessGroupRoleLinkID,
                        RoleID = accessGroupRoleLink.RoleID,
                        RoleName = accessGroupRoleLink.RoleName,
                        CreatedById = accessGroupRoleLink.CreatedById,
                        DateCreated = accessGroupRoleLink.DateCreated,
                        DateUpdated = accessGroupRoleLink.DateUpdated,
                        isActive = true,
                    }
                ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Roles", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllNotLinkedUsers")]
        public async Task<object> GetAllNotLinkedUsers([FromBody] int accessGroupID)
        {
            try
            {


                var userIDs = await (
            from accessGroupUserLink in _context.AccessGroupUserLink
            where accessGroupUserLink.AccessGroupID == accessGroupID
            select accessGroupUserLink.UserID).ToListAsync();


                var result = await (
                    from UserProfile in _context.UserProfilesTable
                    where UserProfile.isActive == true && UserProfile.isInternal == true && !userIDs.Contains(UserProfile.UserID)
                    select new UserProfileDTO()
                    {
                        UserProfileID = UserProfile.UserProfileID,
                        UserID = UserProfile.UserID,
                        FullName = UserProfile.FullName,
                        Email = UserProfile.Email,
                        PhoneNumber = UserProfile.PhoneNumber,
                        isInternal = UserProfile.isInternal,
                        BP_Number = UserProfile.BP_Number,
                        CompanyName = UserProfile.CompanyName,
                        CompanyRegNo = UserProfile.CompanyRegNo,
                        PhyscialAddress = UserProfile.PhyscialAddress,
                        Directorate = UserProfile.Directorate,
                        DepartmentID = UserProfile.DepartmentID,
                        SubDepartmentID = UserProfile.SubDepartmentID,
                        Branch = UserProfile.Branch,
                        CostCenterNumber = UserProfile.CostCenterNumber,
                        CostCenterOwner = UserProfile.CostCenterOwner,
                        CopyOfID = UserProfile.CopyOfID,
                        DateCreated = UserProfile.DateCreated,
                        DateUpdated = UserProfile.DateUpdated,
                        CreatedById = UserProfile.CreatedById,
                        isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                        VatNumber = UserProfile.VatNumber,
                        IdNumber = UserProfile.IdNumber,
                        isZoneAdmin = UserProfile.isZoneAdmin,
                    }
                ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users That are not linked", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }


        [HttpPost("GetAllLinkedUsers")]
        public async Task<object> GetAllLinkedUsers([FromBody] int accessGroupID)
        {
            try
            {


                var userIDs = await (
            from accessGroupUserLink in _context.AccessGroupUserLink
            where accessGroupUserLink.AccessGroupID == accessGroupID
            select accessGroupUserLink.UserID).ToListAsync();


                var result = await (
                    from UserProfile in _context.UserProfilesTable
                    where UserProfile.isActive == true && UserProfile.isInternal == true && userIDs.Contains(UserProfile.UserID)
                    select new UserProfileDTO()
                    {
                        UserProfileID = UserProfile.UserProfileID,
                        UserID = UserProfile.UserID,
                        FullName = UserProfile.FullName,
                        Email = UserProfile.Email,
                        PhoneNumber = UserProfile.PhoneNumber,
                        isInternal = UserProfile.isInternal,
                        BP_Number = UserProfile.BP_Number,
                        CompanyName = UserProfile.CompanyName,
                        CompanyRegNo = UserProfile.CompanyRegNo,
                        PhyscialAddress = UserProfile.PhyscialAddress,
                        Directorate = UserProfile.Directorate,
                        DepartmentID = UserProfile.DepartmentID,
                        SubDepartmentID = UserProfile.SubDepartmentID,
                        Branch = UserProfile.Branch,
                        CostCenterNumber = UserProfile.CostCenterNumber,
                        CostCenterOwner = UserProfile.CostCenterOwner,
                        CopyOfID = UserProfile.CopyOfID,
                        DateCreated = UserProfile.DateCreated,
                        DateUpdated = UserProfile.DateUpdated,
                        CreatedById = UserProfile.CreatedById,
                        isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                        VatNumber = UserProfile.VatNumber,
                        IdNumber = UserProfile.IdNumber,
                        isZoneAdmin = UserProfile.isZoneAdmin,
                    }
                ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users that are linked", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllNotLinkedRoles")]
        public async Task<object> GetAllNotLinkedRoles([FromBody] int accessGroupID)
        {
            try
            {


                var RoleIDs = await (
            from accessGroupUserLink in _context.AccessGroupRoleLink
            where accessGroupUserLink.AccessGroupID == accessGroupID
            select accessGroupUserLink.RoleID).ToListAsync();


                var result = await (
                    from role in _context.Role
                    where role.isActive == true  && !RoleIDs.Contains(role.RoleID)
                    select new RolesDTO()
                    {
                        RoleID = role.RoleID,
                        RoleName = role.RoleName,
                        RoleType = role.RoleType,
                        RoleDescription = role.RoleDescription,
                        DateCreated = role.DateCreated,
                        DateUpdated = role.DateUpdated,
                        CreatedById = role.CreatedById,
                    }
                ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users That are not linked", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }



        [HttpPost("GetAllLinkedRoles")]
        public async Task<object> GetAllLinkedRoles([FromBody] int accessGroupID)
        {
            try
            {


                var RoleIDs = await (
          from accessGroupUserLink in _context.AccessGroupRoleLink
          where accessGroupUserLink.AccessGroupID == accessGroupID
          select accessGroupUserLink.RoleID).ToListAsync();



                var result = await (
                    from role in _context.Role
                    where role.isActive == true && RoleIDs.Contains(role.RoleID)
                  
                  select new RolesDTO()
                  {
                      RoleID = role.RoleID,
                      RoleName = role.RoleName,
                      RoleType = role.RoleType,
                      RoleDescription = role.RoleDescription,
                      DateCreated = role.DateCreated,
                      DateUpdated = role.DateUpdated,
                      CreatedById = role.CreatedById,
                  }
                ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users that are linked", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetUsersBasedOnRoleName")]
        public async Task<object> GetUsersBasedOnRoleName([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var AgID = await (
                    from accessGroups in _context.AccessGroups
                    where accessGroups.AccessGroupName == model.AccessGroupName
                    select accessGroups.AccessGroupID).ToListAsync();

                var UserID = await (
                    from accessGroupUserLink in _context.AccessGroupUserLink
                    where accessGroupUserLink.AccessGroupID == AgID[0]
                          && accessGroupUserLink.SubDepartmentID == model.SubDepartmentID
                          && accessGroupUserLink.ZoneID == model.ZoneID
                    select accessGroupUserLink.UserID).ToListAsync();

                var result = await (
                    from userProfile in _context.UserProfilesTable
                    where userProfile.isActive == true
                          && UserID.Contains(userProfile.UserID)
                          && userProfile.SubDepartmentID == model.SubDepartmentID && userProfile.zoneID == model.ZoneID
                    select new
                    {
                        UserProfileID = userProfile.UserProfileID,
                        UserID = userProfile.UserID,
                        Name = userProfile.Name,
                        FullName = userProfile.FullName,
                        Surname = userProfile.Surname,
                        Email = userProfile.Email,
                        AlternativeEmail = userProfile.AlternativeEmail,
                        isInternal = userProfile.isInternal,
                        isDefault = userProfile.isDefault,
                        PhoneNumber = userProfile.PhoneNumber,
                        AlternativePhoneNumber = userProfile.AlternativePhoneNumber,
                        BP_Number = userProfile.BP_Number,
                        CompanyName = userProfile.CompanyName,
                        CompanyRegNo = userProfile.CompanyRegNo,
                        PhyscialAddress = userProfile.PhyscialAddress,
                        CopyOfID = userProfile.CopyOfID,
                        IdNumber = userProfile.IdNumber,
                        VatNumber = userProfile.VatNumber,
                        ICASALicense = userProfile.ICASALicense,
                        Directorate = userProfile.Directorate,
                        DepartmentID = userProfile.DepartmentID,
                        DepartmentName = userProfile.DepartmentName,
                        Branch = userProfile.Branch,
                        CostCenterNumber = userProfile.CostCenterNumber,
                        CostCenterOwner = userProfile.CostCenterOwner,
                        depConfirmation = userProfile.depConfirmation,
                        zoneID = userProfile.zoneID,
                        zoneName = userProfile.zoneName,
                        refNumber = userProfile.refNumber,
                        companyType = userProfile.companyType,
                        SubDepartmentID = userProfile.SubDepartmentID,
                        SubDepartmentName = userProfile.SubDepartmentName,
                        isDepartmentAdmin = userProfile.isDepartmentAdmin,
                        isZoneAdmin = userProfile.isZoneAdmin,
                        DateCreated = DateTime.Now,
                        DateUpdated = DateTime.Now,
                        CreatedById = userProfile.CreatedById,

                    }
                ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users with profiles", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }


        [HttpPost("GetUserBasedOnRoleName")]
        public async Task<object> GetUserBasedOnRoleName([FromBody] AccessGroupsBindingModel model)
        {
            try
            {

                var AgID = await (
      from accessGroups in _context.AccessGroups
      where accessGroups.AccessGroupName == model.AccessGroupName
      select accessGroups.AccessGroupID).ToListAsync();

          //      var RoleIDs = await (
          //from accessGroupUserLink in _context.AccessGroupRoleLink
          //where accessGroupUserLink.AccessGroupID == AgID[0]
          //select accessGroupUserLink.RoleID).ToListAsync();

                var UserID = await (
      from accessGroupUserLink in _context.AccessGroupUserLink
      where accessGroupUserLink.AccessGroupID == AgID[0]
      select accessGroupUserLink.UserID).ToListAsync();


                var result = await (
                    from userProfile in _context.UserProfilesTable
                    where userProfile.isActive == true && UserID.Contains(userProfile.UserID) && userProfile.SubDepartmentID == model.SubDepartmentID

                    select new UserProfileDTO()
                    {
                        UserID = userProfile.UserID,
                       // SubDepartmentID = userProfile.SubDepartmentID,
                        
                    }
                ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users that are linked", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }



        [HttpPost("GetUserAndZoneBasedOnRoleName")]
        public async Task<object> GetUserAndZoneBasedOnRoleName([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (
                    from accessGroups in _context.AccessGroups
                    join accessGroupUserLink in _context.AccessGroupUserLink on accessGroups.AccessGroupID equals accessGroupUserLink.AccessGroupID into agul
                    from agulItem in agul.DefaultIfEmpty()
                    join userProfiles in _context.UserProfilesTable on agulItem.UserID equals userProfiles.UserID into up
                    from upItem in up.DefaultIfEmpty()
                    join zonesTable in _context.ZonesTable on upItem.zoneID equals zonesTable.ZoneID into zt
                    from ztItem in zt.DefaultIfEmpty()
                    join subDepartmentTable in _context.SubDepartmentsTable on ztItem.SubDepartmentID equals subDepartmentTable.SubDepartmentID into sdt
                    from sdtItem in sdt.DefaultIfEmpty()
                    where accessGroups.AccessGroupName == model.AccessGroupName && sdtItem.SubDepartmentID == model.SubDepartmentID
                    select new UserProfileDTO()
                                        {
                        UserID = upItem.UserID,
                        FullName = upItem.FullName,
                        Email = upItem.Email,
                        PhoneNumber = upItem.PhoneNumber,
                        Directorate = upItem.Directorate,
                        zoneName = ztItem.ZoneName,
                        MapObjectID = ztItem.MapObjectID,
                        SubDepartmentID = ztItem.SubDepartmentID,
                        zoneID = ztItem.ZoneID,
                        SubDepartmentName = sdtItem.SubDepartmentName,
                        // SubDepartmentID = upItem.SubDepartmentID,
                    }
                ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Users that are linked", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }



    }
}
