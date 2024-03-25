using BuildingPlans.Data.Entities;
using BuildingPlans.Models.DTO;

namespace BuildingPlans.IServices
{
    public interface IUserProfileService
    {
        //Task<UserProfile> - This is the return type so its going to ruturn it in the fromt of the users model
        Task<UserProfile> AddUpdateUserProfiles(int? userProfileID, string userID, string fullName, string email, string? phoneNumber, bool? isInternal, string? bp_Number, string? companyName, string? companyRegNo, string? physcialAddress, string? directorate, int? departmentID, int? subDepartmentID, string? branch, string? costCenterNumber, string? costCenterOwner, string? copyOfID, string createdById, string? IdNumber, int? zoneID, string? vatNumber, string? refNumber, string? companyType, string? SubDepartmentName, bool? isDepartmentAdmin, bool? isZoneAdmin, string? alternateEmail, string? alternateNumber,
             string? name, string? surname, string? departmentName, string? zoneName, bool? isDefault, string? icasaLicense, bool? depConfirmation);
        //this will return T/F 
        public Task<bool> DeleteUserProfile(int userProfileID);
        public Task<bool> UserGainsApproval(int userProfileID);
        public Task<bool> UpdateActingDepartment(int userProfileID);
        public Task<bool> UserDoesntGainApproval(int userProfileID);

        Task<List<UserProfileDTO>> GetUserByUserID(string userId);

        Task<List<UserProfileDTO>> GetExternalUsers();


        Task<List<UserProfileDTO>> GetInternalUsers();
        Task<List<UserProfileDTO>> GetAllDepartmentAdmins();

        Task<List<UserProfileDTO>> GetAllUsersToLinkToDep(int depID);

        Task<List<UserProfileDTO>> GetUsersBySubDepartmentName(string subDepartmentName);
        Task<object> GetUserByEmail(string email);
        Task<UserProfile> AdminConfig(int? userProfileID, bool? isDepartmentAdmin, bool? isZoneAdmin, string? createdById);


    }
}