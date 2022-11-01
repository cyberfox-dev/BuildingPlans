using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IDepartmentsService
    {
        //Task<Departments> - This is the return type so its going to ruturn it in the fromt of the departments model
        Task<Departments> AddUpdateDepartments(int? DepartmentID, string DepartmentName);
        //this will return T/F 
        public Task<bool> DeleteDepartments(int DepartmentID);
        
        Task<List<DepartmentsDTO>> GetAllDepartments();
        
    }
}
