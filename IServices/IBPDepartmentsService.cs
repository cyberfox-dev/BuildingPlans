using BuildingPlans.Data.Entities;
using BuildingPlans.Models.DTO;

namespace BuildingPlans.IServices
{
    public interface IBPDepartmentsService
    {
        Task<BPDepartments> AddUpdateDepartments(int? DepartmentID, string DepartmentName, bool hasSubDepartment,string? functionalArea, string? createdById );
        public Task<bool> DeleteDepartments(int DepartmentID);
        Task<List<DepartmentsDTO>> GetDepartmentByDepartmentID(int DepartmentID);

        Task<List<DepartmentsDTO>>GetAllDepartments();
        Task<List<DepartmentsDTO>> GetAllDepartmentsForFunctionalArea(string functionalArea);

        Task<List<DepartmentsDTO>> GetDepartmentByDepartmentName(string departmentName ,string functionalArea);
        //The Wayleave and BuildingPlans app have the same entity, so I DIDN'T create a new Departments binding model and DTO
    }
}
