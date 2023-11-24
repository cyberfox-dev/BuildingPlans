using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System.Net.NetworkInformation;
using WayleaveManagementSystem.Models.DTO;
using System.Xml.Serialization;

namespace WayleaveManagementSystem.Service
{
    public class ApplicationsService : IApplicationsService
    {
        private readonly AppDBContext _context;

        public ApplicationsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Applications> AddUpdateApplication(int? ApplicationID, string? userID, string? fullName, string? email, string? phoneNumber, string? physicalAddress, string? referenceNumber, string? companyRegNo, string? typeOfApplication, string? notificationNumber, string? wBSNumber, string? physicalAddressOfProject, string? descriptionOfProject, string? natureOfWork, string? excavationType, DateTime? expectedStartDate, DateTime? expectedEndDate, string? location, string? createdById, string? PreviousStageName, int? PreviousStageNumber, string? CurrentStageName, int? CurrentStageNumber, string? NextStageName, int? NextStageNumber, string? ApplicationStatus, bool? isDrafted, string? projectNumber, bool? isPlanning, DateTime? PermitStartDate, DateTime? DatePaid, bool? WBSRequired, string? Coordinates)
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
                    PreviousStageName = PreviousStageName,
                    PreviousStageNumber = PreviousStageNumber,
                    CurrentStageName = CurrentStageName,
                    CurrentStageNumber = CurrentStageNumber,
                    CurrentStageStartDate = DateTime.Now,
                    NextStageName = NextStageName,
                    NextStageNumber = NextStageNumber,
                    ApplicationStatus = ApplicationStatus,
                    isDrafted = false,
                    ProjectNumber = projectNumber,
                    isPlanning = isPlanning,
                    PermitStartDate = PermitStartDate,
                    Coordinates = Coordinates,
                };

                //After the inizlization add to the db
                await _context.Application.AddAsync(tempApplicationTable);
                await _context.SaveChangesAsync();

                return tempApplicationTable;

            }
            else //if it is not null then user is doing an update 
            {
                if (userID != null)
                {
                    tempApplicationTable.UserID = userID;
                }

                if (fullName != null)
                {
                    tempApplicationTable.FullName = fullName;
                }

                if (email != null)
                {
                    tempApplicationTable.Email = email;
                }

                if (phoneNumber != null)
                {
                    tempApplicationTable.PhoneNumber = phoneNumber;
                }

                if (physicalAddress != null)
                {
                    tempApplicationTable.PhyscialAddress = physicalAddress;
                }

                if (referenceNumber != null)
                {
                    tempApplicationTable.ReferenceNumber = referenceNumber;
                }

                if (companyRegNo != null)
                {
                    tempApplicationTable.CompanyRegNo = companyRegNo;
                }

                if (typeOfApplication != null)
                {
                    tempApplicationTable.TypeOfApplication = typeOfApplication;
                }

                if (notificationNumber != null)
                {
                    tempApplicationTable.NotificationNumber = notificationNumber;
                }

                if (wBSNumber != null)
                {
                    tempApplicationTable.WBSNumber = wBSNumber;
                }

                if (physicalAddressOfProject != null)
                {
                    tempApplicationTable.PhysicalAddressOfProject = physicalAddressOfProject;
                }

                if (descriptionOfProject != null)
                {
                    tempApplicationTable.DescriptionOfProject = descriptionOfProject;
                }

                if (natureOfWork != null)
                {
                    tempApplicationTable.NatureOfWork = natureOfWork;
                }

                if (excavationType != null)
                {
                    tempApplicationTable.ExcavationType = excavationType;
                }

                if (expectedStartDate != null)
                {
                    tempApplicationTable.ExpectedStartDate = expectedStartDate;
                }

                if (expectedEndDate != null)
                {
                    tempApplicationTable.ExpectedEndDate = expectedEndDate;
                }

                if (location != null)
                {
                    tempApplicationTable.Location = location;
                }

                tempApplicationTable.DateUpdated = DateTime.Now;
                tempApplicationTable.isActive = true;

                if (ApplicationStatus != null)
                {
                    tempApplicationTable.ApplicationStatus = ApplicationStatus;
                }

                if (PreviousStageName != null)
                {
                    tempApplicationTable.PreviousStageName = PreviousStageName;
                }

                if (PreviousStageNumber != null)
                {
                    tempApplicationTable.PreviousStageNumber = PreviousStageNumber;
                }

                if (CurrentStageName != null)
                {
                    tempApplicationTable.CurrentStageName = CurrentStageName;
                }

                if (CurrentStageNumber != null)
                {
                    tempApplicationTable.CurrentStageNumber = CurrentStageNumber;
                }

                tempApplicationTable.CurrentStageStartDate = DateTime.Now;

                if (NextStageName != null)
                {
                    tempApplicationTable.NextStageName = NextStageName;
                }

                if (NextStageNumber != null)
                {
                    tempApplicationTable.NextStageNumber = NextStageNumber;
                }
                if (projectNumber != null)
                {
                    tempApplicationTable.ProjectNumber = projectNumber;
                }
                if (PermitStartDate != null)
                {
                    tempApplicationTable.PermitStartDate = PermitStartDate;
                }

                if (isPlanning != null)
                {
                    tempApplicationTable.isPlanning = isPlanning;
                }
                if (createdById != null)
                {
                    tempApplicationTable.CreatedById = createdById;
                }
                if (DatePaid != null)
                {
                    tempApplicationTable.DatePaid = DatePaid;
                }
                if (WBSRequired != null)
                {
                    tempApplicationTable.WBSRequired = WBSRequired;
                }
                if (Coordinates != null)
                {
                    tempApplicationTable.Coordinates = Coordinates;
                }

                _context.Update(tempApplicationTable);
                await _context.SaveChangesAsync();
                return tempApplicationTable;
            }



        }



        public async Task<bool> UpdateApplicationStage(int? ApplicationID, string? PreviousStageName, int? PreviousStageNumber, string? CurrentStageName, int? CurrentStageNumber, string? NextStageName, int? NextStageNumber, string? ApplicationStatus, string? projectNumber)
        {


            //this checks is the record exists in the db
            var tempApplicationTable = _context.Application.FirstOrDefault(x => x.ApplicationID == ApplicationID);
            if (tempApplicationTable != null)
            {


                if (tempApplicationTable.CurrentStageName == CurrentStageName)
                {
                    //tempApplicationTable.PreviousStageName = PreviousStageName;
                    //tempApplicationTable.PreviousStageNumber = PreviousStageNumber;
                    //tempApplicationTable.CurrentStageName = CurrentStageName;
                    //tempApplicationTable.CurrentStageNumber = CurrentStageNumber;
                    //tempApplicationTable.NextStageName = NextStageName;
                    //tempApplicationTable.NextStageNumber = NextStageNumber;
                    tempApplicationTable.ApplicationStatus = ApplicationStatus;

                }
                else if (projectNumber != null)
                {
                    tempApplicationTable.ProjectNumber = projectNumber;
                }
                else
                {
                    tempApplicationTable.PreviousStageName = PreviousStageName;
                    tempApplicationTable.PreviousStageNumber = PreviousStageNumber;
                    tempApplicationTable.CurrentStageName = CurrentStageName;
                    tempApplicationTable.CurrentStageNumber = CurrentStageNumber;
                    tempApplicationTable.CurrentStageStartDate = DateTime.Now;
                    tempApplicationTable.NextStageName = NextStageName;
                    tempApplicationTable.NextStageNumber = NextStageNumber;
                    tempApplicationTable.ApplicationStatus = ApplicationStatus;
                }





                _context.Update(tempApplicationTable);
                await _context.SaveChangesAsync();
                return true;

            }
            else
            {
                return false;
            }
        }


        public async Task<List<ApplicationsDTO>> GetApplicationsByApplicationID(int applicationID)
        {

            return await (
               from Applications in _context.Application
               where Applications.ApplicationID == applicationID
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
                   isActive = Applications.isActive,
                   PreviousStageName = Applications.PreviousStageName,
                   ApplicationStatus = Applications.ApplicationStatus,
                   CurrentStageName = Applications.CurrentStageName,
                   CurrentStageNumber = Applications.CurrentStageNumber,
                   CurrentStageStartDate = Applications.CurrentStageStartDate,
                   NextStageName = Applications.NextStageName,
                   NextStageNumber = Applications.NextStageNumber,
                   PreviousStageNumber = Applications.PreviousStageNumber,
                   isPlanning = Applications.isPlanning,
                   permitStartDate = Applications.PermitStartDate,
                   WBSRequired = Applications.WBSRequired,
                   Coordinates = Applications.Coordinates,
               }
               ).ToListAsync();



        }








        /*        public async Task<bool> DeleteApplication(int applicationID)
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


                }*/

        public async Task<bool> DeleteApplication(int applicationID)
        {
            // Check if the record exists in the db
            var tempApplicationTable = await _context.Application.FindAsync(applicationID);

            if (tempApplicationTable == null)
            {
                return false;
            }
            else
            {
                _context.Application.Remove(tempApplicationTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }






        //this method gets all the applications linked to a partcular user
        //We use DTO (a cutom list) because we may pull custom data from the database at some point, otherwise, we can just use the existing list.
        public async Task<List<ApplicationsDTO>> GetApplicationsList(string userId, bool isInternal)
        {
            if (isInternal)
            {
                return await (
                   from Applications in _context.Application
                   where Applications.isActive == true && Applications.FullName != "" && Applications.FullName != null
                   orderby Applications.DateCreated descending
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
                       isActive = Applications.isActive,
                       PreviousStageName = Applications.PreviousStageName,
                       ApplicationStatus = Applications.ApplicationStatus,
                       CurrentStageName = Applications.CurrentStageName,
                       CurrentStageNumber = Applications.CurrentStageNumber,
                       CurrentStageStartDate = Applications.CurrentStageStartDate,
                       NextStageName = Applications.NextStageName,
                       NextStageNumber = Applications.NextStageNumber,
                       PreviousStageNumber = Applications.PreviousStageNumber,
                       ProjectNumber = Applications.ProjectNumber,
                       isPlanning = Applications.isPlanning,
                       permitStartDate = Applications.PermitStartDate,
                       DatePaid = Applications.DatePaid,
                       WBSRequired = Applications.WBSRequired,
                       Coordinates = Applications.Coordinates,
                   }
                   ).ToListAsync();
            }
            else
            {
                return await (
                   from Applications in _context.Application
                   where Applications.UserID == userId && Applications.isActive == true && Applications.FullName != "" && Applications.FullName != null
                   orderby Applications.DateCreated descending
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
                       isActive = Applications.isActive,
                       PreviousStageName = Applications.PreviousStageName,
                       ApplicationStatus = Applications.ApplicationStatus,
                       CurrentStageName = Applications.CurrentStageName,
                       CurrentStageNumber = Applications.CurrentStageNumber,
                       CurrentStageStartDate = Applications.CurrentStageStartDate,
                       NextStageName = Applications.NextStageName,
                       NextStageNumber = Applications.NextStageNumber,
                       PreviousStageNumber = Applications.PreviousStageNumber,
                       isPlanning = Applications.isPlanning,
                       ProjectNumber = Applications.ProjectNumber,
                       permitStartDate = Applications.PermitStartDate,
                       DatePaid = Applications.DatePaid,
                       WBSRequired = Applications.WBSRequired,
                       Coordinates = Applications.Coordinates,
                   }
                   ).ToListAsync();
            }

        }



        /*Getting all applications by draft*/

        public async Task<List<ApplicationsDTO>> GetAllDraftedApplications(string userId, bool isInternal, bool isDrafted)
        {
            if (isInternal)
            {
                return await (
                   from Applications in _context.Application
                   where Applications.isActive == true && Applications.isDrafted == true
                   orderby Applications.DateCreated descending
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
                       isActive = Applications.isActive,
                       PreviousStageName = Applications.PreviousStageName,
                       ApplicationStatus = Applications.ApplicationStatus,
                       CurrentStageName = Applications.CurrentStageName,
                       CurrentStageNumber = Applications.CurrentStageNumber,
                       CurrentStageStartDate = Applications.CurrentStageStartDate,
                       NextStageName = Applications.NextStageName,
                       NextStageNumber = Applications.NextStageNumber,
                       PreviousStageNumber = Applications.PreviousStageNumber,
                       isPlanning = Applications.isPlanning,
                       permitStartDate = Applications.PermitStartDate,


                   }
                   ).ToListAsync();
            }
            else
            {
                return await (
                   from Applications in _context.Application
                   where Applications.UserID == userId && Applications.isActive == true && Applications.isDrafted == true
                   orderby Applications.DateCreated descending
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
                       isActive = Applications.isActive,
                       PreviousStageName = Applications.PreviousStageName,
                       ApplicationStatus = Applications.ApplicationStatus,
                       CurrentStageName = Applications.CurrentStageName,
                       CurrentStageNumber = Applications.CurrentStageNumber,
                       CurrentStageStartDate = Applications.CurrentStageStartDate,
                       NextStageName = Applications.NextStageName,
                       NextStageNumber = Applications.NextStageNumber,
                       PreviousStageNumber = Applications.PreviousStageNumber,
                       isPlanning = Applications.isPlanning,
                       permitStartDate = Applications.PermitStartDate,
                   }
                   ).ToListAsync();
            }

        }

        public async Task<List<ApplicationsDTO>> GetApplicationsByProjectNumber(string projectNumber)
        {
            return await (
               from Applications in _context.Application
               where Applications.isActive == true && Applications.ProjectNumber == projectNumber
               orderby Applications.DateCreated descending
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
                   isActive = Applications.isActive,
                   PreviousStageName = Applications.PreviousStageName,
                   ApplicationStatus = Applications.ApplicationStatus,
                   CurrentStageName = Applications.CurrentStageName,
                   CurrentStageNumber = Applications.CurrentStageNumber,
                   CurrentStageStartDate = Applications.CurrentStageStartDate,
                   NextStageName = Applications.NextStageName,
                   NextStageNumber = Applications.NextStageNumber,
                   PreviousStageNumber = Applications.PreviousStageNumber,
                   ProjectNumber = Applications.ProjectNumber,
                   isPlanning = Applications.isPlanning,
                   permitStartDate = Applications.PermitStartDate,
                   WBSRequired = Applications.WBSRequired,
                   Coordinates = Applications.Coordinates,
               }
               ).ToListAsync();
        }
        public async Task<List<ApplicationsDTO>> GetApplicationsForReviewer(int? zoneId, string userId)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true &&
                          ((SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == userId) ||
                           (SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == null) ||
                           (SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == "All users in Subdepartment FA"))
                    orderby Applications.DateCreated descending
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
                    isActive = Applications.isActive,
                    PreviousStageName = Applications.PreviousStageName,
                    ApplicationStatus = Applications.ApplicationStatus,
                    CurrentStageName = Applications.CurrentStageName,
                    CurrentStageNumber = Applications.CurrentStageNumber,
                    CurrentStageStartDate = Applications.CurrentStageStartDate,
                    NextStageName = Applications.NextStageName,
                    NextStageNumber = Applications.NextStageNumber,
                    PreviousStageNumber = Applications.PreviousStageNumber,
                    ProjectNumber = Applications.ProjectNumber,
                    isPlanning = Applications.isPlanning,
                    permitStartDate = Applications.PermitStartDate,
                    WBSRequired = Applications.WBSRequired,
                    Coordinates = Applications.Coordinates,
                }
           ).ToListAsync();
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsForDepartment(int? zoneId, int? subDepartmentID)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true &&
                          ((SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.SubDepartmentID == subDepartmentID))
                    orderby Applications.DateCreated descending
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
                        isActive = Applications.isActive,
                        PreviousStageName = Applications.PreviousStageName,
                        ApplicationStatus = Applications.ApplicationStatus,
                        CurrentStageName = Applications.CurrentStageName,
                        CurrentStageNumber = Applications.CurrentStageNumber,
                        CurrentStageStartDate = Applications.CurrentStageStartDate,
                        NextStageName = Applications.NextStageName,
                        NextStageNumber = Applications.NextStageNumber,
                        PreviousStageNumber = Applications.PreviousStageNumber,
                        ProjectNumber = Applications.ProjectNumber,
                        isPlanning = Applications.isPlanning,
                        permitStartDate = Applications.PermitStartDate,
                        WBSRequired = Applications.WBSRequired,
                        Coordinates = Applications.Coordinates,
                    }
           ).ToListAsync();
        }
    }
}
