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
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
    


        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        
        }

        [HttpPost("AddUpdateComment")]
        public async Task<object> AddUpdateComment([FromBody] CommentBindingModel model)
        {
            try
            {

                if (model == null || model.Comment.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentService.AddUpdateComment(model.CommentID,model.ApplicationID, model.SubDepartmentForCommentID,model.SubDepartmentID ,model.SubDepartmentName ,model.Comment, model.CommentStatus ,model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.CommentID > 0 ? "Comment Updated Successfully" : "Comment Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteComment")]
        public async Task<object> DeleteComment([FromBody] int commentID)
        {
            try
            {

                if (commentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentService.DeleteComment(commentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comment Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetCommentByApplicationID")]
        public async Task<object> GetCommentByApplicationID([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 3)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentService.GetCommentByApplicationID(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

    }

}
