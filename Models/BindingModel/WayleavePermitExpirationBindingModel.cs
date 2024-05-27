namespace BuildingPlans.Models.BindingModel
{
    public class WayleavePermitExpirationBindingModel
    {

        public int? WayleavePermitExpirationID { get; set; }
        public int? ApplicationID { get; set; }
        public int? SubdepartmentID { get; set; }
        public int? ZoneID { get; set; }
        public DateTime? OriginalDateWAPGenerated { get; set; }
        public DateTime? OriginalDatePermitGenerated { get; set; }
        public int? NumberOfDaysWap { get; set; }
        public int? NumberOfDaysPermit { get; set; }
    }
}
