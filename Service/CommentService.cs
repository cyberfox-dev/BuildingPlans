using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class CommentService : ICommentService
    {
        private readonly AppDBContext _context;

        public CommentService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Comments> AddUpdateComment(int? commentID, int? applicationID, int? subDepartmentForCommentID, int? subDepartmentID, string? subDepartmentName, string commentName, string? commentStatus, string? creadtedByID, int? isClarifyCommentID, string? isApplicantReplay, string? UserName, string? zoneName, string? canReplyUserID)
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
                    SubDepartmentID = subDepartmentID,
                    SubDepartmentName = subDepartmentName,
                    isActive = true,
                    isClarifyCommentID = isClarifyCommentID,
                    isApplicantReplay = isApplicantReplay,
                    UserName = UserName,
                    ZoneName = zoneName,
                    CanReplyUserID = canReplyUserID,
                };

                //After the inizlization add to the db
                await _context.Comments.AddAsync(tempCommentTable);
                await _context.SaveChangesAsync();

                return tempCommentTable;

            }
            else //if it is not null then user is doing an update 
            {

                if (commentName != null)
                {
                    tempCommentTable.Comment = commentName;
                }
                if (isClarifyCommentID != null)
                {
                    tempCommentTable.isClarifyCommentID = isClarifyCommentID;
                }
                if (isApplicantReplay != null)
                {
                    tempCommentTable.isApplicantReplay = isApplicantReplay;
                }
                if (commentStatus != null)
                {
                    tempCommentTable.CommentStatus = commentStatus;
                }


                tempCommentTable.DateUpdated = DateTime.Now;


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
            return await (
                from comment in _context.Comments
                where comment.ApplicationID == applicationID && comment.isActive == true
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
                    SubDepartmentID = comment.SubDepartmentID,
                    SubDepartmentName = comment.SubDepartmentName,
                    isClarifyCommentID = comment.isClarifyCommentID,
                    isApplicantReplay = comment.isApplicantReplay,
                    UserName = comment.UserName,
                    //Comments Kyle 01/02/24
                    ZoneName = comment.ZoneName,
                    //Comments Kyle 01/02/24
                    CanReplyUserID = comment.CanReplyUserID,//Clarifications Alerts Kyle 
                }
                ).ToListAsync();
        }

        public async Task<List<CommentDTO>> GetSubDepByCommentStatus(string? commentStatus, int? applicationID)
        {
            return await (
                from comment in _context.Comments
                where comment.ApplicationID == applicationID && comment.CommentStatus == commentStatus && comment.isActive == true
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
                    SubDepartmentID = comment.SubDepartmentID,
                    SubDepartmentName = comment.SubDepartmentName,
                    isClarifyCommentID = comment.isClarifyCommentID,
                    isApplicantReplay = comment.isApplicantReplay,
                    UserName = comment.UserName,
                }
                ).ToListAsync();
        }
        //JJS Approval Pack and rejection pack 25Jan2024
        public async Task<List<CommentDTO>> GetCommentsForSpecialConditions(int? applicationID)
        {
            return await (
            from comment in _context.Comments
            where comment.ApplicationID == applicationID && comment.CommentStatus == "Approved" || comment.ApplicationID == applicationID && comment.CommentStatus == "Final Approved" || comment.ApplicationID == applicationID && comment.CommentStatus == "Provisionally Approved"
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
                SubDepartmentID = comment.SubDepartmentID,
                SubDepartmentName = comment.SubDepartmentName,
                isClarifyCommentID = comment.isClarifyCommentID,
                isApplicantReplay = comment.isApplicantReplay,
                UserName = comment.UserName,
                ZoneName = comment.ZoneName,
                CanReplyUserID = comment.CanReplyUserID,//Clarifications Alerts Kyle 
            }
                ).ToListAsync();
        }
        //Clarify Alerts Kyle 
        public async Task<List<CommentDTO>> GetAllCommentsAwaitingClarity(string? canReplyUserID)
        {
            return await (
                from comment in _context.Comments
                where comment.CanReplyUserID == canReplyUserID && comment.isApplicantReplay == null && (comment.CommentStatus == "Reviewer Clarify" || comment.CommentStatus == "Clarify" || comment.CommentStatus == "Applicant Clarify") && comment.isActive == true
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
                    SubDepartmentID = comment.SubDepartmentID,
                    SubDepartmentName = comment.SubDepartmentName,
                    isClarifyCommentID = comment.isClarifyCommentID,
                    isApplicantReplay = comment.isApplicantReplay,
                    UserName = comment.UserName,
                    ZoneName = comment.ZoneName,
                    CanReplyUserID = comment.CanReplyUserID,//Clarifications Alerts Kyle 

                }).ToListAsync();
        }
        //Clarify Alerts Kyle 
    }
}
