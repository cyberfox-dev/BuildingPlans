﻿using BuildingPlans.Data;
using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.BindingModel.ForGetByIDModels;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationsService _applicationsService;
        private readonly AppDBContext _context;

        public ApplicationsController(IApplicationsService applicationsService, AppDBContext context)
        {
            _applicationsService = applicationsService;
            _context = context;

        }


        [HttpPost("AddUpdateApplication")]
        public async Task<object> AddUpdateApplication([FromBody] ApplicationsBindingModel model)
        {
            try
            {

                if (model == null || !ModelState.IsValid)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.AddUpdateApplication(model.ApplicationID, model.UserID, model.FullName, model.Email, model.AlternativeEmail, model.PhoneNumber, model.PhysicalAddress, model.ReferenceNumber, model.CompanyRegNo, model.TypeOfApplication, model.NotificationNumber, model.WBSNumber, model.PhysicalAddressOfProject, model.DescriptionOfProject, model.NatureOfWork, model.ExcavationType, model.ExpectedStartDate, model.ExpectedEndDate, model.Location, model.CreatedById, model.PreviousStageName, model.PreviousStageNumber, model.CurrentStageName, model.CurrentStageNumber, model.NextStageName, model.NextStageNumber, model.ApplicationStatus, model.isDrafted, model.ProjectNumber, model.isPlanning, model.PermitStartDate, model.DatePaid, model.WBSRequired, model.Coordinates, model.NetworkLicenses);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? "Application Updated Successfully" : "Application Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("UpdateApplicationStage")]
        public async Task<object> UpdateApplicationStage([FromBody] ApplicationStagesBindingModel model)
        {
            try
            {

                if (model == null || ModelState.IsValid == false)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.UpdateApplicationStage(model.ApplicationID, model.PreviousStageName, model.PreviousStageNumber, model.CurrentStageName, model.CurrentStageNumber, model.NextStageName, model.NextStageNumber, model.ApplicationStatus, model.ProjectNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, ("Stage Updated Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteApplication")]
        public async Task<object> DeleteApplication([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.DeleteApplication(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetApplicationsByApplicationID")]
        public async Task<object> GetApplicationsByApplicationID([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsByApplicationID(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Details Gotten Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetApplicationsList")]
        public async Task<object> GetApplicationsList([FromBody] GetApplicationsSP modal)
        {
            try
            {

                //if (modal.isInternal)
                //{
                //    var result = _context.ApplicationListDTO.FromSqlInterpolated($"sp_GetApplications {1},{modal.UserID}").AsEnumerable();
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Linked Users", result));
                //}
                //else
                //{
                //    var result = _context.ApplicationListDTO.FromSqlRaw($"sp_GetApplications {modal.UserID,0}").AsEnumerable();
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Linked Users", result));
                //}





                if (modal.UserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsList(modal.UserID, modal.isInternal);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        /*for drafted applications*/
        [HttpPost("GetAllDraftedApplications")]
        public async Task<object> GetAllDraftedApplications([FromBody] GetApplicationsSP modal)
        {
            try
            {

                if (modal.isDrafted == false)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetAllDraftedApplications(modal.UserID, modal.isInternal, modal.isDrafted);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        /*Reapply options on rejected applications*/
        [HttpPost("GetApplicationsByProjectNumber")]
        public async Task<object> GetApplicationsByProjectNumber([FromBody] ApplicationStagesBindingModel model)
        {
            try
            {

                if (model.ProjectNumber == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsByProjectNumber(model.ProjectNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Details Gotten Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        [HttpPost("GetApplicationsForReviewer")]
        public async Task<object> GetApplicationsForReviewer([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForReviewer(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetApplicationsForDepAdmin")]
        public async Task<object> GetApplicationsForDepAdmin([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForDepAdmin(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetApplicationsForFinalReview")]
        public async Task<object> GetApplicationsForFinalReview([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForFinalReview(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetApplicationsForGISReviewer")]
        public async Task<object> GetApplicationsForGISReviewer([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForGISReviewer(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetApplicationsForSeniorReviewer")]
        public async Task<object> GetApplicationsForSeniorReviewer([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForSeniorReviewer(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetApplicationsForPermitIssuer")]
        public async Task<object> GetApplicationsForPermitIssuer([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForPermitIssuer(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetApplicationsForPermitCoordinator")]
        public async Task<object> GetApplicationsForPermitCoordinator([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForPermitCoordinator(model.ZoneID, model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        //JJS TODO: getting all applications for EMB so that the projects appear for them in my reviews

        [HttpPost("GetApplicationsForEMB")]
        public async Task<object> GetApplicationsForEMB([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.UserID.Length <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Error, Applications could not be retrieved.", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForEMB(model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetApplicationsForDepartment")]
        public async Task<object> GetApplicationsForDepartment([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ZoneID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "ZoneID is invalid", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsForDepartment(model.ZoneID, model.SubDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications retrieved successfully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        // reapply Sindiswa 24 January 2024

        [HttpPost("IncreaseReapplyCount")]
        public async Task<object> IncreaseReapplyCount([FromBody] ApplicationsBindingModel model)
        {
            try
            {
                if (model.ProjectNumber == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {

                    var result = await _applicationsService.IncreaseReapplyCount(model.ProjectNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications count increased successfully", result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        // reapply Sindiswa 25 January 2024
        [HttpPost("DeActivateOldAppsAfterReapply")]
        public async Task<object> DeActivateOldAppsAfterReapply([FromBody] ApplicationsBindingModel model)
        {
            try
            {

                if (model.ProjectNumber == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.DeActivateOldAppsAfterReapply(model.ProjectNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications deactivated successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        //reapply Sindiswa 26 January 2024
        [HttpPost("GetApplicationsByProjectNumberRA")]
        public async Task<object> GetApplicationsByProjectNumberRA([FromBody] ApplicationStagesBindingModel model)
        {
            try
            {

                if (model.ProjectNumber == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsByProjectNumberRA(model.ProjectNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Details Gathered Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        //escalation Sindiswa 29 January 2024
        [HttpPost("EscalateApplication")]
        public async Task<object> EscalateApplication([FromBody] ApplicationStagesBindingModel model)
        {
            try
            {

                if (model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.EscalateApplication(model.ApplicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Escalated Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        [HttpPost("CancelEscalation")]
        public async Task<object> CancelEscalation([FromBody] ApplicationStagesBindingModel model)
        {
            try
            {

                if (model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.CancelEscalation(model.ApplicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application De-Escalated Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        #region zxNum-and-contractorAccount Sindiswa 28 February 2024
        [HttpPost("AddUpdateZXNumbers")]
        public async Task<object> AddUpdateZXNumbers([FromBody] ApplicationsBindingModel model)
        {

            try
            {

                if (model == null || !ModelState.IsValid)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.AddUpdateZXNumbers(model.ApplicationID, model.WaterZXNumber, model.RIMZXNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "ZX Number(s) Added Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }

        }

        [HttpPost("GetZXDetails")]
        public async Task<object> GetZXDetails([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetZXDetails(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application ZX Details Gotten Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        #endregion

        [HttpPost("AddUpdateContractorAccountDetails")]
        public async Task<object> AddUpdateContractorAccountDetails([FromBody] ApplicationsBindingModel model)
        {

            try
            {

                if (model == null || !ModelState.IsValid)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.AddUpdateContractorAccountDetails(model.ApplicationID, model.ContractorAccountDetails);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Contractor Details Added/Updated Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }

        }

        //Audit Trail Kyle 06-03-24
        [HttpPost("GetApplicationsWithinDateRange")]
        public async Task<object> GetApplicationsWithinDateRange([FromBody] ApplicationsDTO model)
        {
            try
            {
                if (model.ExpectedStartDate == null || model.ExpectedEndDate == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsWithinDateRange(model.ExpectedStartDate, model.ExpectedEndDate);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications within time range", result));
                }
            }

            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllSystemApplications")]
        public async Task<object> GetAllSystemApplications()
        {
            try
            {
                var result = new object();

                var query1 = await (from wayleave in _context.Application
                                    where wayleave.ProjectNumber != null && wayleave.ProjectNumber != "" && wayleave.isActive == true 
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = wayleave.ApplicationID,
                                        LSNumber = wayleave.ProjectNumber,
                                        BPApplicationType = "Wayleave",
                                        PhysicalAddress = wayleave.PhysicalAddressOfProject,
                                        BPApplicationID = "",
                                        FirstName = wayleave.FullName.Substring(0, wayleave.FullName.IndexOf(" ")),
                                        Surname = wayleave.FullName.Substring(wayleave.FullName.IndexOf(" ")),
                                        Stage = wayleave.CurrentStageName,
                                        Status = wayleave.ApplicationStatus,
                                        DateCreated = wayleave.DateCreated,
                                        DateUpdated = wayleave.DateUpdated,
                                        Latitude = wayleave.Coordinates.Substring(0, wayleave.Coordinates.IndexOf(",")),
                                        Longitude = wayleave.Coordinates.Substring(wayleave.Coordinates.IndexOf(",") + 1),
                                        CreatedById = wayleave.CreatedById,



                                    }).ToListAsync();

                var query2 = await (from bp in _context.BuildingApplications
                                    where bp.LSNumber != null && bp.LSNumber != "" && bp.isActive == true && bp.isDraft != true
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = bp.ApplicationID,
                                        LSNumber = bp.LSNumber,
                                        BPApplicationType = bp.BPApplicationType,
                                        PhysicalAddress = bp.PhysicalAddress,
                                        BPApplicationID = bp.BPApplicationID,
                                        FirstName = bp.FirstName,
                                        Surname = bp.Surname,
                                        Stage = bp.Stage,
                                        Status = bp.Status,
                                        DateCreated = bp.DateCreated,
                                        DateUpdated = bp.DateUpdated,
                                        Latitude = bp.Latitude,
                                        Longitude = bp.Longitude,
                                        CreatedById = bp.CreatedById
                                        
                                    }).ToListAsync();

                var query3 = await (from sign in _context.BPSignageApplication
                                    where sign.isActive == true && sign.UserID != null 
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = sign.ApplicationID,
                                        BPApplicationType = "Signage",
                                        PhysicalAddress = sign.Address,
                                        FirstName = sign.ApplicantName,
                                        Surname = sign.ApplicantSurname ,
                                        Stage = sign.CurrentStage,
                                        DateCreated = sign.DateCreated,
                                        DateUpdated = sign.DateUpdated,
                                        LSNumber = sign.ProjectNumber,
                                        CreatedById = sign.CreatedById

                                    }).ToListAsync();

                var query4 = await (from flag in _context.BPFlagApplication
                                    where flag.isActive == true && flag.UserID != null 
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = flag.ApplicationID,
                                        BPApplicationType = "Flag",
                                        PhysicalAddress = flag.Location,
                                        FirstName = flag.ApplicantName,
                                        Surname = flag.ApplicantSurname,
                                        DateCreated = flag.DateCreated,
                                        DateUpdated = flag.DateUpdated,
                                        LSNumber = flag.ProjectNumber,
                                        CreatedById = flag.CreatedById

                                    }).ToListAsync();

                var query5 = await (from banner in _context.BPBannerApplication
                                    where banner.isActive == true && banner.UserID != null
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = banner.ApplicationID,
                                        BPApplicationType = "Banner",
                                        PhysicalAddress = banner.Address,
                                        FirstName = banner.ApplicantName,
                                        Surname = banner.ApplicantSurname,
                                        Stage = banner.CurrentStage,
                                        DateCreated = banner.DateCreated,
                                        DateUpdated = banner.DateUpdated,
                                        LSNumber = banner.ProjectNumber,
                                        CreatedById = banner.CreatedById

                                    }).ToListAsync();

                var query6 = await (from demolition in _context.BPDemolitionApplication
                                    where demolition.isActive == true 
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = demolition.DemolitionID,
                                        BPApplicationType = "Demolition",
                                        PhysicalAddress = demolition.SiteAddress,
                                        FirstName = demolition.ApplicantName,
                                        Surname = demolition.ApplicantSurname,
                                        Stage = demolition.CurrentStage,
                                        Status = demolition.CurrentStage,
                                        DateCreated = demolition.DateCreated,
                                        DateUpdated = demolition.DateUpdated,
                                        LSNumber = demolition.ProjectNumber,
                                        CreatedById = demolition.CreatedById
                                        
                                    }).ToListAsync();
                result =  query1
                    .Concat(query2)
                    .Concat(query3)
                    .Concat(query4)
                    .Concat(query5)
                    .Concat(query6).OrderByDescending(x => x.DateCreated)
                    .ToList();
                
                
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
