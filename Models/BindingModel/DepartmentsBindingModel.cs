﻿namespace WayleaveManagementSystem.Models.BindingModel
{
    public class DepartmentsBindingModel
    {
        public int DepartmentID { get; set; }
        public string DepartmentName { get; set; }

        public int? CreatedById { get; set; }
        public bool isActive { get; set; }
    }
}