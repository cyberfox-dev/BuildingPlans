﻿using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.DTO;

using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

namespace WayleaveManagementSystem.Service
{
    public class DepartmentsService : IDepartmentsService
    {
        private readonly AppDBContext _context;

        public DepartmentsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Departments> AddUpdateDepartments(int? departmentID, string departmentName )
        {
            if (departmentID == 0) 
            {
                departmentID = null;
            }

            var tempDepartmentsTable = _context.DepartmentsTable.FirstOrDefault(x => x.DepartmentID == departmentID);

            if(tempDepartmentsTable == null) 
            {
                tempDepartmentsTable = new Departments()
                {
                    DepartmentName = departmentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                };

                await _context.DepartmentsTable.AddAsync(tempDepartmentsTable);
                await _context.SaveChangesAsync();

                return tempDepartmentsTable;
            
            }
            else 
            {
                tempDepartmentsTable.DepartmentName = departmentName;
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

        public async Task<List<DepartmentsDTO>> GetAllDepartments(int DepartmentID)
        {
            return await (
                from Departments in _context.DepartmentsTable
                where Departments.DepartmentID == DepartmentID && Departments.isActive == true
                select new DepartmentsDTO()
                {
                    DepartmentID = Departments.DepartmentID,
                    DepartmentName = Departments.DepartmentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                

                }
                ).ToListAsync();
        }
    }
}