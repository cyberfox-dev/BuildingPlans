using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ICommentService
    {
        Task<Comments> AddUpdateComment(int? commentID,int? applicationID,int? subDepartmentForCommentID, int? subDepartmentID, string? subDepartmentName, string commentName, string? commentStatus, string? creadtedByID);
      
        public Task<bool> DeleteComment(int commentID);

        Task<List<CommentDTO>> GetCommentByApplicationID(int? applicationID);
        Task<List<CommentDTO>> GetSubDepByCommentStatus(string? commentStatus, int? applicationID);

    }
}
