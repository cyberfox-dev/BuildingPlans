using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IUserProfileService
    {
        //Task<UserProfile> - This is the return type so its going to ruturn it in the fromt of the users model
        Task<UserProfile> AddUpdateUserProfiles(int? userProfileID, string userID, string fullName, string email, string? phoneNumber, bool isInternal, string? bp_Number, string? companyName, string? companyRegNo, string? physcialAddress, string? directorate, int? departmentID, int? subDepartmentID, string? branch, string? costCenterNumber, string? costCenterOwner, string? copyOfID, string createdById, string? IdNumber);
        //this will return T/F 
        public Task<bool> DeleteUserProfile(int userProfileID);

        Task<List<UserProfileDTO>> GetUserByUserID(string userId);
    }
}