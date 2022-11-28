using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IRolesService
    {

        //Task<Professionals> - This is the return type so its going to ruturn it in the fromt of the professinals model
        Task<Roles> AddUpdateRole(int? roleID, string roleName, string roleType, string roleDescription, string? creadtedByID);
        //this will return T/F 
        public Task<bool> DeleteRole(int roleID);

        Task<List<RolesDTO>> GetRoleByRoleID(int roleID);

        Task<List<RolesDTO>> GetAllRoles();
    }
}
