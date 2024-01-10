using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface ISubDepartmentService
    {
        //Task<Departments> - This is the return type so its going to ruturn it in the fromt of the departments model
        Task<SubDepartments> AddUpdateSubDepartments(int? SubDepartmentID, string? SubDepartmentNamem, int? DepartmentID,string? createdByID, string? ProfitCenter, string? GlCode , int? PermitExpiration, int? WayleaveExpiration );
        Task<SubDepartments> AddSubDepartmentAdmin(int? subDepartmentID, string? departmentAdminUserID);
        //this will return T/F 
        public Task<bool> DeleteSubDepartments(int SubDepartmentID);

        Task<List<SubDepartmentsDTO>> GetAllSubDepartments();


        Task<List<SubDepartmentsDTO>> GetAllNotLinkedSubDepartmentsForComment(int applicationID);
        Task<List<SubDepartmentsDTO>> GetAllLinkedSubDepartmentsForComment(int applicationID);

        

        

        Task<List<SubDepartmentsDTO>> GetAllSubDepartmentsBydepartmentID(int departmentID);
        Task<List<SubDepartmentsDTO>> GetSubDepartmentBySubDepartmentID(int? subDepID );
        Task<List<SubDepartmentsDTO>> GetAllSubDepartmentsForAutoDistribution();

       


    }
}