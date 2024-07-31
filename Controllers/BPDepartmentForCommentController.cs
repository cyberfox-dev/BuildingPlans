using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.BindingModel.ForGetByIDModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace BuildingPlans.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BPDepartmentForCommentController : ControllerBase
    {
        private readonly AppDBContext _context;



        public BPDepartmentForCommentController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateDepartmentForComment")]
        public async Task<object> AddUpdateDepartmentForComment([FromBody] BPDepartmentForCommentBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.BPDepartmentForCommentID == 0)
                    {
                        model.BPDepartmentForCommentID = null;
                    }
                    //this checks is the record exists in the db
                    var tempBPDepartmentForCommentTable = _context.BPDepartmentForComment.FirstOrDefault(x => x.BPDepartmentForCommentID == model.BPDepartmentForCommentID);


                    if (tempBPDepartmentForCommentTable == null)
                    {
                        //create a new object of professional entity class then initialize the object with given infomation
                        tempBPDepartmentForCommentTable = new BPDepartmentForComment()
                        {
                            ApplicationID = model.ApplicationID,
                            DepartmentID = model.DepartmentID,
                            DepartmentName = model.DepartmentName,
                            UserAssaignedToComment = model.UserAssaignedToComment,
                            CommentStatus = model.CommentStatus,
                            isAwaitingClarity = false,
                            CreatedById = model.CreatedByID,
                            DateCreated = DateTime.Now,
                            isActive = true,
                        };



                        //After the inizlization add to the db
                        await _context.BPDepartmentForComment.AddAsync(tempBPDepartmentForCommentTable);
                        await _context.SaveChangesAsync();
                        return tempBPDepartmentForCommentTable;
                    }

                    else
                    {
                        if (model.ApplicationID != null)
                        {
                            tempBPDepartmentForCommentTable.ApplicationID = model.ApplicationID;
                        }
                        if (model.DepartmentID != null)
                        {
                            tempBPDepartmentForCommentTable.DepartmentID = model.DepartmentID;
                        }
                        if (model.DepartmentName != null)
                        {
                            tempBPDepartmentForCommentTable.DepartmentName = model.DepartmentName;
                        }
                        if (model.UserAssaignedToComment != null)
                        {
                            tempBPDepartmentForCommentTable.UserAssaignedToComment = model.UserAssaignedToComment;
                        }
                       

                        tempBPDepartmentForCommentTable.isAwaitingClarity = false;


                        tempBPDepartmentForCommentTable.DateCreated = DateTime.Now;
                        tempBPDepartmentForCommentTable.isActive = true;

                        _context.Update(tempBPDepartmentForCommentTable);
                        await _context.SaveChangesAsync();
                      
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.BPDepartmentForCommentID > 0 ? "Application in DepartmentForComments Table Updated Successfully" : "Application in DepartmentForComments Table"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

/*        [HttpPost("DepartmentForCommentUserAssaignedToComment")]
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
                    var result = await _subDepartmentForCommentService.DepartmentForCommentUserAssaignedToComment(model.SubDepartmentForCommentID, model.UserAssaignedToComment, model.isGISReviewing, model.GISReviewerUserID);
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
                    var result = await _subDepartmentForCommentService.DepartmentForCommentUserAssaignedToComment(model.SubDepartmentForCommentID, model.UserAssaignedToComment, model.isGISReviewing, model.GISReviewerUserID);
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
        }*/

        [HttpPost("GetDepartmentForComment")]
        public async Task<object> GetDepartmentForComment([FromBody] GetByApplicationID model)
        {
            try
            {


                var result = await (
                 from BPDepartmentForComment in _context.BPDepartmentForComment
                 where BPDepartmentForComment.ApplicationID == model.ApplicationID && BPDepartmentForComment.isActive == true
                 select new BPDepartmentForCommentDTO()
                 {
                     BPDepartmentForCommentID = BPDepartmentForComment.BPDepartmentForCommentID,
                     ApplicationID = BPDepartmentForComment.ApplicationID,
                     DepartmentID = BPDepartmentForComment.DepartmentID,
                     DepartmentName = BPDepartmentForComment.DepartmentName,
                     UserAssaignedToComment = BPDepartmentForComment.UserAssaignedToComment,
                     CommentStatus = BPDepartmentForComment.CommentStatus,
                     isAwaitingClarity = BPDepartmentForComment.isAwaitingClarity,
                     CreatedByID = BPDepartmentForComment.CreatedById,
                     isFinalApproved = BPDepartmentForComment.isFinalApproved,
                 }
                 ).ToListAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department For Comment List Created", result));
                

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("GetDepartmentForCommentByDepID")]
        public async Task<object> GetDepartmentForCommentByDepID([FromBody] BPDepartmentForCommentBindingModel model)
        {
            try
            {

                    var result = await (
                   from BPDepartmentForComment in _context.BPDepartmentForComment
                   where BPDepartmentForComment.ApplicationID == model.ApplicationID && BPDepartmentForComment.isActive == true && BPDepartmentForComment.DepartmentID == model.DepartmentID
                   select new BPDepartmentForCommentDTO()
                   {
                       BPDepartmentForCommentID = BPDepartmentForComment.BPDepartmentForCommentID,
                       ApplicationID = BPDepartmentForComment.ApplicationID,
                       DepartmentID = BPDepartmentForComment.DepartmentID,
                       DepartmentName = BPDepartmentForComment.DepartmentName,
                       UserAssaignedToComment = BPDepartmentForComment.UserAssaignedToComment,
                       CommentStatus = BPDepartmentForComment.CommentStatus,
                       isAwaitingClarity = BPDepartmentForComment.isAwaitingClarity,
                       CreatedByID = BPDepartmentForComment.CreatedById,
                       isFinalApproved = BPDepartmentForComment.isFinalApproved,
                       

                   }
                   ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Departments For Application By ID", result));
            
            }

            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


         [HttpPost("UpdateCommentStatus")]
 public async Task<object> UpdateCommentStatus([FromBody] BPDepartmentForCommentBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.BPDepartmentForCommentID == 0)
                    {
                        model.BPDepartmentForCommentID = null;
                    }
                    //this checks is the record exists in the db
                    var tempBPDepartmentForCommentTable = _context.BPDepartmentForComment.FirstOrDefault(x => x.BPDepartmentForCommentID == model.BPDepartmentForCommentID);


                    if (tempBPDepartmentForCommentTable == null)
                    {
                        return await Task.FromResult(false);
                    }
                    else
                    {
                        if (model.isAwaitingClarity != null)
                        {
                            tempBPDepartmentForCommentTable.isAwaitingClarity = model.isAwaitingClarity;
                        }
                        if (model.UserAssaignedToComment != null)
                        {
                            tempBPDepartmentForCommentTable.UserAssaignedToComment = model.UserAssaignedToComment;
                        }
                        if (model.isFinalApproved != null)
                        {
                            tempBPDepartmentForCommentTable.isFinalApproved = model.isFinalApproved;
                        }


                        tempBPDepartmentForCommentTable.CommentStatus = model.CommentStatus;
                        tempBPDepartmentForCommentTable.DateUpdated = DateTime.Now;
                        tempBPDepartmentForCommentTable.isActive = true;
                        _context.Update(tempBPDepartmentForCommentTable);
                        await _context.SaveChangesAsync();

                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.BPDepartmentForCommentID > 0 ? "Application in DepartmentForComments Table Updated Successfully" : "Application in DepartmentForComments Table"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        /* 
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



         //1. Need to create a way to check if a reviewer has been assigned

         [HttpPost("GetAssignedReviewer")]
         public async Task<object> GetAssignedReviewer([FromBody] SubDepartmentForCommentBindingModel model)
         {
             try
             {

                 if (model.ApplicationID < 1)
                 {
                     return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                 }
                 else
                 {
                     var result = await _subDepartmentForCommentService.GetAssignedReviewer(model.ApplicationID, model.SubDepartmentID, model.ZoneID);
                     return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department For Comment List Created for Specific Zone", result));
                 }

             }
             catch (Exception ex)
             {


                 return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

             }
         }

         [HttpPost("AssignSeniorReviewerOrFinalApprover")]
         public async Task<object> AssignSeniorReviewerOrFinalApprover([FromBody] SubDepartmentForCommentBindingModel model)
         {
             try
             {

                 if (model == null)
                 {
                     return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                 }
                 else
                 {
                     var result = await _subDepartmentForCommentService.AssignSeniorReviewerOrFinalApprover(model.SubDepartmentForCommentID, model.UserAssaignedToComment);
                     return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.SubDepartmentForCommentID > 0 ? "Department For Comment Updated Successfully" : "Department For Comment Added Successfully"), result));
                 }

             }
             catch (Exception ex)
             {


                 return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

             }
         }*/



    }

}
