﻿using BuildingPlans.Data.Entities;
using BuildingPlans.Models.DTO;

namespace BuildingPlans.IServices
{
    public interface IDepartmentsService
    {
        //Task<Departments> - This is the return type so its going to ruturn it in the fromt of the departments model
        Task<Departments> AddUpdateDepartments(int? DepartmentID, string DepartmentName, bool hasSubDepartment, string? createdById, /*zxNumberUpdate Sindiswa 01 March 2024*/bool? needsZXNumber);
        //this will return T/F 
        public Task<bool> DeleteDepartments(int DepartmentID);
        Task<List<DepartmentsDTO>> GetDepartmentByDepartmentID(int DepartmentID);

        Task<List<DepartmentsDTO>> GetAllDepartments();
        public Task<int> CountDepartmentsThatNeedZXNumber(); //zxNumberUpdate Sindiswa 04 March 2024
    }
}
