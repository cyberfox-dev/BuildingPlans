using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;

namespace WayleaveManagementSystem.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SubDepartmentForCommentController : ControllerBase
    {
        private readonly ISubDepartmentForCommentService _subDepartmentForCommentService;
    


        public SubDepartmentForCommentController(ISubDepartmentForCommentService subDepartmentForCommentService)
        {
            _subDepartmentForCommentService = subDepartmentForCommentService;
        
        }

        [HttpPost("AddUpdateDepartmentForComment")]
        public async Task<object> AddUpdateDepartmentForComment([FromBody] SubDepartmentForCommentBindingModel model)
        {
            try
            {

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.AddUpdateDepartmentForComment(model.SubDepartmentForCommentID, model.ApplicationID, model.SubDepartmentID, model.SubDepartmentName, model.UserAssaignedToComment,model.CommentStatus ,model.CreatedById,model.ZoneID,model.ZoneName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.SubDepartmentForCommentID > 0 ? "Department For Comment Updated Successfully" : "Department For Comment Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DepartmentForCommentUserAssaignedToComment")]
        public async Task<object> DepartmentForCommentUserAssaignedToComment([FromBody] SubDepartmentForCommentBindingModel model)
        {
            try
            {

                if (model.SubDepartmentForCommentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.DepartmentForCommentUserAssaignedToComment(model.SubDepartmentForCommentID,model.UserAssaignedToComment);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User Assigned Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DepartmentForCommentFinalAppovalUserToComment")]
        public async Task<object> DepartmentForCommentFinalAppovalUserToComment([FromBody] SubDepartmentForCommentBindingModel model)
        {
            try
            {

                if (model.SubDepartmentForCommentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.DepartmentForCommentUserAssaignedToComment(model.SubDepartmentForCommentID, model.UserAssaignedToComment);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User Assaigned Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




        [HttpPost("DeleteDepartmentForComment")]
        public async Task<object> DeleteDepartmentForComment([FromBody] int subDepartmentForCommentID)
        {
            try
            {

                if (subDepartmentForCommentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.DeleteDepartmentForComment(subDepartmentForCommentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department For Comment Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetSubDepartmentForComment")]
        public async Task<object> GetSubDepartmentForComment([FromBody] GetByApplicationID model)
        {
            try
            {

                if (model.ApplicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.GetSubDepartmentForComment(model.ApplicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department For Comment List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("GetSubDepartmentForCommentBySubID")]
        public async Task<object> GetSubDepartmentForCommentBySubID([FromBody] GetByApplicationID model)
        {
            try
            {

                if (model.ApplicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.GetSubDepartmentForCommentBySubID(model.ApplicationID,model.SubDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department For Comment List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("UpdateCommentStatus")]
        public async Task<object> UpdateCommentStatus([FromBody] SubDepartmentForCommentBindingModel model)
        {
            try
            {

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.UpdateCommentStatus(model.SubDepartmentForCommentID, model.CommentStatus, model.isAwaitingClarity, model.IsRefered, model.UserAssaignedToComment,model.FinalApproval);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Updated Comment Status", result));

                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("ReferToComment")]
        public async Task<object> ReferToComment([FromBody] SubDepartmentForCommentBindingModel model)
        {
            try
            {

                if (model.CommentStatus == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.ReferToComment(model.SubDepartmentForCommentID, model.CommentStatus, model.IsRefered, model.ReferedToUserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Refered", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("UpdateCommentStatusToAwaitingClarity")]
        public async Task<object> UpdateCommentStatusToAwaitingClarity([FromBody] SubDepartmentForCommentBindingModel model)
        {
            try
            {

                if (model.CommentStatus == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _subDepartmentForCommentService.UpdateCommentStatusToAwaitingClarity(model.SubDepartmentForCommentID, model.CommentStatus, model.isAwaitingClarity);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Awaiting clarity from client", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

       
        
    }

}
