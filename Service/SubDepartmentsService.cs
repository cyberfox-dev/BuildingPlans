using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.DTO;

using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Service
{
    public class SubDepartmentsService : ISubDepartmentService
    {
        private readonly AppDBContext _context;

        public SubDepartmentsService(AppDBContext context)
        {
            _context = context;
        }  

        public async Task<SubDepartments> AddUpdateSubDepartments(int? subDepartmentID, string? subDepartmentName, int? DepartmentID, string? createdByID) 
        {
            if(subDepartmentID == 0) 
            { 
                subDepartmentID = null; 
            }

            var tempSubDepartmentsTable = _context.SubDepartmentsTable.FirstOrDefault(x => x.SubDepartmentID == subDepartmentID);

            if(tempSubDepartmentsTable == null) 
            {
                tempSubDepartmentsTable = new SubDepartments()
                {
                    SubDepartmentName = subDepartmentName,
                    DepartmentID = DepartmentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdByID,
                    isActive = true

                };

                await _context.SubDepartmentsTable.AddAsync(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();

                return tempSubDepartmentsTable;

            }
            else
            {
                tempSubDepartmentsTable.SubDepartmentName = subDepartmentName;
                tempSubDepartmentsTable.DepartmentID = DepartmentID;
                tempSubDepartmentsTable.DateUpdated = DateTime.Now;
                tempSubDepartmentsTable.isActive = true;

                _context.Update(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();
                return tempSubDepartmentsTable;

            }

        }

        public async Task<bool> DeleteSubDepartments(string subDepartmentName)
        {
            var tempSubDepartmentsTable = _context.SubDepartmentsTable.FirstOrDefault(x => x.SubDepartmentName == subDepartmentName);

            if (tempSubDepartmentsTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempSubDepartmentsTable.DateUpdated = DateTime.Now;
                tempSubDepartmentsTable.isActive = false;
                _context.Update(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<SubDepartmentsDTO>> GetAllSubDepartments()
        {
            return await (
                from SubDepartments in _context.SubDepartmentsTable 
                where SubDepartments.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = SubDepartments.SubDepartmentID,
                    SubDepartmentName = SubDepartments.SubDepartmentName,
                    DepartmentID = SubDepartments.DepartmentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true


                }
                ).ToListAsync();
        }

        public async Task<List<SubDepartmentsDTO>> GetAllSubDepartmentsBydepartmentID(int departmentID)
        {
            return await(
                from SubDepartments in _context.SubDepartmentsTable
                where departmentID == SubDepartments.DepartmentID && SubDepartments.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = SubDepartments.SubDepartmentID,
                    SubDepartmentName = SubDepartments.SubDepartmentName,
                    DepartmentID = SubDepartments.DepartmentID,
                    DateCreated = SubDepartments.DateCreated,
                    DateUpdated = SubDepartments.DateUpdated,
                    isActive = true


                }
                ).ToListAsync();
        }
    }
}
