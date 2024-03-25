using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface IConfigService
    {
        Task<Config> AddUpdateConfig(int? configID, string configName, string configDescription, string? utilitySlot1, string? utilitySlot2, string? utilitySlot3, string? creadtedByID);

        public Task<bool> DeleteConfig(int configID);

        Task<List<ConfigDTO>> GetConfigsByConfigID(int? configID);
        Task<List<ConfigDTO>> GetConfigsByConfigName(string? configName);

        Task<List<ConfigDTO>> GetConfigsByUserID(string? userID);

        Task<List<ConfigDTO>> GetAllConfigs();
    }
}
