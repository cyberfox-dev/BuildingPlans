﻿using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Models.DTO
{
    public class DepartmentsDTO
    {
        public int DepartmentID { get; set; }
        public string DepartmentName { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public int? CreatedById { get; set; }
        public bool isActive { get; set; }

    }
}