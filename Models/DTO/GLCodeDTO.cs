﻿namespace BuildingPlans.DTO
{
    // DTO - Data Trasfer Object
    public class GLCodeDTO
    {


        public int GLCodeID { get; set; }
        public string? GLCodeName { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }
        public string? ProfitCenter { get; set; }
        public int? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }


        public bool isActive { get; set; }

    }

}
