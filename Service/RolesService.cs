using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Service
{
    public class RolesService : IRolesService
    {
        private readonly AppDBContext _context;

        public RolesService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Roles> AddUpdateRole(int? roleID, string roleName, string roleType, string roleDescription, string? creadtedByID)
        {

            if (roleID == 0)
            {
                roleID = null;
            }
            //this checks is the record exists in the db
            var tempRoleTable = _context.Role.FirstOrDefault(x => x.RoleID == roleID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempRoleTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempRoleTable = new Roles()
                {
                    RoleName = roleName,
                    RoleType = roleType,
                    RoleDescription = roleDescription,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.Role.AddAsync(tempRoleTable);
                await _context.SaveChangesAsync();

                return tempRoleTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempRoleTable.RoleName = roleName;
                tempRoleTable.RoleType = roleType;
                tempRoleTable.RoleDescription = roleDescription;
                tempRoleTable.DateUpdated = DateTime.Now;
                tempRoleTable.isActive = true;

                _context.Update(tempRoleTable);
                await _context.SaveChangesAsync();
                return tempRoleTable;
            }



        }

        public async Task<bool> DeleteRole(int roleID)
        {
            //this checks is the record exists in the db
            var tempRoleTable = _context.Role.FirstOrDefault(x => x.RoleID == roleID);

            if (tempRoleTable == null)
            {
                return await Task.FromResult(false);
                
            }
            else
            {
                tempRoleTable.DateUpdated = DateTime.Now;
                tempRoleTable.isActive = false;
                _context.Update(tempRoleTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }



        public async Task<List<RolesDTO>> GetRoleByRoleID(int roleID)
        {
            return await(
                from role in _context.Role where role.RoleID == roleID && role.isActive == true
                select new RolesDTO()
                {
                    RoleID = role.RoleID,
                    RoleName = role.RoleName,
                    RoleType = role.RoleType,
                    RoleDescription = role.RoleDescription,
                    DateCreated = role.DateCreated,
                    DateUpdated = role.DateUpdated,
                    CreatedById = role.CreatedById,

                }
                ).ToListAsync();
        }

        public async Task<List<RolesDTO>> GetAllRoles()
        {
            return await (
                from role in _context.Role where role.isActive == true select new RolesDTO()
                {
                    RoleID = role.RoleID,
                    RoleName = role.RoleName,
                    RoleType = role.RoleType,
                    RoleDescription = role.RoleDescription,
                    DateCreated = role.DateCreated,
                    DateUpdated = role.DateUpdated,
                    CreatedById = role.CreatedById,

                }
                ).ToListAsync();
        }
    }
}
