using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Data.Migrations;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.DTO;


namespace WayleaveManagementSystem.Service
{
    public class ZoneLinkServices : IZoneLinkServices
    {
        private readonly AppDBContext _context;

        public ZoneLinkServices(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ZoneLink> AddUpdateZoneLink(int? zoneLinkID,int? zoneID , string? zoneName, int? departmentID, int? subDepartmentID, string? subDepartmentName, string? assignedUserID, string? userType,string? createdById, bool? isDepartmentAdmin, bool? isZoneAdmin)
        {
            if (zoneLinkID == 0)
            {
                zoneLinkID = null;
            }

            var tempZoneLinksTable = _context.ZoneLinkTable.FirstOrDefault(x => x.ZoneLinkID == zoneLinkID);

            if (tempZoneLinksTable == null)
            {
                if (isDepartmentAdmin != null)
                {
                    isDepartmentAdmin = false;
                }
                if (isZoneAdmin != null)
                {
                    isZoneAdmin = false;
                }

                tempZoneLinksTable = new ZoneLink()
                {
                    ZoneLinkID = zoneLinkID,
                    DepartmentID = departmentID,
                    SubDepartmentID = subDepartmentID,
                    AssignedUserID = assignedUserID,
                    UserType = userType,
                    ZoneID = zoneID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isDepartmentAdmin = isDepartmentAdmin,  
                    isZoneAdmin = isZoneAdmin,
                    SubDepartmentName = subDepartmentName,  
                    ZoneName = zoneName,    
                    isActive = true
                };

                await _context.ZoneLinkTable.AddAsync(tempZoneLinksTable);
                await _context.SaveChangesAsync();

                return tempZoneLinksTable;

            }
            else
            {

                if (zoneID != null)
                {
                    tempZoneLinksTable.ZoneID = zoneID;
                }

                if (zoneName != null)
                {
                    tempZoneLinksTable.ZoneName = zoneName;
                }

                if (departmentID != null)
                {
                    tempZoneLinksTable.DepartmentID = departmentID;
                }
                if (subDepartmentID != null)
                {
                    tempZoneLinksTable.SubDepartmentID = subDepartmentID;
                }
                if (zoneName != null)
                {
                    tempZoneLinksTable.SubDepartmentName = subDepartmentName;
                }
                if (assignedUserID != null)
                {
                    tempZoneLinksTable.AssignedUserID = assignedUserID;
                }
                if (userType != null)
                {
                    tempZoneLinksTable.UserType = userType;
                }
                if (isDepartmentAdmin != null)
                {
                    tempZoneLinksTable.isDepartmentAdmin = isDepartmentAdmin;
                } 
                if (isZoneAdmin != null)
                {
                    tempZoneLinksTable.isZoneAdmin = isZoneAdmin;
                } 

                tempZoneLinksTable.DateUpdated = DateTime.Now;
             

                _context.Update(tempZoneLinksTable);
                await _context.SaveChangesAsync();
                return tempZoneLinksTable;
            }

        }

        public async Task<bool> DeleteZoneLink(int zoneLinkID)
        {
            var tempZoneLinksTable = _context.ZoneLinkTable.FirstOrDefault(x => x.ZoneLinkID == zoneLinkID);

            if (tempZoneLinksTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempZoneLinksTable.DateUpdated = DateTime.Now;
                tempZoneLinksTable.isActive = false;
                _context.Update(tempZoneLinksTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<ZoneLinkDTO>> GetAllZoneLinks()
        {
            return await (
                from ZoneLink in _context.ZoneLinkTable
                    //where Zones.ZoneID == ZoneID && Zones.isActive == true
                select new ZoneLinkDTO()
                {
                    ZoneLinkID = ZoneLink.ZoneLinkID,
                    DepartmentID = ZoneLink.DepartmentID,
                    SubDepartmentID = ZoneLink.SubDepartmentID,

                    AssignedUserID = ZoneLink.AssignedUserID,
                    UserType = ZoneLink.UserType,

                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,

                }
                ).ToListAsync();
        }


        public async Task<List<ZoneLinkDTO>> GetBySubAndUserID(int subDepartmentID, string userID)
        {
            return await (
                from ZoneLink in _context.ZoneLinkTable
                    where ZoneLink.SubDepartmentID == subDepartmentID && ZoneLink.AssignedUserID == userID && ZoneLink.isActive == true
                select new ZoneLinkDTO()
                {
                    ZoneLinkID = ZoneLink.ZoneLinkID,
                    DepartmentID = ZoneLink.DepartmentID,
                    SubDepartmentID = ZoneLink.SubDepartmentID,

                    AssignedUserID = ZoneLink.AssignedUserID,
                    UserType = ZoneLink.UserType,

                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isDepartmentAdmin = ZoneLink.isDepartmentAdmin,
                    isZoneAdmin = ZoneLink.isZoneAdmin,

                }
                ).ToListAsync();
        }



        public async Task<List<ZoneLinkDTO>> GetAllUserLinks(string userID)
        {
            return await (
                from ZoneLink in _context.ZoneLinkTable
                    where ZoneLink.AssignedUserID == userID && ZoneLink.isActive == true
                select new ZoneLinkDTO()
                {
                    ZoneLinkID = ZoneLink.ZoneLinkID,
                    DepartmentID = ZoneLink.DepartmentID,
                    SubDepartmentID = ZoneLink.SubDepartmentID,

                    AssignedUserID = ZoneLink.AssignedUserID,
                    UserType = ZoneLink.UserType,

                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,

                    ZoneID = ZoneLink.ZoneID,

                }
                ).ToListAsync();
        }
        public async Task<List<UserZoneLinkDTO>> GetUsersNotLinkedByUserID()
        {
            return await (

                from AspNetUsers in _context.Users
                join ZoneLinkTable in _context.ZoneLinkTable on AspNetUsers.Id equals ZoneLinkTable.AssignedUserID
                // where ZoneLinkTable.AssignedUserID == null || ZoneLinkTable.isActive == false /*&& ZoneLinkTable.AssignedUserID == AspNetUsers.Id || ZoneLinkTable.isActive == false*/
                select new UserZoneLinkDTO()
                {

                    FullName = AspNetUsers.FullName,
                    Email = AspNetUsers.Email,
                    UserId = AspNetUsers.Id


                }
                ).ToListAsync();


            //UserZoneLink  FromSqlRaw("SP_GetUsersNotLinkedByUserID").ToListAsync();
            //var result = _context.UserZoneLink.FromSqlRaw("GetUsersNotLinkedByUserID").ToListAsync();
            //return result;
        }


        public async Task<List<ZoneLinkDTO>> GetAllRecordsByUserIdIfDeleted(string userID)
        {
            return await (
                from ZoneLink in _context.ZoneLinkTable
                    where ZoneLink.AssignedUserID == userID && ZoneLink.isActive == false
                select new ZoneLinkDTO()
                {
                    ZoneLinkID = ZoneLink.ZoneLinkID,
                    DepartmentID = ZoneLink.DepartmentID,
                    SubDepartmentID = ZoneLink.SubDepartmentID,

                    AssignedUserID = ZoneLink.AssignedUserID,
                    UserType = ZoneLink.UserType,

                    DateCreated = ZoneLink.DateCreated,
                    DateUpdated = ZoneLink.DateUpdated,

                }
                ).ToListAsync();
        }

    }
}
