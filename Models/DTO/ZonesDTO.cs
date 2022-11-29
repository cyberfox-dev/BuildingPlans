namespace WayleaveManagementSystem.Models.DTO
{
    public class ZonesDTO
    {
        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }
        public int? DepartmentID { get; set; }
        public int? SubDepartmentID { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
        public bool? isActive { get; set; }
    }
}
