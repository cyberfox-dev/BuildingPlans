using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface ICommentService
    {
        Task<Comments> AddUpdateComment(int? commentID, int? applicationID, int? subDepartmentForCommentID, int? subDepartmentID, string? subDepartmentName, string commentName, string? commentStatus, string? creadtedByID, int? isClarifyCommentID, string? isApplicantReplay, string? UserName, string? zoneName, string? clarifyUserID);

        public Task<bool> DeleteComment(int commentID);

        Task<List<CommentDTO>> GetCommentByApplicationID(int? applicationID);
        Task<List<CommentDTO>> GetSubDepByCommentStatus(string? commentStatus, int? applicationID);
        Task<List<CommentDTO>> GetCommentsForSpecialConditions(int? applicationID);
        //Clarify Alerts Kyle 
        Task<List<CommentDTO>> GetAllCommentsAwaitingClarity(string? canReplyUserID);
        //Clarify Alerts Kyle 
    }
}
