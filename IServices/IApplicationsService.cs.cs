﻿using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IApplicationsService
    {

        //Task<Professionals> - This is the return type so its going to ruturn it in the fromt of the professinals model
        Task<Applications> AddUpdateApplication(int? ApplicationID, string userID, string fullName, string email, string phoneNumber, string physicalAddress, string referenceNumber, string? companyRegNo, string typeOfApplication, string notificationNumber, string wBSNumber, string physicalAddressOfProject, string descriptionOfProject, string natureOfWork, string excavationType, DateTime expectedStartDate, DateTime expectedEndDate, string location, string createdById);
        //this will return T/F 
        public Task<bool> DeleteApplication(int applicationID);

        Task<List<ApplicationsDTO>> GetAllApplications(string userId);
    }
}