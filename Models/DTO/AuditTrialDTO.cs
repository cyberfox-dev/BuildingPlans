namespace WayleaveManagementSystem.Models.DTO
{
    public class AuditTrialDTO
    {
        //Audit Trail Kyle 
        public int? AuditTrailID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Description { get; set; }
        public bool? IsInternal { get; set; }
        public string? SubDepartmentName { get; set; }
        public string? ZoneName { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public bool? isActive { get; set; }
    }
}
