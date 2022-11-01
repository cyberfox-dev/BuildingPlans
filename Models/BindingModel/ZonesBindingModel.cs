namespace WayleaveManagementSystem.Models.BindingModel
{
    public class ZonesBindingModel
    {
        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }
        public int DepartmentID { get; set; }
        public int SubDepartmentID { get; set; }

        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
    }
}
