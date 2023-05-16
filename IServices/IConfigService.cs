using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IConfigService
    {
        Task<Config> AddUpdateConfig(int? configID, string configName, string configDescription, string? creadtedByID);
      
        public Task<bool> DeleteConfig(int configID);

        Task<List<ConfigDTO>> GetConfigsByUserID(string? userID);

       
    }
}
