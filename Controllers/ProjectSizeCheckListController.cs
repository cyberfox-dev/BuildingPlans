﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectSizeCheckListController : Controller
    {

        private readonly AppDBContext _context;

        public ProjectSizeCheckListController(AppDBContext context)
        {
            _context = context;
        }
        //[HttpPost("AddUpdateProjectSizeCheckList")]
        //public async Task<object> AddUpdatePermitSubForComment([FromBody] ProjectSizeCheckListBindingModel model)
        //{
        //    try
        //    {
        //        var result = new object();

        //        if (model == null)
        //        {
        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
        //        }
        //        else
        //        {
        //            if (model.ProjectSizeCheckListID == 0)
        //            {
        //                model.ProjectSizeCheckListID = null;
        //            }

        //            var tempPermitSubForComment = _context.PermitSubForComment.FirstOrDefault(x => x.PermitSubForCommentID == model.PermitSubForCommentID);


        //            if (tempPermitSubForComment == null)
        //            {
        //                tempPermitSubForComment = new PermitSubForComment()
        //                {

        //                   // PermitSubForCommentID = model.PermitSubForCommentID,
        //                    ApplicationID = model.ApplicationID,
        //                    SubDepartmentID = model.SubDepartmentID,
        //                    SubDepartmentName = model.SubDepartmentName,
        //                    DateCreated = DateTime.Now,
        //                    DateUpdated = DateTime.Now,
        //                    isActive = true,
        //                    UserAssaignedToComment = model.UserAssaignedToComment,
        //                    CreatedById = model.CreatedById,
        //                    PermitComment = model.PermitComment,
        //                    PermitCommentStatus = model.PermitCommentStatus,

        //                };

        //                await _context.PermitSubForComment.AddAsync(tempPermitSubForComment);
        //                await _context.SaveChangesAsync();

        //                result = tempPermitSubForComment;

        //            }
        //            else
        //            {
        //                if (model.ApplicationID != null)
        //                {
        //                    tempPermitSubForComment.ApplicationID = model.ApplicationID;
        //                }
        //                if (model.SubDepartmentID != null)
        //                {
        //                    tempPermitSubForComment.SubDepartmentID = model.SubDepartmentID;
        //                }
        //                if (model.SubDepartmentName != null)
        //                {
        //                    tempPermitSubForComment.SubDepartmentName = model.SubDepartmentName;
        //                }
        //                if (model.UserAssaignedToComment != null)
        //                {
        //                    tempPermitSubForComment.UserAssaignedToComment = model.UserAssaignedToComment;
        //                }
        //                if (model.CreatedById != null)
        //                {
        //                    tempPermitSubForComment.CreatedById = model.CreatedById;
        //                }
        //                if (model.PermitComment != null)
        //                {
        //                    tempPermitSubForComment.PermitComment = model.PermitComment;
        //                } 
        //                if (model.PermitCommentStatus != null)
        //                {
        //                    tempPermitSubForComment.PermitCommentStatus = model.PermitCommentStatus;
        //                }

        //                _context.Update(tempPermitSubForComment);
        //                await _context.SaveChangesAsync();
        //                result = tempPermitSubForComment;
        //            }

        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.PermitSubForCommentID > 0 ? "Updated Successfully" : "Created Successfully"), result));
        //        }
        //    }
        //    catch (Exception ex)
        //    {


        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

        //    }
        //}

        //[HttpPost("DeletePermitSubForCommentByID")]
        //public async Task<object> DeletePermitSubForCommentByID([FromBody] int permitSubForCommentID)
        //{
        //    try
        //    {

        //        var tempPermitSubForComment = _context.PermitSubForComment.FirstOrDefault(x => x.PermitSubForCommentID == permitSubForCommentID);

        //        if (tempPermitSubForComment == null)
        //        {
        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

        //        }
        //        else
        //        {
        //            tempPermitSubForComment.DateUpdated = DateTime.Now;
        //            tempPermitSubForComment.isActive = false;
        //            _context.Update(tempPermitSubForComment);
        //            await _context.SaveChangesAsync();
        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Deleted Successfully", true));
        //        }


        //    }
        //    catch (Exception ex)
        //    {


        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

        //    }
        //}

        [HttpGet("GetAllProjectSizeCheckList")]
        public async Task<object> GetAllProjectSizeCheckList()
        {
            try
            {
                var result = await (
                from projectSizeCheckList in _context.ProjectSizeCheckList
                where projectSizeCheckList.isActive == true
                select new ProjectSizeCheckListBindingModel()
                {
                    ProjectSizeCheckListID = projectSizeCheckList.ProjectSizeCheckListID,
                    ProjectSizeCheckListRowNumber = projectSizeCheckList.ProjectSizeCheckListRowNumber,
                    ProjectSizeCheckListActivity = projectSizeCheckList.ProjectSizeCheckListActivity,
                    MandatoryDocumentCategory = projectSizeCheckList.MandatoryDocumentCategory,
                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




    //    [HttpPost("GetPermitSubForCommentByApplicationID")]
    //    public async Task<object> GetPermitSubForCommentByApplicationID([FromBody] int applicationID)
    //    {
    //        try
    //        {
    //            var result = await (
    //            from permitSubForComment in _context.PermitSubForComment
    //            where permitSubForComment.ApplicationID == applicationID && permitSubForComment.isActive == true
    //            select new PermitSubForCommentDTO()
    //            {
    //                PermitSubForCommentID = permitSubForComment.PermitSubForCommentID,
    //                ApplicationID = permitSubForComment.ApplicationID,
    //                SubDepartmentID = permitSubForComment.SubDepartmentID,
    //                SubDepartmentName = permitSubForComment.SubDepartmentName,
    //                UserAssaignedToComment = permitSubForComment.UserAssaignedToComment,
    //                CreatedById = permitSubForComment.CreatedById,
    //                PermitComment = permitSubForComment.PermitComment,
    //                PermitCommentStatus = permitSubForComment.PermitCommentStatus,


    //            }
    //            ).ToListAsync();



    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All PermitSubForComment By ID", result));

    //        }
    //        catch (Exception ex)
    //        {


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //        }
    //    }

    //    [HttpPost("GetPermitSubForCommentBySubID")]
    //    public async Task<object> GetPermitSubForCommentBySubID([FromBody] PermitSubForCommentBindingModel model)
    //    {
    //        try
    //        {
    //            var result = await (
    //            from permitSubForComment in _context.PermitSubForComment
    //            where permitSubForComment.ApplicationID == model.ApplicationID && permitSubForComment.isActive == true && permitSubForComment.SubDepartmentID == model.SubDepartmentID
    //            select new PermitSubForCommentDTO()
    //            {
    //                PermitSubForCommentID = permitSubForComment.PermitSubForCommentID,
    //                ApplicationID = permitSubForComment.ApplicationID,
    //                SubDepartmentID = permitSubForComment.SubDepartmentID,
    //                SubDepartmentName = permitSubForComment.SubDepartmentName,
    //                UserAssaignedToComment = permitSubForComment.UserAssaignedToComment,
    //                CreatedById = permitSubForComment.CreatedById,
    //                PermitComment = permitSubForComment.PermitComment,
    //                PermitCommentStatus = permitSubForComment.PermitCommentStatus,


    //            }
    //            ).ToListAsync();



    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All PermitSubForComment By ID", result));

    //        }
    //        catch (Exception ex)
    //        {


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //        }
    //    }


    }


}