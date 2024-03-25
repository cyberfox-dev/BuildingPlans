using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.BindingModel.ForGetByIDModels;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CommentBuilderController : ControllerBase
    {
        private readonly ICommentBuilderService _commentBuilderService;



        public CommentBuilderController(ICommentBuilderService commentBuilderService)
        {
            _commentBuilderService = commentBuilderService;

        }

        [HttpPost("AddUpdateComment")]
        public async Task<object> AddUpdateComment([FromBody] CommentBuilderBindingModel model)
        {
            try
            {

                if (model == null || model.CommentName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentBuilderService.AddUpdateComment(model.CommentID, model.CommentName, model.CreatedById);
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
                    var result = await _commentBuilderService.DeleteComment(commentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Comment Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetCommentByUserID")]
        public async Task<object> GetCommentByUserID([FromBody] ZoneLinkByUserIDBindingModel model)
        {
            try
            {

                if (model.UserID.Length < 3)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _commentBuilderService.GetCommentByUserID(model.UserID);
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
