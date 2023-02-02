using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ISubDepartmentForCommentService
    {
        Task<SubDepartmentForComment> AddUpdateDepartmentForComment(int? subDepartmentForCommentID, int? applicationID , int? subDepartmentID, string subDepartmentName, string? userAssaignedToComment, string? commentStatus, string? creadtedByID);
      
        public Task<bool> DeleteDepartmentForComment(int SubDepartmentForCommentID);

        Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForComment(int applicationID);

        Task<bool> UpdateCommentStatus(int? subDepartmentForCommentID, string? commentStatus);

        Task<bool> ReferToComment(int? subDepartmentForCommentID, string? commentStatus, bool? isRefered, string? referedToUserID);

        Task<bool> UpdateCommentStatusToAwaitingClarity(int? subDepartmentForCommentID, string? commentStatus, bool? isAwaitingClarity);


    }
}
