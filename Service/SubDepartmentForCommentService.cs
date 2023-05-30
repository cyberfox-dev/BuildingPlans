using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Service
{
    public class SubDepartmentForCommentService : ISubDepartmentForCommentService
    {
        private readonly AppDBContext _context;

        public SubDepartmentForCommentService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<SubDepartmentForComment> AddUpdateDepartmentForComment(int? subDepartmentForCommentID, int? applicationID, int? subDepartmentID, string subDepartmentName, string? userAssaignedToComment, string? commentStatus, string? creadtedByID)
        {

            if (subDepartmentForCommentID == 0)
            {
                subDepartmentForCommentID = null;
            }
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);


            if (tempSubDepForCommentTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempSubDepForCommentTable = new SubDepartmentForComment()
                {
                    ApplicationID = applicationID,
                    SubDepartmentID = subDepartmentID,
                    SubDepartmentName = subDepartmentName,
                    UserAssaignedToComment = userAssaignedToComment,
                    CommentStatus = commentStatus,
                    isAwaitingClarity = false,
                    IsRefered = false,
                    ReferedToUserID = null,
                    CreatedById = creadtedByID,
                    DateCreated = DateTime.Now,
                    isActive = true
                };



                //After the inizlization add to the db
                await _context.SubDepartmentForComment.AddAsync(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return tempSubDepForCommentTable;
            }

            else
            {
                tempSubDepForCommentTable.ApplicationID = applicationID;
                tempSubDepForCommentTable.SubDepartmentID = subDepartmentID;
                tempSubDepForCommentTable.SubDepartmentName = subDepartmentName;
                tempSubDepForCommentTable.UserAssaignedToComment = null;
                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.isAwaitingClarity = false;
                tempSubDepForCommentTable.IsRefered = false;
                tempSubDepForCommentTable.ReferedToUserID = null;
                tempSubDepForCommentTable.CreatedById = creadtedByID;
                tempSubDepForCommentTable.DateCreated = DateTime.Now;
                tempSubDepForCommentTable.isActive = true;

                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return tempSubDepForCommentTable;
            }



        }




        public async Task<bool> DepartmentForCommentUserAssaignedToComment(int? subDepartmentForCommentID,  string? userAssaignedToComment)
        {

  
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable != null) { 
         
              
                tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;

                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }


        }

        public async Task<bool> DepartmentForCommentFinalAppovalUserToComment(int? subDepartmentForCommentID, string? userAssaignedToComment)
        {


            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable != null)
            {


                tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                tempSubDepForCommentTable.FinalApproval = true;

                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }


        }

        public async Task<bool> DeleteDepartmentForComment(int subDepartmentForCommentID)
        {
            //this checks if the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);
            }
            else
            {
                _context.SubDepartmentForComment.Remove(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForComment(int applicationID)
        {
            return await (
                from subDepartmentForComment in _context.SubDepartmentForComment
                where subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true
                select new SubDepartmentForCommentDTO()
                {
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    ApplicationID = subDepartmentForComment.ApplicationID,
                    SubDepartmentID = subDepartmentForComment.SubDepartmentID,
                    SubDepartmentName = subDepartmentForComment.SubDepartmentName,
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    CommentStatus = subDepartmentForComment.CommentStatus,
                    isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
                    IsRefered = subDepartmentForComment.IsRefered,
                    ReferedToUserID = subDepartmentForComment.ReferedToUserID,
                    CreatedById = subDepartmentForComment.CreatedById


                }
                ).ToListAsync();
        }

        public async Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForCommentBySubID(int applicationID, int? subDepartmentID)
        {
            return await (
                from subDepartmentForComment in _context.SubDepartmentForComment
                where subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true && subDepartmentForComment.SubDepartmentID == subDepartmentID
                select new SubDepartmentForCommentDTO()
                {
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    ApplicationID = subDepartmentForComment.ApplicationID,
                    SubDepartmentID = subDepartmentForComment.SubDepartmentID,
                    SubDepartmentName = subDepartmentForComment.SubDepartmentName,
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    CommentStatus = subDepartmentForComment.CommentStatus,
                    isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
                    IsRefered = subDepartmentForComment.IsRefered,
                    ReferedToUserID = subDepartmentForComment.ReferedToUserID,
                    CreatedById = subDepartmentForComment.CreatedById


                }
                ).ToListAsync();
        }




        public async Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForCommentNotLinked(int applicationID)
        {
            return await (
                from subDepartmentForComment in _context.SubDepartmentForComment
                where subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true
                select new SubDepartmentForCommentDTO()
                {
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    ApplicationID = subDepartmentForComment.ApplicationID,
                    SubDepartmentID = subDepartmentForComment.SubDepartmentID,
                    SubDepartmentName = subDepartmentForComment.SubDepartmentName,
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    CommentStatus = subDepartmentForComment.CommentStatus,
                    isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
                    IsRefered = subDepartmentForComment.IsRefered,
                    ReferedToUserID = subDepartmentForComment.ReferedToUserID,
                    CreatedById = subDepartmentForComment.CreatedById


                }
                ).ToListAsync();
        }

        public async Task<bool> UpdateCommentStatus(int? subDepartmentForCommentID, string? commentStatus,bool? isAwaitingClarity,bool? isRefered, string? userAssaignedToComment, bool? finalApproval)
        {
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null) 
            {
                return await Task.FromResult(false);

            }
            else
            {
                    
                if (isAwaitingClarity != null)
                {
                    tempSubDepForCommentTable.isAwaitingClarity = isAwaitingClarity;
                }
                if (isRefered != null)
                {
                    tempSubDepForCommentTable.IsRefered = isRefered;
                }
                if (userAssaignedToComment != null)
                {
                    tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                }
                if (userAssaignedToComment != null)
                {
                    tempSubDepForCommentTable.FinalApproval = finalApproval;
                }


                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }

        public async Task<bool> ReferToComment(int? subDepartmentForCommentID, string? commentStatus, bool? isRefered, string? referedToUserID)
        {
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.IsRefered = isRefered;
                tempSubDepForCommentTable.ReferedToUserID = referedToUserID;
               tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
           


        }

        public async Task<bool> UpdateCommentStatusToAwaitingClarity(int? subDepartmentForCommentID, string? commentStatus, bool? isAwaitingClarity)
        {
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.isAwaitingClarity = isAwaitingClarity;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }



        }


    }
 }
