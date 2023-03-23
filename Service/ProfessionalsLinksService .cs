using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System.Net.NetworkInformation;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Data.Migrations;

namespace WayleaveManagementSystem.Service
{
    public class ProfessionalsLinksService : IProfessionalsLinksService
    {
        private readonly AppDBContext _context;

        public ProfessionalsLinksService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Data.Entities.ProfessionalsLinks> AddUpdateProfessionalsLink(int? professionalsLinkID, int? applicationID, int? professionalID, string createdById)
        {

            if (professionalsLinkID == 0)
            {
                professionalsLinkID = null;
            }
            //this checks is the record exists in the db
            var tempProfessionalsLinkTable = _context.ProfessionalsLink.FirstOrDefault(x => x.ProfessionalsLinkID == professionalsLinkID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempProfessionalsLinkTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempProfessionalsLinkTable = new Data.Entities.ProfessionalsLinks()
                {

                    ApplicationID = applicationID,
                    ProfessionalID = professionalID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,
                };

                //After the inizlization add to the db
                await _context.ProfessionalsLink.AddAsync(tempProfessionalsLinkTable);
                await _context.SaveChangesAsync();

                return tempProfessionalsLinkTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempProfessionalsLinkTable.ApplicationID = applicationID;
                tempProfessionalsLinkTable.ProfessionalID = professionalID;
                tempProfessionalsLinkTable.DateUpdated = DateTime.Now;
                tempProfessionalsLinkTable.isActive = true;

                _context.Update(tempProfessionalsLinkTable);
                await _context.SaveChangesAsync();
                return tempProfessionalsLinkTable;
            }
        }

        public async Task<bool> DeleteProfessionalsLink(int professionalsLinkID)
        {
            //this checks is the record exists in the db
            var tempProfessionalsLinkTable = _context.ProfessionalsLink.FirstOrDefault(x => x.ProfessionalsLinkID == professionalsLinkID);

            if (tempProfessionalsLinkTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempProfessionalsLinkTable.DateUpdated = DateTime.Now;
                tempProfessionalsLinkTable.isActive = false;
                _context.Update(tempProfessionalsLinkTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }


        //this method gets all the applications linked to a partcular user
        //We use DTO (a cutom list) because we may pull custom data from the database at some point, otherwise, we can just use the existing list.
        public async Task<List<ProfessionalsLinksDTO>> GetAllProfessionalsLink(string userId)
        {
            return await (
                from ProfessionalsLinks in _context.ProfessionalsLink
                where ProfessionalsLinks.CreatedById == userId && ProfessionalsLinks.isActive == true
                select new ProfessionalsLinksDTO()
                {
                    ProfessionalsLinkID = ProfessionalsLinks.ApplicationID,
                    ApplicationID = ProfessionalsLinks.ApplicationID,
                    ProfessionalID = ProfessionalsLinks.ProfessionalID,
                    DateCreated = ProfessionalsLinks.DateCreated,
                    DateUpdated = ProfessionalsLinks.DateUpdated,
                    CreatedById = ProfessionalsLinks.CreatedById,
                    isActive = ProfessionalsLinks.isActive
                }
                ).ToListAsync();
        }


        
    }
}
