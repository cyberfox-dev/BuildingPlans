using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface ICommentBuilderService
    {
        Task<CommentBuilder> AddUpdateComment(int? commentID, string commentName, string? creadtedByID);

        public Task<bool> DeleteComment(int commentID);

        Task<List<CommentBuilderDTO>> GetCommentByUserID(string? userID);


    }
}
