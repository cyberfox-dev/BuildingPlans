using System.Security.Policy;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ISubDepartmentForCommentService
    {
        Task<SubDepartmentForComment> AddUpdateDepartmentForComment(int? subDepartmentForCommentID, int? applicationID , int? subDepartmentID, string subDepartmentName, string? userAssaignedToComment, string? commentStatus, string? creadtedByID, int? zoneID, string zoneName);

        //JJS GISReviewer 04-03-24
        Task<bool> DepartmentForCommentUserAssaignedToComment(int? subDepartmentForCommentID, string? userAssaignedToComment,bool? isGISReviewing,string? GISReviewwerUserID);

        Task<bool> DepartmentForCommentFinalAppovalUserToComment(int? subDepartmentForCommentID, string? userAssaignedToComment);

        
        public Task<bool> DeleteDepartmentForComment(int SubDepartmentForCommentID);

        Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForComment(int applicationID);
        Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForCommentBySubID(int applicationID, int? subDepartmentID, string? userID);

        Task<bool> UpdateCommentStatus(int? subDepartmentForCommentID, string? commentStatus,bool? isAwaitingClarity, bool? isRefered, string? userAssaignedToComment, bool? finalApproval);

        Task<bool> ReferToComment(int? subDepartmentForCommentID, string? commentStatus, bool? isRefered, string? referedToUserID);

        Task<bool> UpdateCommentStatusToAwaitingClarity(int? subDepartmentForCommentID, string? commentStatus, bool? isAwaitingClarity);

        public Task<List<SubDepartmentForCommentDTO>> GetAssignedReviewer(int? ApplicationID, int? SubDepartmentID, int? ZoneID); //actionCentreEdits Sindiswa 16 January 2024

        Task<SubDepartmentForComment> AssignSeniorReviewerOrFinalApprover(int? subDepartmentForCommentID, string? userAssaignedToComment); //actionCentreEdits Sindiswa 16 January 2024


    }
}
