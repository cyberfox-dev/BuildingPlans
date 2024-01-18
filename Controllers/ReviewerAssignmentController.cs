using iText.StyledXmlParser.Jsoup.Nodes;
using Microsoft.AspNetCore.Mvc;
using System;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Data.Migrations;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewerAssignmentController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ReviewerAssignmentController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateReviewerForComment")]
        public async Task<object> AddUpdateReviewerForComment([FromBody] ReviewerAssignmentBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null || model.ReviewerAssignedToComment == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.ReviewerForCommentID == 0)
                    {
                        model.ReviewerForCommentID = 0;
                    }
                    var tempReviewerForComment = _context.ReviewerForComment.FirstOrDefault(x => x.ReviewerForCommentID == model.ReviewerForCommentID);
                    if (tempReviewerForComment == null)
                    {
                        tempReviewerForComment = new ReviewerAssignment()
                        {
                            //ReviewerForCommentID = model.ReviewerForCommentID,
                            ApplicationID = model.ApplicationID,
                            ReviewerAssignedToComment = model.ReviewerAssignedToComment,
                            CommentStatus = model.CommentStatus,
                            Comment = model.Comment,
                            SubDepartmentID = model.SubDepartmentID,
                            SubDepartmentName = model.SubDepartmentName,
                            ZoneID = model.ZoneID,
                            ZoneName = model.ZoneName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };
                        await _context.ReviewerForComment.AddAsync(tempReviewerForComment);
                        await _context.SaveChangesAsync();
                        result = tempReviewerForComment;
                    }
                    else
                    {
                        tempReviewerForComment.ReviewerForCommentID = model.ReviewerForCommentID;
                        tempReviewerForComment.ApplicationID = model.ApplicationID;
                        tempReviewerForComment.ReviewerAssignedToComment = model.ReviewerAssignedToComment;
                        tempReviewerForComment.CommentStatus = model.CommentStatus;
                        tempReviewerForComment.Comment = model.Comment;
                        tempReviewerForComment.SubDepartmentID = model.SubDepartmentID;
                        tempReviewerForComment.SubDepartmentName = model.SubDepartmentName;
                        tempReviewerForComment.ZoneID = model.ZoneID;
                        tempReviewerForComment.ZoneName = model.ZoneName;
                        tempReviewerForComment.CreatedById = model.CreatedById;
                        tempReviewerForComment.DateUpdated = DateTime.Now;

                        _context.Update(tempReviewerForComment);
                        await _context.SaveChangesAsync();
                        result = tempReviewerForComment;
                    }
                }

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ReviewerForCommentID > 0 ? "Reviewer for Comment Updated Successfully" : "Reviewer for Comment Created Successfully"), result));
            }
            catch (Exception ex)
            {

                // Log the exception details, including inner exception
                Console.WriteLine($"Exception: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}