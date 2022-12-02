using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System.Net.NetworkInformation;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Service
{
    public class ApplicationsService : IApplicationsService
    {
        private readonly AppDBContext _context;

        public ApplicationsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Applications> AddUpdateApplication(int? ApplicationID, string userID, string fullName, string email, string phoneNumber, string physicalAddress, string referenceNumber, string? companyRegNo, string typeOfApplication, string notificationNumber, string wBSNumber, string physicalAddressOfProject, string descriptionOfProject, string natureOfWork, string excavationType, DateTime expectedStartDate, DateTime expectedEndDate, string location, string createdById)
        {

            if (ApplicationID == 0)
            {
                ApplicationID = null;
            }
            //this checks is the record exists in the db
            var tempApplicationTable = _context.Application.FirstOrDefault(x => x.ApplicationID == ApplicationID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempApplicationTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempApplicationTable = new Applications()
                {

                    UserID = userID,
                    FullName = fullName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    PhyscialAddress = physicalAddress,
                    ReferenceNumber = referenceNumber,
                    CompanyRegNo = companyRegNo,
                    TypeOfApplication = typeOfApplication,
                    NotificationNumber = notificationNumber,
                    WBSNumber = wBSNumber,
                    PhysicalAddressOfProject = physicalAddressOfProject,
                    DescriptionOfProject = descriptionOfProject,
                    NatureOfWork = natureOfWork,
                    ExcavationType = excavationType,
                    ExpectedStartDate = expectedStartDate,
                    ExpectedEndDate = expectedEndDate,
                    Location = location,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,


                };

                //After the inizlization add to the db
                await _context.Application.AddAsync(tempApplicationTable);
                await _context.SaveChangesAsync();

                return tempApplicationTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempApplicationTable.UserID = userID;
                tempApplicationTable.FullName = fullName;
                tempApplicationTable.Email = email;
                tempApplicationTable.PhoneNumber = phoneNumber;
                tempApplicationTable.PhyscialAddress = physicalAddress;
                tempApplicationTable.ReferenceNumber = referenceNumber;
                tempApplicationTable.CompanyRegNo = companyRegNo;
                tempApplicationTable.TypeOfApplication = typeOfApplication;
                tempApplicationTable.NotificationNumber = notificationNumber;
                tempApplicationTable.WBSNumber = wBSNumber;
                tempApplicationTable.PhysicalAddressOfProject = physicalAddressOfProject;
                tempApplicationTable.DescriptionOfProject = descriptionOfProject;
                tempApplicationTable.NatureOfWork = natureOfWork;
                tempApplicationTable.ExcavationType = excavationType;
                tempApplicationTable.ExpectedStartDate = expectedStartDate;
                tempApplicationTable.ExpectedEndDate = expectedEndDate;
                tempApplicationTable.Location = location;
                tempApplicationTable.DateUpdated = DateTime.Now;
                tempApplicationTable.isActive = true;

                _context.Update(tempApplicationTable);
                await _context.SaveChangesAsync();
                return tempApplicationTable;
            }



        }

        public async Task<bool> DeleteApplication(int applicationID)
        {
            //this checks is the record exists in the db
            var tempApplicationTable = _context.Application.FirstOrDefault(x => x.ApplicationID == applicationID);

            if (tempApplicationTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempApplicationTable.DateUpdated = DateTime.Now;
                tempApplicationTable.isActive = false;
                _context.Update(tempApplicationTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }


        //this method gets all the applications linked to a partcular user
        //We use DTO (a cutom list) because we may pull custom data from the database at some point, otherwise, we can just use the existing list.
        public async Task<List<ApplicationsDTO>> GetAllApplications(string userId)
        {
            return await (
                from Applications in _context.Application
                where Applications.UserID == userId && Applications.isActive == true
                select new ApplicationsDTO()
                {
                    ApplicationID = Applications.ApplicationID,
                    UserID = Applications.UserID,
                    FullName = Applications.FullName,
                    Email = Applications.Email,
                    PhoneNumber = Applications.PhoneNumber,
                    PhysicalAddress = Applications.PhyscialAddress,
                    ReferenceNumber = Applications.ReferenceNumber,
                    CompanyRegNo = Applications.CompanyRegNo,
                    TypeOfApplication = Applications.TypeOfApplication,
                    NotificationNumber = Applications.NotificationNumber,
                    WBSNumber = Applications.WBSNumber,
                    PhysicalAddressOfProject = Applications.PhysicalAddressOfProject,
                    DescriptionOfProject = Applications.DescriptionOfProject,
                    NatureOfWork = Applications.NatureOfWork,
                    ExcavationType = Applications.ExcavationType,
                    ExpectedStartDate = Applications.ExpectedStartDate,
                    ExpectedEndDate = Applications.ExpectedEndDate,
                    Location = Applications.Location,
                    DateCreated = Applications.DateCreated,
                    DateUpdated = Applications.DateUpdated,
                    CreatedById = Applications.CreatedById,
                    isActive = Applications.isActive

                }
                ).ToListAsync();
        }
    }
}
