using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationsService _applicationsService;

        public ApplicationsController(IApplicationsService applicationsService)
        {
            _applicationsService = applicationsService;
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
                    var result = await _applicationsService.AddUpdateApplication(model.ApplicationID, model.UserID, model.FullName, model.Email, model.PhoneNumber, model.PhysicalAddress, model.ReferenceNumber, model.CompanyRegNo, model.TypeOfApplication, model.NotificationNumber, model.WBSNumber, model.PhysicalAddressOfProject, model.DescriptionOfProject, model.NatureOfWork, model.ExcavationType, model.ExpectedStartDate, model.ExpectedEndDate, model.Location, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? "Application Updated Sussessfully" : "Application Added Sussessfully"), result));
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
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Deleted Sussessfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetApplicationsList")]
        public async Task<object> GetApplicationsList([FromBody] string userId)
        {
            try
            {

                if (userId.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _applicationsService.GetAllApplications(userId);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Applications List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
