using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class SubDepartments:BaseEntity
    {

        [Key]
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? SubDepartmentAdminUserID { get; set; }

        public int? DepartmentID { get; set; }
        public bool? isSetForAutomaticDistribution { get; set; }
        public int? MapLayerID { get; set; }

        public string? GLCode { get; set; }
        public string? ProfitCenter { get; set; }

        public int? PermitExpiration { get; set; }
        public int? WayleaveExpiration { get; set; }

        public bool? needsZXNumber { get; set; } //zxNum Sindiswa 08 February 2024

    }
}
