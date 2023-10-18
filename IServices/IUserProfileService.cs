using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IUserProfileService
    {
        //Task<UserProfile> - This is the return type so its going to ruturn it in the fromt of the users model
        Task<UserProfile> AddUpdateUserProfiles(int? userProfileID, string userID, string fullName, string email, string? phoneNumber, bool? isInternal, string? bp_Number, string? companyName, string? companyRegNo, string? physcialAddress, string? directorate, int? departmentID, int? subDepartmentID, string? branch, string? costCenterNumber, string? costCenterOwner, string? copyOfID, string createdById, string? IdNumber,int?zoneID,string? vatNumber, string? refNumber, string? companyType, string? SubDepartmentName, bool? isDepartmentAdmin, bool? isZoneAdmin, string? alternateEmail, string? alternateNumber);
        //this will return T/F 
        public Task<bool> DeleteUserProfile(int userProfileID);
        public Task<bool> UserGainsApproval(int userProfileID);

        Task<List<UserProfileDTO>> GetUserByUserID(string userId);

        Task<List<UserProfileDTO>> GetExternalUsers();


        Task<List<UserProfileDTO>> GetInternalUsers();
        Task<List<UserProfileDTO>> GetAllDepartmentAdmins();

        Task<List<UserProfileDTO>> GetAllUsersToLinkToDep(int depID);

        Task<List<UserProfileDTO>> GetUsersBySubDepartmentName(string subDepartmentName);
        Task<object> GetUserByEmail(string email);

    }
}