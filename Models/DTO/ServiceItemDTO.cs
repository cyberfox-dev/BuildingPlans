namespace BuildingPlans.Models.DTO
{
    public class ServiceItemDTO
    {
        public int? ServiceItemID { get; set; }

        public string? ServiceItemCode { get; set; }
        public string? Description { get; set; }
        public double? Rate { get; set; }

        public double? TotalVat { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
        public bool? isActive { get; set; }

        public int? DepartmentID { get; set; }
        public string? Category { get; set; }
        public bool? VatApplicable { get; set; }
        public string? Remarks { get; set; }
    }
}
