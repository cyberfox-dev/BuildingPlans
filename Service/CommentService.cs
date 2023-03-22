using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System;
using WayleaveManagementSystem.Data.Migrations;

namespace WayleaveManagementSystem.Service
{
    public class CommentService : ICommentService
    {
        private readonly AppDBContext _context;

        public CommentService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Comments> AddUpdateComment(int? commentID, int? applicationID, int? subDepartmentForCommentID, string commentName,string? commentStatus ,string? creadtedByID)
        {

            if (commentID == 0)
            {
                commentID = null;
            }
            //this checks is the record exists in the db
            var tempCommentTable = _context.Comments.FirstOrDefault(x => x.CommentID == commentID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempCommentTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempCommentTable = new Comments()
                {
                    Comment = commentName,
                    ApplicationID = applicationID,
                    SubDepartmentForCommentID = subDepartmentForCommentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    CommentStatus = commentStatus,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.Comments.AddAsync(tempCommentTable);
                await _context.SaveChangesAsync();

                return tempCommentTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempCommentTable.Comment = commentName;

                tempCommentTable.DateUpdated = DateTime.Now;
                tempCommentTable.isActive = true;

                _context.Update(tempCommentTable);
                await _context.SaveChangesAsync();
                return tempCommentTable;
            }



        }

        public async Task<bool> DeleteComment(int commentID)
        {
            //this checks is the record exists in the db
            var tempCommentTable = _context.Comments.FirstOrDefault(x => x.CommentID == commentID);

            if (tempCommentTable == null)
            {
                return await Task.FromResult(false);
                
            }
            else
            {
                tempCommentTable.DateUpdated = DateTime.Now;
                tempCommentTable.isActive = false;
                _context.Update(tempCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<CommentDTO>> GetCommentByApplicationID(int? applicationID)
        {
            return await(
                from comment in _context.Comments where comment.ApplicationID == applicationID && comment.isActive == true
                select new CommentDTO()
                {
                    CommentID = comment.CommentID,
                    Comment = comment.Comment,
                    ApplicationID = comment.ApplicationID,
                    SubDepartmentForCommentID = comment.SubDepartmentForCommentID,
                    CommentStatus = comment.CommentStatus,
                    DateCreated = comment.DateCreated,
                    DateUpdated = comment.DateUpdated,
                    CreatedById = comment.CreatedById,

                }
                ).ToListAsync();
        }

    }
}
