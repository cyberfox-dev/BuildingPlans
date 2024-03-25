using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.IServices;
using BuildingPlans.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class DepartmentsService : IDepartmentsService
    {
        private readonly AppDBContext _context;

        public DepartmentsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Departments> AddUpdateDepartments(int? departmentID, string departmentName, bool hasSubDepartment, string? createdById, /*zxNumberUpdate Sindiswa 01 March 2024*/bool? needsZXNumber)
        {
            if (departmentID == 0)
            {
                departmentID = null;
            }

            var tempDepartmentsTable = _context.DepartmentsTable.FirstOrDefault(x => x.DepartmentID == departmentID);

            if (tempDepartmentsTable == null)
            {
                tempDepartmentsTable = new Departments()
                {
                    DepartmentName = departmentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,
                    hasSubDepartment = hasSubDepartment,
                    needsZXNumber = needsZXNumber //zxNumberUpdate Sindiswa 01 March 2024
                };

                await _context.DepartmentsTable.AddAsync(tempDepartmentsTable);
                await _context.SaveChangesAsync();

                return tempDepartmentsTable;

            }
            else
            {

                #region zxNumberUpdate Sindiswa 01 March 2024
                if (departmentName != null)
                {
                    tempDepartmentsTable.DepartmentName = departmentName;
                }
                if (hasSubDepartment != null)
                {
                    tempDepartmentsTable.hasSubDepartment = hasSubDepartment;
                }
                if (needsZXNumber != null)
                {
                    tempDepartmentsTable.needsZXNumber = needsZXNumber;
                }
                #endregion

                tempDepartmentsTable.DateUpdated = DateTime.Now;
                tempDepartmentsTable.isActive = true;

                _context.Update(tempDepartmentsTable);
                await _context.SaveChangesAsync();
                return tempDepartmentsTable;
            }

        }

        public async Task<bool> DeleteDepartments(int departmentID)
        {
            var tempDepartmentsTable = _context.DepartmentsTable.FirstOrDefault(x => x.DepartmentID == departmentID);

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
                from Departments in _context.DepartmentsTable
                where Departments.isActive == true
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true,
                    hasSubDepartment = Departments.hasSubDepartment,
                    needsZXNumber = Departments.needsZXNumber,// zxNumberUpdate Sindiswa 01 March 2024
                }
                ).ToListAsync();
        }

        public async Task<List<DepartmentsDTO>> GetDepartmentByDepartmentID(int departmentID)
        {
            return await (
                from Departments in _context.DepartmentsTable
                where Departments.isActive == true && Departments.DepartmentID == departmentID
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true,
                    hasSubDepartment = Departments.hasSubDepartment,
                    needsZXNumber = Departments.needsZXNumber,// zxNumberUpdate Sindiswa 01 March 2024
                }
                ).ToListAsync();
        }

        #region zxNumberUpdate Sindiswa 04 March 2024
        public async Task<int> CountDepartmentsThatNeedZXNumber()
        {
            return await (
                from department in _context.DepartmentsTable
                where department.isActive == true && department.needsZXNumber == true
                select department
            ).CountAsync();
        }
        #endregion
    }
}
