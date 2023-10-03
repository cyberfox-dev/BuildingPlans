using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IZoneLinkServices
    {
        //Task<Zones> - This is the return type so its going to ruturn it in the fromt of the Zones model
        public Task<ZoneLink> AddUpdateZoneLink(int? zoneLinkID, int? zoneID, string? zoneName, int? departmentID, int? subDepartmentID, string? subDepartmentName, string? assignedUserID, string? userType, string? createdById, bool? isDepartmentAdmin, bool? isZoneAdmin);
        //this will return T/F 
        public Task<bool> DeleteZoneLink(int zoneID);

        public Task<List<ZoneLinkDTO>> GetAllZoneLinks();
        public Task<List<ZoneLinkDTO>> GetBySubAndUserID(int subDepartmentID, string userID);
        public Task<List<ZoneLinkDTO>> GetAllUserLinks(string userID);
    

        Task<List<UserZoneLinkDTO>> GetUsersNotLinkedByUserID();

        public Task<List<ZoneLinkDTO>> GetAllRecordsByUserIdIfDeleted(string userID);


        

    }
}
