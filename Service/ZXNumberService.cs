using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.IServices;
using BuildingPlans.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class ZXNumberService : IZXNumberService
    {
        private readonly AppDBContext _context;
        public ZXNumberService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ZXNumberLog> AddUpdateZXNumber(int? zxNumberID, int? applicationID, int? departmentID, string? departmentName, string? zxNumber, string? creadtedByID)
        {
            if (zxNumberID == 0)
            {
                zxNumberID = null;
            }

            var tempZXNumberTable = _context.ZXNumberLog.FirstOrDefault(x => x.ZXNumberID == zxNumberID);
            if (tempZXNumberTable == null)
            {
                tempZXNumberTable = new ZXNumberLog()
                {
                    ApplicationID = applicationID,
                    DepartmentID = departmentID,
                    DepartmentName = departmentName,
                    ZXNumber = zxNumber,
                    CreatedById = creadtedByID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true,

                };
                await _context.ZXNumberLog.AddAsync(tempZXNumberTable);
                await _context.SaveChangesAsync();

                return tempZXNumberTable;
            }
            else
            {

                if (zxNumber != null)
                {
                    tempZXNumberTable.ZXNumber = zxNumber;
                }
                tempZXNumberTable.DateUpdated = DateTime.Now;
                return tempZXNumberTable;
            }
        }
        public async Task<List<ZXNumberDTO>> GetZXNumbersByApplicationID(int? applicationID)
        {

            return await (
               from ZXNum in _context.ZXNumberLog
               where ZXNum.ApplicationID == applicationID && ZXNum.isActive == true
               select new ZXNumberDTO()
               {
                   ZXNumberID = ZXNum.ZXNumberID,
                   ApplicationID = ZXNum.ApplicationID,
                   DepartmentID = ZXNum.DepartmentID,
                   DepartmentName = ZXNum.DepartmentName,
                   ZXNumber = ZXNum.ZXNumber,
                   DateCreated = ZXNum.DateCreated,
                   DateUpdated = ZXNum.DateUpdated,
                   CreatedById = ZXNum.CreatedById,
                   isActive = ZXNum.isActive,
               }
               ).ToListAsync();

        }

        public async Task<List<ZXNumberDTO>> GetZXNumbersByDepartmentID(int? applicationID, int? departmentID)
        {

            return await (
               from ZXNum in _context.ZXNumberLog
               where ZXNum.ApplicationID == applicationID && ZXNum.isActive == true && ZXNum.DepartmentID == departmentID
               select new ZXNumberDTO()
               {
                   ZXNumberID = ZXNum.ZXNumberID,
                   ApplicationID = ZXNum.ApplicationID,
                   DepartmentID = ZXNum.DepartmentID,
                   DepartmentName = ZXNum.DepartmentName,
                   ZXNumber = ZXNum.ZXNumber,
                   DateCreated = ZXNum.DateCreated,
                   DateUpdated = ZXNum.DateUpdated,
                   CreatedById = ZXNum.CreatedById,
                   isActive = ZXNum.isActive,
               }
               ).ToListAsync();
        }

    }
}
