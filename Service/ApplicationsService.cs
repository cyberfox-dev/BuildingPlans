using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.IServices;
using BuildingPlans.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class ApplicationsService : IApplicationsService
    {
        private readonly AppDBContext _context;

        public ApplicationsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Applications> AddUpdateApplication(int? ApplicationID, string? userID, string? fullName, string? email, string? alternativeEmail, string? phoneNumber, string? physicalAddress, string? referenceNumber, string? companyRegNo, string? typeOfApplication, string? notificationNumber, string? wBSNumber, string? physicalAddressOfProject, string? descriptionOfProject, string? natureOfWork, string? excavationType, DateTime? expectedStartDate, DateTime? expectedEndDate, string? location, string? createdById, string? PreviousStageName, int? PreviousStageNumber, string? CurrentStageName, int? CurrentStageNumber, string? NextStageName, int? NextStageNumber, string? ApplicationStatus, bool? isDrafted, string? projectNumber, bool? isPlanning, DateTime? PermitStartDate, DateTime? DatePaid, bool? WBSRequired, string? Coordinates, bool? NetworkLicenses)
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
                    AlternativeEmail = alternativeEmail,
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
                    NetworkLicenses = NetworkLicenses,
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
                #region checkingNotifications Sindiswa 15 February 2024
                if (alternativeEmail != null)
                {
                    tempApplicationTable.AlternativeEmail = alternativeEmail;
                }
                #endregion
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
                if (NetworkLicenses != null)
                {
                    tempApplicationTable.NetworkLicenses = NetworkLicenses;
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
               where Applications.ApplicationID == applicationID && Applications.isActive == true //reapply Sindiswa 26 January 2024
               select new ApplicationsDTO()
               {
                   ApplicationID = Applications.ApplicationID,
                   UserID = Applications.UserID,
                   FullName = Applications.FullName,
                   Email = Applications.Email,
                   AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                   ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                   isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                   EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                   EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                   ProjectNumber = Applications.ProjectNumber,// Clarifications Alerts Kyle
                   NetworkLicenses = Applications.NetworkLicenses,
                   ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
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




        //JJS 18Jan Added the createdByUserID part to the external so they can see the internal applications that they created if they did.

        //this method gets all the applications linked to a partcular user
        //We use DTO (a cutom list) because we may pull custom data from the database at some point, otherwise, we can just use the existing list.
        /*jjs commit 23JAN24 - typoFix for Email for Sign off, Applicant filter dashbaord table fix*/
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
                       AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                       ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                       isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                       EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                       EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                       NetworkLicenses = Applications.NetworkLicenses,
                       ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                   }
                   ).ToListAsync();
            }
            else
            {
                return await (
                   from Applications in _context.Application
                   where Applications.isActive == true && Applications.FullName != "" && Applications.FullName != null && (Applications.UserID == userId || Applications.CreatedById == userId) //reapply Sindiswa 26 January 2024
                   orderby Applications.DateCreated descending
                   select new ApplicationsDTO()
                   {
                       ApplicationID = Applications.ApplicationID,
                       UserID = Applications.UserID,
                       FullName = Applications.FullName,
                       Email = Applications.Email,
                       AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                       ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                       isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024

                       EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                       EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                       NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
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
                       AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                       AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                   AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                   ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                   isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                   EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                   EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                   NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                   ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
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
                          ((SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == userId))
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsForDepAdmin(int? zoneId, string userId)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true && SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == null && Applications.ApplicationStatus == "Distributed"
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }
        public async Task<List<ApplicationsDTO>> GetApplicationsForFinalReview(int? zoneId, string userId)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true &&
                          ((SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == userId) ||
                           (SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == "All users in Subdepartment FA"))
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsForPermitCoordinator(int? zoneId, string? userId)
        {
            return await (
                    from Applications in _context.Application
                    join PermitSubForComment in _context.PermitSubForComment
                    on Applications.ApplicationID equals PermitSubForComment.ApplicationID
                    where Applications.isActive == true && Applications.CurrentStageName == "PTW" && Applications.PermitStartDate != null && PermitSubForComment.UserAssaignedToComment == null && PermitSubForComment.ZoneID == zoneId
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }
        public async Task<List<ApplicationsDTO>> GetApplicationsForPermitIssuer(int? zoneId, string userId)
        {
            return await (
                    from Applications in _context.Application
                    join PermitSubForComment in _context.PermitSubForComment
                    on Applications.ApplicationID equals PermitSubForComment.ApplicationID
                    where Applications.isActive == true && Applications.CurrentStageName == "PTW" && Applications.PermitStartDate != null && PermitSubForComment.UserAssaignedToComment == userId && PermitSubForComment.ZoneID == zoneId
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsForEMB(string userId)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true && Applications.isEscalated == true // Applications.ApplicationStatus == "Unpaid" -- escalation Sindiswa 29 January 2024, well there's already a filter by Unpaid method moss

                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).Distinct().ToListAsync();
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsForSeniorReviewer(int? zoneId, string? userId)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true && SubDepartmentComment.IsRefered == true && (SubDepartmentComment.ZoneID == zoneId && (SubDepartmentComment.UserAssaignedToComment == "Senior Reviewer to comment" || SubDepartmentComment.UserAssaignedToComment == "Referred"))
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsForGISReviewer(int? zoneId, string? userId)
        {
            return await (
                    from Applications in _context.Application
                    join SubDepartmentComment in _context.SubDepartmentForComment
                    on Applications.ApplicationID equals SubDepartmentComment.ApplicationID
                    where Applications.isActive == true && SubDepartmentComment.ZoneID == zoneId && SubDepartmentComment.UserAssaignedToComment == userId && SubDepartmentComment.isGISReviewing == true
                    orderby Applications.DateCreated descending
                    select new ApplicationsDTO()
                    {
                        ApplicationID = Applications.ApplicationID,
                        UserID = Applications.UserID,
                        FullName = Applications.FullName,
                        Email = Applications.Email,
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
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
                        AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                        ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                        isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                        EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                        EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                        NetworkLicenses = Applications.NetworkLicenses,//Project size Kyle 27-02-24
                        ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
                    }
           ).ToListAsync();
        }

        #region  reapply Sindiswa 26 January 2024
        /*public async Task<bool> IncreaseReapplyCount(string projectNumber)
        {
            var applicationsWithProjectNumber = _context.Application.Where(x => x.ProjectNumber == projectNumber).ToList();

            if (applicationsWithProjectNumber.Any())
            {
                foreach (var tempApplicationTable in applicationsWithProjectNumber)
                {
                    //tempApplicationTable.ReApplyCount++; // Increase the ReApplyCount by 1
                    tempApplicationTable.ReApplyCount = (tempApplicationTable.ReApplyCount ?? 0) + 1;
                    _context.Update(tempApplicationTable);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }


        }*/
        public async Task<bool> IncreaseReapplyCount(string projectNumber)
        {
            var applicationsWithProjectNumber = await _context.Application
                .Where(x => x.ProjectNumber == projectNumber)
                .ToListAsync();

            if (applicationsWithProjectNumber.Any())
            {
                var reapplyCount = applicationsWithProjectNumber.Count;

                foreach (var tempApplicationTable in applicationsWithProjectNumber)
                {
                    tempApplicationTable.ReApplyCount = reapplyCount;
                    _context.Update(tempApplicationTable);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }


        public async Task<Applications> DeActivateOldAppsAfterReapply(string projectNumber)
        {
            var latestEntry = await (
                from Applications in _context.Application
                where Applications.ProjectNumber == projectNumber
                orderby Applications.DateCreated descending
                select Applications
            ).FirstOrDefaultAsync();

            if (latestEntry != null)
            {
                var applicationsToUpdate = await (
                    from Applications in _context.Application
                    where Applications.isActive == true
                        && Applications.ProjectNumber == projectNumber
                        && Applications.ApplicationID != latestEntry.ApplicationID
                    select Applications
                ).ToListAsync();

                foreach (var application in applicationsToUpdate)
                {
                    application.isActive = false;
                    application.ApplicationStatus = "Closed";
                    application.CurrentStageName = "Closed";
                    application.CurrentStageNumber = 6;
                    application.CurrentStageStartDate = DateTime.Now;
                    application.NextStageName = null;
                    application.NextStageNumber = null;
                }

                await _context.SaveChangesAsync();
                return latestEntry;
            }
            // No action needed if there's only one entry for the projectNumber
            return null;
        }

        public async Task<List<ApplicationsDTO>> GetApplicationsByProjectNumberRA(string projectNumber)
        {
            return await (
               from Applications in _context.Application
               where Applications.ProjectNumber == projectNumber //&& Applications.isActive == true
               orderby Applications.DateCreated descending
               select new ApplicationsDTO()
               {
                   ApplicationID = Applications.ApplicationID,
                   UserID = Applications.UserID,
                   FullName = Applications.FullName,
                   Email = Applications.Email,
                   AlternativeEmail = Applications.AlternativeEmail, // checkingNotifications Sindiswa 15 February 2024
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
                   ReApplyCount = Applications.ReApplyCount, //reapply Sindiswa 26 January 2024
                   isEscalated = Applications.isEscalated, //escalation Sindiswa 29 January 2024
                   EscalationDate = Applications.EscalationDate,//escalation Sindiswa 31 January 2024
                   EMBActionDate = Applications.EMBActionDate,//escalation Sindiswa 31 January 2024
                   ContractorAccountDetails = Applications.ContractorAccountDetails, //zxNumberUpdate Sindiswa 01 March 2024
               }
               ).Skip(1) // Skip the latest application
                .ToListAsync();
        }

        #endregion

        public async Task<bool> EscalateApplication(int? applicationID)
        {
            // Check if the record exists in the db
            var tempApplicationTable = await _context.Application.FindAsync(applicationID);

            if (tempApplicationTable == null)
            {
                return false;
            }
            else
            {
                // Set isEscalated to true
                tempApplicationTable.isEscalated = true;
                tempApplicationTable.EscalationDate = DateTime.Now;
                tempApplicationTable.EMBActionDate = null;

                // Update the entity in the database
                _context.Application.Update(tempApplicationTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> CancelEscalation(int? applicationID)
        {
            var tempApplicationTable = await _context.Application.FindAsync(applicationID);

            if (tempApplicationTable == null)
            {
                return false;
            }
            else
            {
                // Set isEscalated to true
                tempApplicationTable.isEscalated = false;
                tempApplicationTable.EMBActionDate = DateTime.Now;
                // Update the entity in the database
                _context.Application.Update(tempApplicationTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }
        #region zxNum-and-contractorAccount Sindiswa 28 February 2024
        public async Task<Applications> AddUpdateZXNumbers(int? ApplicationID, string? WaterZXNumber, string? RIMZXNumber)
        {
            if (ApplicationID == 0)
            {
                ApplicationID = null;
            }


            //this checks is the record exists in the db
            var tempApplicationTable = _context.Application.FirstOrDefault(x => x.ApplicationID == ApplicationID);


            if (WaterZXNumber != null)
            {
                tempApplicationTable.WaterZXNumber = WaterZXNumber;
            }
            if (RIMZXNumber != null)
            {
                tempApplicationTable.RIMZXNumber = RIMZXNumber;
            }

            _context.Update(tempApplicationTable);
            await _context.SaveChangesAsync();
            return tempApplicationTable;

        }
        public async Task<List<ApplicationsDTO>> GetZXDetails(int applicationID)
        {
            return await (
              from Applications in _context.Application
              where Applications.ApplicationID == applicationID && Applications.isActive == true
              select new ApplicationsDTO()

              {
                  WaterZXNumber = Applications.WaterZXNumber,
                  RIMZXNumber = Applications.RIMZXNumber,
              }
           ).ToListAsync();
        }

        #endregion

        public async Task<Applications> AddUpdateContractorAccountDetails(int? ApplicationID, string? ContractorAccountDetails)
        {
            if (ApplicationID == 0)
            {
                ApplicationID = null;
            }


            //this checks is the record exists in the db
            var tempApplicationTable = _context.Application.FirstOrDefault(x => x.ApplicationID == ApplicationID);


            if (ContractorAccountDetails != null)
            {
                tempApplicationTable.ContractorAccountDetails = ContractorAccountDetails;
            }

            _context.Update(tempApplicationTable);
            await _context.SaveChangesAsync();
            return tempApplicationTable;

        }
        //Audit Trail Kyle 06-03-24
        public async Task<List<ApplicationsDTO>> GetApplicationsWithinDateRange(DateTime? startDate, DateTime? endDate)
        {
            return await (
                  from Applications in _context.Application
                  where Applications.isActive == true && Applications.isDrafted == false && Applications.DateCreated <= startDate && Applications.DateCreated <= endDate
                  select new ApplicationsDTO()
                  {
                      ApplicationID = Applications.ApplicationID,
                      UserID = Applications.UserID,
                      FullName = Applications.FullName,
                      Email = Applications.Email,
                      AlternativeEmail = Applications.AlternativeEmail,
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


}
