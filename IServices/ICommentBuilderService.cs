using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ICommentBuilderService
    {
        Task<CommentBuilder> AddUpdateComment(int? commentID, string commentName, string? creadtedByID);
      
        public Task<bool> DeleteComment(int commentID);

        Task<List<CommentBuilderDTO>> GetCommentByUserID(string? userID);

       
    }
}
