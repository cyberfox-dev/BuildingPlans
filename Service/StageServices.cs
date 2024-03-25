using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.IServices;
using BuildingPlans.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class StageServices : IStageServices
    {
        private readonly AppDBContext _context;

        public StageServices(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Stages> AddUpdateStages(int? stageID, string? stageName, int? stageOrderNumber, string? createdByID)
        {
            if (stageID == 0)
            {
                stageID = null;
            }

            var tempStageTable = _context.StageTable.FirstOrDefault(x => x.StageID == stageID);

            if (tempStageTable == null)
            {
                tempStageTable = new Stages()
                {
                    StageID = stageID,
                    StageName = stageName,
                    StageOrderNumber = stageOrderNumber,
                    CreatedById = createdByID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                };

                await _context.StageTable.AddAsync(tempStageTable);
                await _context.SaveChangesAsync();

                return tempStageTable;

            }
            else
            {
                tempStageTable.StageName = stageName;
                tempStageTable.DateUpdated = DateTime.Now;
                tempStageTable.StageOrderNumber = stageOrderNumber;
                tempStageTable.isActive = true;

                _context.Update(tempStageTable);
                await _context.SaveChangesAsync();
                return tempStageTable;
            }
        }

        public async Task<bool> DeleteStage(int stageID)
        {
            var tempStageTable = _context.StageTable.FirstOrDefault(x => x.StageID == stageID);

            if (tempStageTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempStageTable.DateUpdated = DateTime.Now;
                tempStageTable.isActive = false;
                tempStageTable.StageOrderNumber = null;
                _context.Update(tempStageTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<StageDTO>> GetAllStages()
        {
            return await (
                from Stages in _context.StageTable
                where Stages.isActive == true
                select new StageDTO()
                {
                    StageID = Stages.StageID,
                    StageName = Stages.StageName,
                    StageOrderNumber = Stages.StageOrderNumber,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,

                }
                ).OrderBy(x => x.StageOrderNumber).ToListAsync();
        }
    }
}
