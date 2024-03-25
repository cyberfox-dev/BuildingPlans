using BuildingPlans.Data.Entities;
using BuildingPlans.Models.DTO;

namespace BuildingPlans.IServices
{
    public interface IZonesServices
    {
        //Task<Zones> - This is the return type so its going to ruturn it in the fromt of the Zones model
        public Task<Zones> AddUpdateZones(int? ZoneID, string ZoneName, int DepartmentID, int SubDepartmentID, string? createdById);
        //this will return T/F 
        public Task<bool> DeleteZone(int ZoneID);

        public Task<List<ZonesDTO>> GetAllZones();

        Task<List<ZonesDTO>> GetZoneBySubDepartmentID(int subDepartmentID);
        Task<List<ZonesDTO>> GetZoneByZoneID(int zoneID);
        Task<List<ZonesDTO>> GetZoneByMapObjectID(int subDepartmentID, int mapObjectID);

    }
}
