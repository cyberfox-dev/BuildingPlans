using System.Security.Policy;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ISubDepartmentForCommentService
    {
        Task<SubDepartmentForComment> AddUpdateDepartmentForComment(int? subDepartmentForCommentID, int? applicationID , int? subDepartmentID, string subDepartmentName, string? userAssaignedToComment, string? commentStatus, string? creadtedByID, int? zoneID, string zoneName);
        Task<bool> DepartmentForCommentUserAssaignedToComment(int? subDepartmentForCommentID, string? userAssaignedToComment);

        Task<bool> DepartmentForCommentFinalAppovalUserToComment(int? subDepartmentForCommentID, string? userAssaignedToComment);

        
        public Task<bool> DeleteDepartmentForComment(int SubDepartmentForCommentID);

        Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForComment(int applicationID);
        Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForCommentBySubID(int applicationID, int? subDepartmentID, string? userID);

        Task<bool> UpdateCommentStatus(int? subDepartmentForCommentID, string? commentStatus,bool? isAwaitingClarity, bool? isRefered, string? userAssaignedToComment, bool? finalApproval);

        Task<bool> ReferToComment(int? subDepartmentForCommentID, string? commentStatus, bool? isRefered, string? referedToUserID);

        Task<bool> UpdateCommentStatusToAwaitingClarity(int? subDepartmentForCommentID, string? commentStatus, bool? isAwaitingClarity);


    }
}
