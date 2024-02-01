using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Data;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using System;
using Microsoft.Extensions.Localization;

namespace WayleaveManagementSystem.Controllers
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

                if (model == null || !ModelState.IsValid )
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                       var result = await _applicationsService.AddUpdateApplication(model.ApplicationID, model.UserID, model.FullName, model.Email, model.PhoneNumber, model.PhysicalAddress, model.ReferenceNumber, model.CompanyRegNo, model.TypeOfApplication, model.NotificationNumber, model.WBSNumber, model.PhysicalAddressOfProject, model.DescriptionOfProject, model.NatureOfWork, model.ExcavationType, model.ExpectedStartDate, model.ExpectedEndDate, model.Location, model.CreatedById, model.PreviousStageName,model.PreviousStageNumber, model.CurrentStageName, model.CurrentStageNumber, model.NextStageName, model.NextStageNumber, model.ApplicationStatus, model.isDrafted,model.ProjectNumber, model.isPlanning, model.PermitStartDate, model.DatePaid,model.WBSRequired,model.Coordinates);
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

                if (model == null || ModelState.IsValid == false )
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.UpdateApplicationStage(model.ApplicationID, model.PreviousStageName, model.PreviousStageNumber, model.CurrentStageName, model.CurrentStageNumber, model.NextStageName, model.NextStageNumber, model.ApplicationStatus,model.ProjectNumber);
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
                    var result = await _applicationsService.GetApplicationsList(modal.UserID,modal.isInternal);
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
                if(model.ProjectNumber == null)
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
    }
}
