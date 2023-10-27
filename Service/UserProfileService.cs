using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Data;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using Microsoft.AspNetCore.Server.IISIntegration;
using System.Data;
using WayleaveManagementSystem.Data.Migrations;

namespace WayleaveManagementSystem.Service
{
    public class UserProfileService : IUserProfileService
    {
        private readonly AppDBContext _context;

        public UserProfileService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> AddUpdateUserProfiles(int? userProfileID, string? userID, string? fullName, string? email, string? phoneNumber, bool? isInternal, string? bp_Number, string? companyName, string? companyRegNo, string? physcialAddress, string? directorate, int? departmentID, int? subDepartmentID, string? branch, string? costCenterNumber, string? costCenterOwner, string? copyOfID, string? createdById, string? IdNumber, int? zoneID, string? vatNumber, string? refNumber, string? companyType, string? subDepartmentName, bool? isDepartmentAdmin, bool? isZoneAdmin)
        {
            if (userProfileID == 0)
            {
                userProfileID = null;
            }
            //this checks is the record exists in the db
            var tempUserProfile = _context.UserProfilesTable.FirstOrDefault(x => x.UserProfileID == userProfileID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempUserProfile == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempUserProfile = new UserProfile()
                {
                    UserProfileID = userProfileID,
                    UserID = userID,
                    FullName = fullName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    isInternal = isInternal,
                    BP_Number = bp_Number,
                    CompanyName = companyName,
                    CompanyRegNo = companyRegNo,
                    PhyscialAddress = physcialAddress,
                    Directorate = directorate,
                    DepartmentID = departmentID,
                    SubDepartmentID = subDepartmentID, //need the name as well
                    Branch = branch,
                    CostCenterNumber = costCenterNumber,
                    CostCenterOwner = costCenterOwner,
                    CopyOfID = copyOfID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,
                    IdNumber = IdNumber,
                    depConfirmation = false,
                    zoneID = zoneID,
                    VatNumber = vatNumber,
                    refNumber = refNumber,
                    companyType = companyType,
                    SubDepartmentName = subDepartmentName,


                };

                //After the inizlization add to the db
                await _context.UserProfilesTable.AddAsync(tempUserProfile);
                await _context.SaveChangesAsync();

                return tempUserProfile;

            }
            else //if it is not null then user is doing an update 
            {
                if (userProfileID != null)
                {
                    tempUserProfile.UserProfileID = userProfileID;
                }
                if (userID != null)
                {
                    tempUserProfile.UserID = userID;
                }
                if (fullName != null)
                {
                    tempUserProfile.FullName = fullName;
                }
                if (email != null)
                {
                    tempUserProfile.Email = email;
                }
                if (phoneNumber != null)
                {
                    tempUserProfile.PhoneNumber = phoneNumber;
                }
                if (isInternal != null)
                {
                    tempUserProfile.isInternal = isInternal;
                }
                if (bp_Number != null)
                {
                    tempUserProfile.BP_Number = bp_Number;
                }
                if (companyName != null)
                {
                    tempUserProfile.CompanyName = companyName;
                }
                if (companyRegNo != null)
                {
                    tempUserProfile.CompanyRegNo = companyRegNo;
                }
                if (physcialAddress != null)
                {
                    tempUserProfile.PhyscialAddress = physcialAddress;
                }
                if (directorate != null)
                {
                    tempUserProfile.Directorate = directorate;
                }
                if (departmentID != null)
                {
                    tempUserProfile.DepartmentID = departmentID;
                }
                if (subDepartmentID != null)
                {
                    tempUserProfile.SubDepartmentID = subDepartmentID;
                }
                if (branch != null)
                {
                    tempUserProfile.Branch = branch;
                }
                if (costCenterNumber != null)
                {
                    tempUserProfile.CostCenterNumber = costCenterNumber;
                }
                if (costCenterOwner != null)
                {
                    tempUserProfile.CostCenterOwner = costCenterOwner;
                }
                if (copyOfID != null)
                {
                    tempUserProfile.CopyOfID = copyOfID;
                }
                if (copyOfID != null)
                {
                    tempUserProfile.CopyOfID = copyOfID;
                }
                if (IdNumber != null)
                {
                    tempUserProfile.IdNumber = IdNumber;
                }
                if (vatNumber != null)
                {
                    tempUserProfile.VatNumber = vatNumber;
                }
                if (refNumber != null)
                {
                    tempUserProfile.refNumber = refNumber;
                }
                if (companyType != null)
                {
                    tempUserProfile.companyType = companyType;
                }
                if (subDepartmentName != null)
                {
                    tempUserProfile.SubDepartmentName = subDepartmentName;
                }
                if (isDepartmentAdmin != null)
                {
                    tempUserProfile.isDepartmentAdmin = isDepartmentAdmin;
                }
                if (isZoneAdmin != null)
                {
                    tempUserProfile.isZoneAdmin = isZoneAdmin;
                }

                //tempUserProfile.DateCreated = DateTime.Now;
                tempUserProfile.DateUpdated = DateTime.Now;
                // tempUserProfile.CreatedById = createdById;
                tempUserProfile.isActive = true;
                tempUserProfile.depConfirmation = true;


                _context.Update(tempUserProfile);
                await _context.SaveChangesAsync();
                return tempUserProfile;
            }
        }

        public async Task<bool> DeleteUserProfile(int userProfileID)
        {
            //this checks is the record exists in the db
            var tempUserProfilesTable = _context.UserProfilesTable.FirstOrDefault(x => x.UserProfileID == userProfileID);

            if (tempUserProfilesTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempUserProfilesTable.DateUpdated = DateTime.Now;
                tempUserProfilesTable.isActive = false;
                _context.Update(tempUserProfilesTable);
                await _context.SaveChangesAsync();
                return true;
            }

        }

        public async Task<bool> UserGainsApproval(int userProfileID)
        {
            //this checks is the record exists in the db
            var tempUserProfilesTable = _context.UserProfilesTable.FirstOrDefault(x => x.UserProfileID == userProfileID);

            if (tempUserProfilesTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempUserProfilesTable.DateUpdated = DateTime.Now;
                tempUserProfilesTable.depConfirmation = true;
                _context.Update(tempUserProfilesTable);
                await _context.SaveChangesAsync();
                return true;
            }

        }

        public async Task<List<UserProfileDTO>> GetUserByUserID(string userId)
        {
            return await (
               from UserProfile in _context.UserProfilesTable
               where UserProfile.UserID == userId && UserProfile.isActive == true
               select new UserProfileDTO()
               {
                   UserProfileID = UserProfile.UserProfileID,
                   UserID = UserProfile.UserID,
                   Name = UserProfile.Name,
                   FullName = UserProfile.FullName,
                   Surname = UserProfile.Surname,
                   Email = UserProfile.Email,
                   AlternativeEmail = UserProfile.AlternativeEmail,
                   isInternal = UserProfile.isInternal,
                   isDefault = UserProfile.isDefault,
                   PhoneNumber = UserProfile.PhoneNumber,
                   AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
                   BP_Number = UserProfile.BP_Number,
                   CompanyName = UserProfile.CompanyName,
                   CompanyRegNo = UserProfile.CompanyRegNo,
                   PhyscialAddress = UserProfile.PhyscialAddress,
                   CopyOfID = UserProfile.CopyOfID,
                   IdNumber = UserProfile.IdNumber,
                   VatNumber = UserProfile.VatNumber,
                   ICASALicense = UserProfile.ICASALicense,
                   Directorate = UserProfile.Directorate,
                   DepartmentID = UserProfile.DepartmentID,
                   DepartmentName = UserProfile.DepartmentName,
                   Branch = UserProfile.Branch,
                   CostCenterNumber = UserProfile.CostCenterNumber,
                   CostCenterOwner = UserProfile.CostCenterOwner,
                   depConfirmation = UserProfile.depConfirmation,
                   zoneID = UserProfile.zoneID,
                   zoneName = UserProfile.zoneName,
                   refNumber = UserProfile.refNumber,
                   companyType = UserProfile.companyType,
                   SubDepartmentID = UserProfile.SubDepartmentID,
                   SubDepartmentName = UserProfile.SubDepartmentName,
                   isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                   isZoneAdmin = UserProfile.isZoneAdmin,
                   DateCreated = DateTime.Now,
                   DateUpdated = DateTime.Now,
                   CreatedById = UserProfile.CreatedById,


               }

               ).ToListAsync();
        }

        public async Task<List<UserProfileDTO>> GetExternalUsers()
        {
            return await (
               from UserProfile in _context.UserProfilesTable
               where UserProfile.isInternal == false && UserProfile.isActive == true
               select new UserProfileDTO()
               {
                   UserProfileID = UserProfile.UserProfileID,
                   UserID = UserProfile.UserID,
                   Name = UserProfile.Name,
                   FullName = UserProfile.FullName,
                   Surname = UserProfile.Surname,
                   Email = UserProfile.Email,
                   AlternativeEmail = UserProfile.AlternativeEmail,
                   isInternal = UserProfile.isInternal,
                   isDefault = UserProfile.isDefault,
                   PhoneNumber = UserProfile.PhoneNumber,
                   AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
                   BP_Number = UserProfile.BP_Number,
                   CompanyName = UserProfile.CompanyName,
                   CompanyRegNo = UserProfile.CompanyRegNo,
                   PhyscialAddress = UserProfile.PhyscialAddress,
                   CopyOfID = UserProfile.CopyOfID,
                   IdNumber = UserProfile.IdNumber,
                   VatNumber = UserProfile.VatNumber,
                   ICASALicense = UserProfile.ICASALicense,
                   Directorate = UserProfile.Directorate,
                   DepartmentID = UserProfile.DepartmentID,
                   DepartmentName = UserProfile.DepartmentName,
                   Branch = UserProfile.Branch,
                   CostCenterNumber = UserProfile.CostCenterNumber,
                   CostCenterOwner = UserProfile.CostCenterOwner,
                   depConfirmation = UserProfile.depConfirmation,
                   zoneID = UserProfile.zoneID,
                   zoneName = UserProfile.zoneName,
                   refNumber = UserProfile.refNumber,
                   companyType = UserProfile.companyType,
                   SubDepartmentID = UserProfile.SubDepartmentID,
                   SubDepartmentName = UserProfile.SubDepartmentName,
                   isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                   isZoneAdmin = UserProfile.isZoneAdmin,
                   DateCreated = DateTime.Now,
                   DateUpdated = DateTime.Now,
                   CreatedById = UserProfile.CreatedById,
               }

               ).ToListAsync();
        }


        public async Task<List<UserProfileDTO>> GetInternalUsers()
        {
            return await (
               from UserProfile in _context.UserProfilesTable
               where UserProfile.isInternal == true && UserProfile.isActive == true
               select new UserProfileDTO()
               {
                   UserProfileID = UserProfile.UserProfileID,
                   UserID = UserProfile.UserID,
                   Name = UserProfile.Name,
                   FullName = UserProfile.FullName,
                   Surname = UserProfile.Surname,
                   Email = UserProfile.Email,
                   AlternativeEmail = UserProfile.AlternativeEmail,
                   isInternal = UserProfile.isInternal,
                   isDefault = UserProfile.isDefault,
                   PhoneNumber = UserProfile.PhoneNumber,
                   AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
                   BP_Number = UserProfile.BP_Number,
                   CompanyName = UserProfile.CompanyName,
                   CompanyRegNo = UserProfile.CompanyRegNo,
                   PhyscialAddress = UserProfile.PhyscialAddress,
                   CopyOfID = UserProfile.CopyOfID,
                   IdNumber = UserProfile.IdNumber,
                   VatNumber = UserProfile.VatNumber,
                   ICASALicense = UserProfile.ICASALicense,
                   Directorate = UserProfile.Directorate,
                   DepartmentID = UserProfile.DepartmentID,
                   DepartmentName = UserProfile.DepartmentName,
                   Branch = UserProfile.Branch,
                   CostCenterNumber = UserProfile.CostCenterNumber,
                   CostCenterOwner = UserProfile.CostCenterOwner,
                   depConfirmation = UserProfile.depConfirmation,
                   zoneID = UserProfile.zoneID,
                   zoneName = UserProfile.zoneName,
                   refNumber = UserProfile.refNumber,
                   companyType = UserProfile.companyType,
                   SubDepartmentID = UserProfile.SubDepartmentID,
                   SubDepartmentName = UserProfile.SubDepartmentName,
                   isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                   isZoneAdmin = UserProfile.isZoneAdmin,
                   DateCreated = DateTime.Now,
                   DateUpdated = DateTime.Now,
                   CreatedById = UserProfile.CreatedById,
               }

               ).ToListAsync();
        }

        public async Task<List<UserProfileDTO>> GetAllDepartmentAdmins()
        {
            return await (
               from UserProfile in _context.UserProfilesTable
               where UserProfile.isDepartmentAdmin == true && UserProfile.isActive == true
               select new UserProfileDTO()
               {
                   UserProfileID = UserProfile.UserProfileID,
                   UserID = UserProfile.UserID,
                   Name = UserProfile.Name,
                   FullName = UserProfile.FullName,
                   Surname = UserProfile.Surname,
                   Email = UserProfile.Email,
                   AlternativeEmail = UserProfile.AlternativeEmail,
                   isInternal = UserProfile.isInternal,
                   isDefault = UserProfile.isDefault,
                   PhoneNumber = UserProfile.PhoneNumber,
                   AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
                   BP_Number = UserProfile.BP_Number,
                   CompanyName = UserProfile.CompanyName,
                   CompanyRegNo = UserProfile.CompanyRegNo,
                   PhyscialAddress = UserProfile.PhyscialAddress,
                   CopyOfID = UserProfile.CopyOfID,
                   IdNumber = UserProfile.IdNumber,
                   VatNumber = UserProfile.VatNumber,
                   ICASALicense = UserProfile.ICASALicense,
                   Directorate = UserProfile.Directorate,
                   DepartmentID = UserProfile.DepartmentID,
                   DepartmentName = UserProfile.DepartmentName,
                   Branch = UserProfile.Branch,
                   CostCenterNumber = UserProfile.CostCenterNumber,
                   CostCenterOwner = UserProfile.CostCenterOwner,
                   depConfirmation = UserProfile.depConfirmation,
                   zoneID = UserProfile.zoneID,
                   zoneName = UserProfile.zoneName,
                   refNumber = UserProfile.refNumber,
                   companyType = UserProfile.companyType,
                   SubDepartmentID = UserProfile.SubDepartmentID,
                   SubDepartmentName = UserProfile.SubDepartmentName,
                   isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                   isZoneAdmin = UserProfile.isZoneAdmin,
                   DateCreated = DateTime.Now,
                   DateUpdated = DateTime.Now,
                   CreatedById = UserProfile.CreatedById,
               }

               ).ToListAsync();
        }

        public async Task<List<UserProfileDTO>> GetAllUsersToLinkToDep(int departmentID)
        {
            return await (
               from UserProfile in _context.UserProfilesTable
               where UserProfile.isActive == true && UserProfile.depConfirmation == false && UserProfile.DepartmentID == departmentID
               select new UserProfileDTO()
               {
                   UserProfileID = UserProfile.UserProfileID,
                   UserID = UserProfile.UserID,
                   Name = UserProfile.Name,
                   FullName = UserProfile.FullName,
                   Surname = UserProfile.Surname,
                   Email = UserProfile.Email,
                   AlternativeEmail = UserProfile.AlternativeEmail,
                   isInternal = UserProfile.isInternal,
                   isDefault = UserProfile.isDefault,
                   PhoneNumber = UserProfile.PhoneNumber,
                   AlternativePhoneNumber = UserProfile.AlternativePhoneNumber,
                   BP_Number = UserProfile.BP_Number,
                   CompanyName = UserProfile.CompanyName,
                   CompanyRegNo = UserProfile.CompanyRegNo,
                   PhyscialAddress = UserProfile.PhyscialAddress,
                   CopyOfID = UserProfile.CopyOfID,
                   IdNumber = UserProfile.IdNumber,
                   VatNumber = UserProfile.VatNumber,
                   ICASALicense = UserProfile.ICASALicense,
                   Directorate = UserProfile.Directorate,
                   DepartmentID = UserProfile.DepartmentID,
                   DepartmentName = UserProfile.DepartmentName,
                   Branch = UserProfile.Branch,
                   CostCenterNumber = UserProfile.CostCenterNumber,
                   CostCenterOwner = UserProfile.CostCenterOwner,
                   depConfirmation = UserProfile.depConfirmation,
                   zoneID = UserProfile.zoneID,
                   zoneName = UserProfile.zoneName,
                   refNumber = UserProfile.refNumber,
                   companyType = UserProfile.companyType,
                   SubDepartmentID = UserProfile.SubDepartmentID,
                   SubDepartmentName = UserProfile.SubDepartmentName,
                   isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                   isZoneAdmin = UserProfile.isZoneAdmin,
                   DateCreated = DateTime.Now,
                   DateUpdated = DateTime.Now,
                   CreatedById = UserProfile.CreatedById,
               }

               ).ToListAsync();
        }

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
                    join zoneLinkTable in _context.ZoneLinkTable on upItem.UserID equals zoneLinkTable.AssignedUserID into zlt
                    from zltItem in zlt.DefaultIfEmpty()
                    join zonesTable in _context.ZonesTable on zltItem.ZoneID equals zonesTable.ZoneID into zt
                    from ztItem in zt.DefaultIfEmpty()
                    join subDepartmentTable in _context.SubDepartmentsTable on ztItem.SubDepartmentID equals subDepartmentTable.SubDepartmentID into sdt
                    from sdtItem in sdt.DefaultIfEmpty()
                    where accessGroups.AccessGroupName == model.AccessGroupName && upItem.SubDepartmentID == model.SubDepartmentID
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


        public async Task<List<UserProfileDTO>> GetUsersBySubDepartmentName(string SubDepartmentName)
        {
            return await (

                                    from SubDepartments in _context.SubDepartmentsTable
                                    join UserProfile in _context.UserProfilesTable on SubDepartments.SubDepartmentID equals UserProfile.SubDepartmentID into newtable
                                    from newtableItem in newtable.DefaultIfEmpty()
                                    where SubDepartments.SubDepartmentName == SubDepartmentName && SubDepartments.isActive == true
                                    select new UserProfileDTO()
                                    {
                                        UserProfileID = newtableItem.UserProfileID,
                                        UserID = newtableItem.UserID,
                                        FullName = newtableItem.FullName,
                                        Email = newtableItem.Email,
                                        PhoneNumber = newtableItem.PhoneNumber,
                                        Directorate = newtableItem.Directorate,
                                        SubDepartmentID = newtableItem.SubDepartmentID,
                                        SubDepartmentName = SubDepartments.SubDepartmentName,
                                        //
                                        isZoneAdmin = newtableItem.isZoneAdmin,
                                        isDepartmentAdmin = newtableItem.isDepartmentAdmin,
                                        zoneID = newtableItem.zoneID,
                                    }
                ).ToListAsync();
        }

    }

}
