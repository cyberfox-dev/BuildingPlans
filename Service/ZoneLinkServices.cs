﻿using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
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

        public async Task<ZoneLink> AddUpdateZoneLink(int? zoneLinkID, int departmentID, int subDepartmentID, string? assignedUserID, string? userType)
        {
            if (zoneLinkID == 0)
            {
                zoneLinkID = null;
            }

            var tempZoneLinksTable = _context.ZoneLinkTable.FirstOrDefault(x => x.ZoneLinkID == zoneLinkID);

            if (tempZoneLinksTable == null)
            {
                tempZoneLinksTable = new ZoneLink()
                {
                    ZoneLinkID = zoneLinkID,
                    DepartmentID = departmentID,
                    SubDepartmentID = subDepartmentID,
                    AssignedUserID = assignedUserID,
                    UserType = userType,

                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                };

                await _context.ZoneLinkTable.AddAsync(tempZoneLinksTable);
                await _context.SaveChangesAsync();

                return tempZoneLinksTable;

            }
            else
            {
                tempZoneLinksTable.ZoneLinkID = zoneLinkID;
                tempZoneLinksTable.DateUpdated = DateTime.Now;
                tempZoneLinksTable.isActive = true;

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
    }
}