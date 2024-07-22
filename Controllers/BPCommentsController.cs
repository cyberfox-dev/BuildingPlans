using BuildingPlans.Data;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Data;
using BuildingPlans.Data.Entities;
namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPCommentsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPCommentsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateComment")]
        public async Task<object> AddUpdateComment([FromBody] CommentBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are miss", null));
                }
                else
                {
                    if (model.CommentID == 0)
                    {
                        model.CommentID = null;
                    }

                    var tempComment = _context.BPComments.FirstOrDefault(x => x.CommentID == model.CommentID);

                    if(tempComment == null)
                    {
                        tempComment = new BPComments()
                        {
                            ApplicationID = model.ApplicationID,
                            FunctionalArea = model.FunctionalArea,
                            Comment = model.Comment,
                            CommentStatus = model.CommentStatus,
                            SubDepartmentForCommentID = model.SubDepartmentForCommentID,
                            isApplicantReply = model.isApplicantReplay,
                            SecondReply = model.SecondReply,
                            UserName = model.UserName,
                            CanReplyUserID = model.CanReplyUserID,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };

                        await _context.BPComments.AddAsync(tempComment);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                         if(model.Comment != null)
                        {
                            tempComment.Comment = model.Comment;
                        }
                         if(model.CommentStatus != null)
                        {
                            tempComment.CommentStatus = model.CommentStatus;
                        }
                         if(model.isApplicantReplay != null)
                        {
                            tempComment.isApplicantReply = model.isApplicantReplay;
                        }
                         if(model.SecondReply != null)
                        {
                            tempComment.SecondReply = model.SecondReply;
                        }
                         tempComment.DateUpdated = DateTime.Now;
                        _context.Update(tempComment);
                        await _context.SaveChangesAsync();
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.CommentID> 0 ? "Comment Updated Successfully" : "Comment Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllCommentsForApplication")]
        public async Task<object> GetAllCommentsForApplication([FromBody] CommentBindingModel model)
        {
            try
            {
                var result = await (from comment in _context.BPComments
                                    where comment.ApplicationID == model.ApplicationID && comment.isActive == true
                                    select new CommentDTO()
                                    {
                                        CommentID = comment.CommentID,
                                        ApplicationID = comment.ApplicationID,
                                        FunctionalArea = comment.FunctionalArea,
                                        Comment = comment.Comment,
                                        CommentStatus = comment.CommentStatus,
                                        SubDepartmentForCommentID = comment.SubDepartmentForCommentID,
                                        isApplicantReplay = comment.isApplicantReply,
                                        SecondReply = comment.SecondReply,
                                        UserName = comment.UserName,
                                        CanReplyUserID = comment.CanReplyUserID,
                                        CreatedById = comment.CreatedById,
                                        DateCreated = comment.DateCreated,
                                        DateUpdated = comment.DateUpdated,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Comments For Application", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllCommentsForApplicationByFunctionalArea")]
        public async Task<object> GetAllCommentsForApplicationByFunctionalArea([FromBody] CommentBindingModel model)
        {
            try
            {
                var result = await (from comment in _context.BPComments
                                    where comment.ApplicationID == model.ApplicationID && comment.FunctionalArea == model.FunctionalArea && comment.isActive == true
                                    select new CommentDTO()
                                    {
                                        CommentID = comment.CommentID,
                                        ApplicationID = comment.ApplicationID,
                                        FunctionalArea = comment.FunctionalArea,
                                        Comment = comment.Comment,
                                        CommentStatus = comment.CommentStatus,
                                        SubDepartmentForCommentID = comment.SubDepartmentForCommentID,
                                        isApplicantReplay = comment.isApplicantReply,
                                        SecondReply = comment.SecondReply,
                                        UserName = comment.UserName,
                                        CanReplyUserID = comment.CanReplyUserID, 
                                        CreatedById = comment.CreatedById,
                                        DateCreated = comment.DateCreated,
                                        DateUpdated = comment.DateUpdated,

                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Comments For Application By FunctionalArea", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        
    }
}
