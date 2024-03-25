namespace BuildingPlans.Models.BindingModel
{
    public class ContactDetailsBindingModel
    {
        public int ContactDetailID { get; set; }
        public string? FullName { get; set; }

        public string? Email { get; set; }
        public string? CellNo { get; set; }
        public string? CreatedByID { get; set; }

        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }

        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }
    }
}
