using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.IServices;
using BuildingPlans.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class BPDepartmentsService : IBPDepartmentsService
    {

        private readonly AppDBContext _context;
        public BPDepartmentsService(AppDBContext context)
        {
            _context = context;
        }


        public async Task<BPDepartments> AddUpdateDepartments(int? departmentID, string departmentName, bool hasSubDepartment,string? functionalArea,  string? createdById)
        {
            if (departmentID == 0)
            {
                departmentID = null;
            }

            var tempDepartmentsTable = _context.BPDepartments.FirstOrDefault(x => x.DepartmentID == departmentID);

            if (tempDepartmentsTable == null)
            {
                tempDepartmentsTable = new BPDepartments()
                {
                    DepartmentName = departmentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,
                    hasSubDepartment = hasSubDepartment,
                    FunctionalArea = functionalArea
                };

                await _context.BPDepartments.AddAsync(tempDepartmentsTable);
                await _context.SaveChangesAsync();

                return tempDepartmentsTable;

            }
            else
            {

                if (!string.IsNullOrWhiteSpace(departmentName)) // Check if departmentName is not null or empty
                {
                    tempDepartmentsTable.DepartmentName = departmentName;
                }

                if (!string.IsNullOrWhiteSpace(createdById)) // Check if createdById is not null or empty
                {
                    tempDepartmentsTable.CreatedById = createdById;
                }
                if (!string.IsNullOrWhiteSpace(functionalArea))
                {
                    tempDepartmentsTable.FunctionalArea = functionalArea;
                }
                    tempDepartmentsTable.DateUpdated = DateTime.Now;
                tempDepartmentsTable.isActive = true;

                _context.Update(tempDepartmentsTable);
                await _context.SaveChangesAsync();
                return tempDepartmentsTable;
            }

        }
        public async Task<bool> DeleteDepartments(int departmentID)
        {
            var tempDepartmentsTable = _context.BPDepartments.FirstOrDefault(x => x.DepartmentID == departmentID);

            if (tempDepartmentsTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempDepartmentsTable.DateUpdated = DateTime.Now;
                tempDepartmentsTable.isActive = false;
                _context.Update(tempDepartmentsTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<DepartmentsDTO>> GetAllDepartments()
        {
            return await (
                from Departments in _context.BPDepartments
                where Departments.isActive == true
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    FunctionalArea = Departments.FunctionalArea,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true,
                    hasSubDepartment = Departments.hasSubDepartment ?? false // Provide a default value if hasSubDepartment is null


                }
                ).ToListAsync();
        }

        public async Task<List<DepartmentsDTO>> GetDepartmentByDepartmentID( int departmentID)
        {
            return await (
                from Departments in _context.BPDepartments
                where Departments.isActive == true && Departments.DepartmentID == departmentID
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    FunctionalArea = Departments.FunctionalArea,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true,
                    hasSubDepartment = Departments.hasSubDepartment ?? false // Provide a default value if hasSubDepartment is null
                }
                ).ToListAsync();
        }

        public async Task<List<DepartmentsDTO>> GetAllDepartmentsForFunctionalArea(string functionalArea)
        {
            return await (
                from Departments in _context.BPDepartments
                where Departments.isActive == true && Departments.FunctionalArea == functionalArea
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    DateCreated = Departments.DateCreated,
                    DateUpdated = Departments.DateUpdated,
                    isActive = true,
                    hasSubDepartment = Departments.hasSubDepartment ?? false, // Provide a default value if hasSubDepartment is null
                    FunctionalArea = Departments.FunctionalArea
                }).ToListAsync();
        }


        public async Task<List<DepartmentsDTO>> GetDepartmentByDepartmentName(string departmentName)
        {
            return await (
                from Departments in _context.BPDepartments
                where Departments.DepartmentName == departmentName && Departments.isActive == true
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    DateCreated = Departments.DateCreated,
                    DateUpdated = Departments.DateUpdated,
                    isActive = true,
                    hasSubDepartment = Departments.hasSubDepartment ?? false, // Provide a default value if hasSubDepartment is null
                    FunctionalArea = Departments.FunctionalArea
                }).ToListAsync();
        }
    }
}
