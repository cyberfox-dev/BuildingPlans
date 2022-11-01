using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IZonesServices
    {
        //Task<Zones> - This is the return type so its going to ruturn it in the fromt of the Zones model
         public Task<Zones> AddUpdateZones(int? ZoneID, string ZoneName, int DepartmentID, int SubDepartmentID);
        //this will return T/F 
         public Task<bool> DeleteZone(int ZoneID);

         public Task<List<ZonesDTO>> GetAllZones(int ZoneID);
    }
}
