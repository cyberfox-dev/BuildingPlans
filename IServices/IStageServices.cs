using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IStageServices
    {
        //Task<Stage> - This is the return type so its going to ruturn it in the front of the Stage model
        public Task<Stages> AddUpdateStages(int? StageID, string? StageName, int? StageOrderNumber, string? createdByID);
        //this will return T/F 
        public Task<bool> DeleteStage(int StageID);

         Task<List<StageDTO>> GetAllStages();
    }
}
