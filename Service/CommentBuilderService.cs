using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Service
{
    public class CommentBuilderService : ICommentBuilderService
    {
        private readonly AppDBContext _context;

        public CommentBuilderService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<CommentBuilder> AddUpdateComment(int? commentID, string commentName, string? creadtedByID)
        {

            if (commentID == 0)
            {
                commentID = null;
            }
            //this checks is the record exists in the db
            var tempCommentBuilderTable = _context.CommentBuilder.FirstOrDefault(x => x.CommentID == commentID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempCommentBuilderTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempCommentBuilderTable = new CommentBuilder()
                {
                    CommentName = commentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.CommentBuilder.AddAsync(tempCommentBuilderTable);
                await _context.SaveChangesAsync();

                return tempCommentBuilderTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempCommentBuilderTable.CommentName = commentName;

                tempCommentBuilderTable.DateUpdated = DateTime.Now;
                tempCommentBuilderTable.isActive = true;

                _context.Update(tempCommentBuilderTable);
                await _context.SaveChangesAsync();
                return tempCommentBuilderTable;
            }



        }

        public async Task<bool> DeleteComment(int commentID)
        {
            //this checks is the record exists in the db
            var tempCommentBuilderTable = _context.CommentBuilder.FirstOrDefault(x => x.CommentID == commentID);

            if (tempCommentBuilderTable == null)
            {
                return await Task.FromResult(false);
                
            }
            else
            {
                tempCommentBuilderTable.DateUpdated = DateTime.Now;
                tempCommentBuilderTable.isActive = false;
                _context.Update(tempCommentBuilderTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<CommentBuilderDTO>> GetCommentByUserID(string userID)
        {
            return await(
                from commentBuilder in _context.CommentBuilder where commentBuilder.CreatedById == userID && commentBuilder.isActive == true
                select new CommentBuilderDTO()
                {
                    CommentID = commentBuilder.CommentID,
                    CommentName = commentBuilder.CommentName,
                    DateCreated = commentBuilder.DateCreated,
                    DateUpdated = commentBuilder.DateUpdated,
                    CreatedById = commentBuilder.CreatedById,

                }
                ).ToListAsync();
        }

    }
}
