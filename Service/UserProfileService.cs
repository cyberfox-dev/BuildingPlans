using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Data;
using System.Net.NetworkInformation;

namespace WayleaveManagementSystem.Service
{
    public class UserProfileService : IUserProfileService
    {
        private readonly AppDBContext _context;

        public UserProfileService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> AddUpdateUserProfiles(int? userProfileID, string userID, string fullName, string email, string? phoneNumber, bool isInternal, string? bp_Number, string? companyName, string? companyRegNo, string? physcialAddress, string? directorate, int? departmentID, int? subDepartmentID, string? branch, string? costCenterNumber, string? costCenterOwner, string? copyOfID, string createdById, string? IdNumber)
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
                    SubDepartmentID = subDepartmentID,
                    Branch = branch,
                    CostCenterNumber = costCenterNumber,
                    CostCenterOwner = costCenterOwner,
                    CopyOfID = copyOfID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,
                    IdNumber = IdNumber
                };

                //After the inizlization add to the db
                await _context.UserProfilesTable.AddAsync(tempUserProfile);
                await _context.SaveChangesAsync();

                return tempUserProfile;

            }
            else //if it is not null then user is doing an update 
            {
                tempUserProfile.UserProfileID = userProfileID;
                tempUserProfile.UserID = userID;
                tempUserProfile.FullName = fullName;
                tempUserProfile.Email = email;
                tempUserProfile.PhoneNumber = phoneNumber;
                tempUserProfile.isInternal = isInternal;
                tempUserProfile.BP_Number = bp_Number;
                tempUserProfile.CompanyName = companyName;
                tempUserProfile.CompanyRegNo = companyRegNo;
                tempUserProfile.PhyscialAddress = physcialAddress;
                tempUserProfile.Directorate = directorate;
                tempUserProfile.DepartmentID = departmentID;
                tempUserProfile.SubDepartmentID = subDepartmentID;
                tempUserProfile.Branch = branch;
                tempUserProfile.CostCenterNumber = costCenterNumber;
                tempUserProfile.CostCenterOwner = costCenterOwner;
                tempUserProfile.CopyOfID = copyOfID;
                //tempUserProfile.DateCreated = DateTime.Now;
                tempUserProfile.DateUpdated = DateTime.Now;
               // tempUserProfile.CreatedById = createdById;
                tempUserProfile.isActive = true;
                tempUserProfile.IdNumber = IdNumber;

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

        public async Task<List<UserProfileDTO>> GetUserByUserID(string userId)
        {
            return await(
               from UserProfile in _context.UserProfilesTable
               where UserProfile.UserID == userId && UserProfile.isActive == true
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
                  // isDepartmentAdmin = UserProfile.isDepartmentAdmin,
                   VatNumber = UserProfile.VatNumber,
                   IdNumber = UserProfile.IdNumber,

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

               }

               ).ToListAsync();
        }



    }
    
}
