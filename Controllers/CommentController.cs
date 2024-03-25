using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
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

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentService.AddUpdateComment(model.CommentID, model.ApplicationID, model.SubDepartmentForCommentID, model.SubDepartmentID, model.SubDepartmentName, model.Comment, model.CommentStatus, model.CreatedById, model.isClarifyCommentID, model.isApplicantReplay, model.UserName, model.ZoneName, model.CanReplyUserID); //Clarify Alert Kyle
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

        [HttpPost("GetSubDepByCommentStatus")]
        public async Task<object> GetSubDepByCommentStatus([FromBody] CommentBindingModel model)
        {
            try
            {

                if (model.CommentStatus == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentService.GetSubDepByCommentStatus(model.CommentStatus, model.ApplicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetCommentsForSpecialConditions")]
        public async Task<object> GetCommentsForSpecialConditions([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 3)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentService.GetCommentsForSpecialConditions(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        //GetCommentsForSpecialConditions

        //Clarify Alerts Kyle 
        [HttpPost("GetAllCommentsAwaitingClarity")]
        public async Task<object> GetAllCommentsAwaitingClarity([FromBody] CommentBindingModel model)
        {
            if (model.CanReplyUserID == null)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
            }
            else
            {
                var result = await _commentService.GetAllCommentsAwaitingClarity(model.CanReplyUserID);
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comments List Created", result));
            }
        }

    }


}
