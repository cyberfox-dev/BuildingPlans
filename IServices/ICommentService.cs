using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ICommentService
    {
        Task<Comments> AddUpdateComment(int? commentID, string commentName, string? creadtedByID);
      
        public Task<bool> DeleteComment(int commentID);

        Task<List<CommentDTO>> GetCommentByApplicationID(int? applicationID);

    }
}
