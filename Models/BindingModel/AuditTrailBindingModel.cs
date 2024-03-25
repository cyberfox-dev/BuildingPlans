namespace BuildingPlans.Models.BindingModel
{
    public class AuditTrailBindingModel
    {
        //Audit Trail Kyle 
        public int? AuditTrailID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Description { get; set; }
        public bool? IsInternal { get; set; }
        public string? SubDepartmentName { get; set; }
        public string? ZoneName { get; set; }
        public string? CreatedById { get; set; }

    }
}
