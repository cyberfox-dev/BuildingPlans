﻿using System.ComponentModel.DataAnnotations;


namespace BuildingPlans.Data.Entities
{
    public class DocumentsRepository : BaseEntity
    {
        [Key]
        public int? DocumentsRepositoryID { get; set; }
        public string? DocumentsCategory { get; set; }
        public int? DepartmentID { get; set; }
    }
}
