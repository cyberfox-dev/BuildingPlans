using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class ProfessionalsService : IProfessionalsService
    {
        private readonly AppDBContext _context;

        public ProfessionalsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Professionals> AddUpdateProfessional(int? professinalID, string professinalType, string fullName, string bp_Number, bool? bpVerified, string email, string phoneNumber, string professionalRegNo, string appUserID, string? idNumber, string createdById, string? cibRating)
        {

            if (professinalID == 0)
            {
                professinalID = null;
            }
            //this checks is the record exists in the db
            var tempProfessenalTable = _context.ProfessionalsTable.FirstOrDefault(x => x.ProfessinalID == professinalID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempProfessenalTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempProfessenalTable = new Professionals()
                {
                    ProfessinalType = professinalType,
                    FullName = fullName,
                    BP_Number = bp_Number,
                    BpVerified = bpVerified,
                    PhoneNumber = phoneNumber,
                    Email = email,
                    ProfessionalRegNo = professionalRegNo,
                    AppUserID = appUserID, // this is the fkey that is going to link the proffessional to the user creating the wayleave application
                    IdNumber = idNumber,
                    CIBRating = cibRating,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.ProfessionalsTable.AddAsync(tempProfessenalTable);
                await _context.SaveChangesAsync();

                return tempProfessenalTable;

            }
            else //if it is not null then user is doing an update 
            {


                tempProfessenalTable.PhoneNumber = phoneNumber;
                tempProfessenalTable.Email = email;
                tempProfessenalTable.DateUpdated = DateTime.Now;

                _context.Update(tempProfessenalTable);
                await _context.SaveChangesAsync();
                return tempProfessenalTable;
            }



        }

        public async Task<bool> DeleteProfessional(int professinalID)
        {
            //this checks is the record exists in the db
            var tempProfessenalTable = _context.ProfessionalsTable.FirstOrDefault(x => x.ProfessinalID == professinalID);

            if (tempProfessenalTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempProfessenalTable.DateUpdated = DateTime.Now;
                tempProfessenalTable.isActive = false;
                _context.Update(tempProfessenalTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<ProfessionalsDTO>> GetAllProfessionals(string userId)
        {
            return await (
                from professional in _context.ProfessionalsTable
                where professional.AppUserID == userId && professional.isActive == true
                select new ProfessionalsDTO()
                {
                    ProfessinalID = professional.ProfessinalID,
                    ProfessinalType = professional.ProfessinalType,
                    FullName = professional.FullName,
                    BP_Number = professional.BP_Number,
                    BpVerified = professional.BpVerified,
                    Email = professional.Email,
                    ProfessionalRegNo = professional.ProfessionalRegNo,
                    AppUserID = professional.AppUserID,
                    IdNumber = professional.IdNumber,
                    CIBRating = professional.CIBRating,
                    DateCreated = professional.DateCreated,
                    DateUpdated = professional.DateUpdated,
                    CreatedById = professional.CreatedById,
                    PhoneNumber = professional.PhoneNumber,

                }
                ).ToListAsync();
        }



        public async Task<List<ProfessionalsDTO>> GetProfessionalsListByProfessionalType(string userId, string professinalType)
        {
            return await (
                from professional in _context.ProfessionalsTable
                where professional.AppUserID == userId && professional.isActive == true && professional.ProfessinalType == professinalType
                select new ProfessionalsDTO()
                {
                    ProfessinalID = professional.ProfessinalID,
                    ProfessinalType = professional.ProfessinalType,
                    FullName = professional.FullName,
                    BP_Number = professional.BP_Number,
                    BpVerified = professional.BpVerified,
                    Email = professional.Email,
                    ProfessionalRegNo = professional.ProfessionalRegNo,
                    AppUserID = professional.AppUserID,
                    IdNumber = professional.IdNumber,
                    CIBRating = professional.CIBRating,
                    DateCreated = professional.DateCreated,
                    DateUpdated = professional.DateUpdated,
                    CreatedById = professional.CreatedById,
                    PhoneNumber = professional.PhoneNumber,

                }
                ).ToListAsync();
        }


        /*THIS IS FOR GETTING THE ENGINEERS AND CONTRACTORS BY APPLICATION ID*/

        public async Task<List<ProfessionalsDTO>> GetAllProfessionalsLinkByApplicationID(int? applicationID, string? professinalType)
        {
            return await (
                from professional in _context.ProfessionalsTable
                join ProfessionalsLinks in _context.ProfessionalsLink
                   on professional.ProfessinalID equals ProfessionalsLinks.ProfessionalID
                where professional.isActive == true && ProfessionalsLinks.ApplicationID == applicationID && professional.ProfessinalType == professinalType
                select new ProfessionalsDTO()
                {
                    ProfessinalID = professional.ProfessinalID,
                    ProfessinalType = professional.ProfessinalType,
                    FullName = professional.FullName,
                    BP_Number = professional.BP_Number,
                    BpVerified = professional.BpVerified,
                    Email = professional.Email,
                    ProfessionalRegNo = professional.ProfessionalRegNo,
                    AppUserID = professional.AppUserID,
                    IdNumber = professional.IdNumber,
                    CIBRating = professional.CIBRating,
                    DateCreated = professional.DateCreated,
                    DateUpdated = professional.DateUpdated,
                    CreatedById = professional.CreatedById,
                    PhoneNumber = professional.PhoneNumber,
                }
                ).ToListAsync();
        }

    }
}
