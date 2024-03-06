using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IZXNumberService
    {
        Task<ZXNumberLog> AddUpdateZXNumber(int? zxNumberID, int? applicationID, int? departmentID, string? departmentName, string? zxNumber, string? creadtedByID);
        Task<List<ZXNumberDTO>> GetZXNumbersByApplicationID(int? applicationID);
        Task<List<ZXNumberDTO>> GetZXNumbersByDepartmentID(int? applicationID, int? departmentID);
    }
}
