using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IZoneLinkServices
    {
        //Task<Zones> - This is the return type so its going to ruturn it in the fromt of the Zones model
        public Task<ZoneLink> AddUpdateZoneLink(int? zoneLinkID,int? zoneID ,int departmentID, int subDepartmentID, string? assignedUserID, string? userType, string? createdById);
        //this will return T/F 
        public Task<bool> DeleteZoneLink(int zoneID);

        public Task<List<ZoneLinkDTO>> GetAllZoneLinks();

        Task<List<UserZoneLinkDTO>> GetUsersNotLinkedByUserID();
       
    }
}
