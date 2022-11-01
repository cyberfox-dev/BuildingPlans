using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Service
{
    public class ZonesServices : IZonesServices
    {
        private readonly AppDBContext _context;

        public ZonesServices(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Zones> AddUpdateZones(int? ZoneID, string ZoneName, int DepartmentID, int SubDepartmentID)
        {
            if (ZoneID == 0)
            {
                ZoneID = null;
            }

            var tempZonesTable = _context.ZonesTable.FirstOrDefault(x => x.ZoneID == ZoneID);

            if (tempZonesTable == null)
            {
                tempZonesTable = new Zones()
                {
                    ZoneID = ZoneID,
                    ZoneName = ZoneName,

                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                };
                
                await _context.ZonesTable.AddAsync(tempZonesTable);
                await _context.SaveChangesAsync();

                return tempZonesTable;

            }
            else
            {
                tempZonesTable.ZoneName = ZoneName;
                tempZonesTable.DateUpdated = DateTime.Now;
                tempZonesTable.isActive = true;

                _context.Update(tempZonesTable);
                await _context.SaveChangesAsync();
                return tempZonesTable;
            }

        }

        public async Task<bool> DeleteZone(int zoneID)
        {
            var tempZonesTable = _context.ZonesTable.FirstOrDefault(x => x.ZoneID == zoneID);

            if (tempZonesTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempZonesTable.DateUpdated = DateTime.Now;
                tempZonesTable.isActive = false;
                _context.Update(tempZonesTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<ZonesDTO>> GetAllZones()
        {
            return await (
                from Zones in _context.ZonesTable
                //where Zones.ZoneID == ZoneID && Zones.isActive == true
                select new ZonesDTO()
                {
                    ZoneID = Zones.ZoneID,
                    ZoneName = Zones.ZoneName,
                    DepartmentID = Zones.DepartmentID,
                    SubDepartmentID = Zones.SubDepartmentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,

                }
                ).ToListAsync();
        }
    }
}
