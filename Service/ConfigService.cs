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

        public async Task<Config> AddUpdateConfig(int? configID, string configName,string configDescription, string? utilitySlot1, string? utilitySlot2, string? utilitySlot3, string? creadtedByID)
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
                    UtilitySlot1= utilitySlot1,
                    UtilitySlot2= utilitySlot2,
                    UtilitySlot3= utilitySlot3,

                    isActive = true
                };

                //After the inizlization add to the db
                await _context.Config.AddAsync(tempConfigTable);
                await _context.SaveChangesAsync();

                return tempConfigTable;

            }
            else //if it is not null then user is doing an update 
            {
                if (utilitySlot1 != null)
                {
                    tempConfigTable.UtilitySlot1 = utilitySlot1;
                }
                if (utilitySlot2 != null)
                {
                    tempConfigTable.UtilitySlot2 = utilitySlot2;
                }
                if (utilitySlot3 != null)
                {
                    tempConfigTable.UtilitySlot3 = utilitySlot3;
                }
                if (configName != null)
                {
                    tempConfigTable.ConfigName = configName;
                }
                if(configDescription != null)
                {
                    tempConfigTable.ConfigDescription = configDescription;
                }
               
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


        public async Task<List<ConfigDTO>> GetConfigsByConfigID(int? configID)
        {
            return await (
                from config in _context.Config
                where config.ConfigID == configID && config.isActive == true
                select new ConfigDTO()
                {
                    ConfigID = config.ConfigID,
                    ConfigName = config.ConfigName,
                    ConfigDescription = config.ConfigDescription,
                    DateCreated = config.DateCreated,
                    DateUpdated = config.DateUpdated,
                    CreatedById = config.CreatedById,
                    UtilitySlot1 = config.UtilitySlot1,
                    UtilitySlot2 = config.UtilitySlot2,
                    UtilitySlot3 = config.UtilitySlot3,



                }
                ).ToListAsync();
        }


        public async Task<List<ConfigDTO>> GetConfigsByConfigName(string? configName)
        {
            return await (
                from config in _context.Config
                where config.ConfigName == configName && config.isActive == true
                select new ConfigDTO()
                {
                    ConfigID = config.ConfigID,
                    ConfigName = config.ConfigName,
                    ConfigDescription = config.ConfigDescription,
                    DateCreated = config.DateCreated,
                    DateUpdated = config.DateUpdated,
                    CreatedById = config.CreatedById,
                    UtilitySlot1 = config.UtilitySlot1,
                    UtilitySlot2 = config.UtilitySlot2,
                    UtilitySlot3 = config.UtilitySlot3,

                }
                ).ToListAsync();
        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<ConfigDTO>> GetConfigsByUserID(string? userID)
        {
            return await(
                from config in _context.Config where config.CreatedById == userID && config.isActive == true
                select new ConfigDTO()
                {
                    ConfigID = config.ConfigID,
                    ConfigName = config.ConfigName,
                    ConfigDescription = config.ConfigDescription,
                    DateCreated = config.DateCreated,
                    DateUpdated = config.DateUpdated,
                    CreatedById = config.CreatedById,
                    UtilitySlot1 = config.UtilitySlot1,
                    UtilitySlot2 = config.UtilitySlot2,
                    UtilitySlot3 = config.UtilitySlot3,
                }
                ).ToListAsync();
        }


      


    }
}
