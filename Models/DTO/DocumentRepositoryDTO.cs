using System.ComponentModel.DataAnnotations;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;



namespace WayleaveManagementSystem.Models.DTO
{
    public class DocumentRepositoryDTO
    {
        public int? DocumentsRepositoryID { get; set; }
        public string? DocumentsCategory { get; set; }
        public int? DepartmentID { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public bool? isActive { get; set; }
    }
}
