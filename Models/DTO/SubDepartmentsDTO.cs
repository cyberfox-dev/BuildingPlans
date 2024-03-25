namespace BuildingPlans.Models.DTO
{
    public class SubDepartmentsDTO
    {
        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public int? DepartmentID { get; set; }
        public string? UserAssaignedToComment { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public int? MapLayerID { get; set; }
        public string? GlCode { get; set; }
        public string? ProfitCenter { get; set; }
        public int? PermitExpiration { get; set; }
        public int? WayleaveExpiration { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public int? CreatedById { get; set; }
        public bool? isActive { get; set; }
        public bool? isSetForAutomaticDistribution { get; set; }
        public bool? needsZXNumber { get; set; } //zxNum Sindiswa 08 February 2024

    }
}
