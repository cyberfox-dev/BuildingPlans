using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IApplicationsService
    {

        //Task<Professionals> - This is the return type so its going to ruturn it in the fromt of the professinals model
        Task<Applications> AddUpdateApplication(int? ApplicationID, string userID, string fullName, string email, string phoneNumber, string physicalAddress, string referenceNumber, string? companyRegNo, string typeOfApplication, string notificationNumber, string wBSNumber, string physicalAddressOfProject, string descriptionOfProject, string natureOfWork, string excavationType, DateTime expectedStartDate, DateTime expectedEndDate, string location, string createdById, string? PreviousStageName, int? PreviousStageNumber, string? CurrentStageName, int? CurrentStageNumber, string? NextStageName, int? NextStageNumber, string? ApplicationStatus, bool? isDrafted, string? projectNumber);

        Task<bool> UpdateApplicationStage(int? ApplicationID,string? PreviousStageName, int? PreviousStageNumber, string? CurrentStageName, int? CurrentStageNumber, string? NextStageName, int? NextStageNumber, string? ApplicationStatus, string? projectNumber);

        Task<List<ApplicationsDTO>> GetApplicationsByApplicationID(int applicationID);

        //this will return T/F 
        public Task<bool> DeleteApplication(int applicationID);

        Task<List<ApplicationsDTO>> GetApplicationsList(string userId,bool isInternal);

        Task<List<ApplicationsDTO>> GetAllDraftedApplications(string userId, bool isInternal, bool isDrafted);

        Task<List<ApplicationsDTO>> GetApplicationsByProjectNumber(string projectNumber);

    }
}