using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Service
{
    public class ConfigService : IConfigService
    {
        private readonly AppDBContext _context;

        public ConfigService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Config> AddUpdateConfig(int? configID, string configName,string configDescription, string? creadtedByID)
        {

            if (configID == 0)
            {
                configID = null;
            }
            //this checks is the record exists in the db
            var tempConfigTable = _context.Config.FirstOrDefault(x => x.ConfigID == configID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempConfigTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempConfigTable = new Config()
                {
                    ConfigName = configName,
                    ConfigDescription = configDescription,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.Config.AddAsync(tempConfigTable);
                await _context.SaveChangesAsync();

                return tempConfigTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempConfigTable.ConfigName = configName;

                tempConfigTable.DateUpdated = DateTime.Now;
                tempConfigTable.isActive = true;

                _context.Update(tempConfigTable);
                await _context.SaveChangesAsync();
                return tempConfigTable;
            }



        }

        public async Task<bool> DeleteConfig(int configID)
        {
            //this checks is the record exists in the db
            var tempConfigTable = _context.Config.FirstOrDefault(x => x.ConfigID == configID);

            if (tempConfigTable == null)
            {
                return await Task.FromResult(false);
                
            }
            else
            {
                tempConfigTable.DateUpdated = DateTime.Now;
                tempConfigTable.isActive = false;
                _context.Update(tempConfigTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<ConfigDTO>> GetConfigsByUserID(string userID)
        {
            return await(
                from config in _context.Config where config.CreatedById == userID && config.isActive == true
                select new ConfigDTO()
                {
                    ConfigID = config.ConfigID,
                    ConfigName = config.ConfigName,
                    DateCreated = config.DateCreated,
                    DateUpdated = config.DateUpdated,
                    CreatedById = config.CreatedById,

                }
                ).ToListAsync();
        }

    }
}
