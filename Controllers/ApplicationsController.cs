using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Data;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using System;

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

                if (model == null || ModelState.IsValid && model.FullName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                       var result = await _applicationsService.AddUpdateApplication(model.ApplicationID, model.UserID, model.FullName, model.Email, model.PhoneNumber, model.PhysicalAddress, model.ReferenceNumber, model.CompanyRegNo, model.TypeOfApplication, model.NotificationNumber, model.WBSNumber, model.PhysicalAddressOfProject, model.DescriptionOfProject, model.NatureOfWork, model.ExcavationType, model.ExpectedStartDate, model.ExpectedEndDate, model.Location, model.CreatedById, model.PreviousStageName,model.PreviousStageNumber, model.CurrentStageName, model.CurrentStageNumber, model.NextStageName, model.NextStageNumber, model.ApplicationStatus, model.isDrafted);
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
                    var result = await _applicationsService.UpdateApplicationStage(model.ApplicationID, model.PreviousStageName, model.PreviousStageNumber, model.CurrentStageName, model.CurrentStageNumber, model.NextStageName, model.NextStageNumber, model.ApplicationStatus);
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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Deleted Successfully", result));
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
        public async Task<object> GetApplicationsByProjectNumber([FromBody] string projectNumber)
        {
            try
            {

                if (projectNumber == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetApplicationsByProjectNumber(projectNumber);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }
}
