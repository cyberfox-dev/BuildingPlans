namespace WayleaveManagementSystem.Models.DTO
{
    public class ServiceItemDTO
    {
        public int? ServiceItemID { get; set; }

        public string? ServiceItemCode { get; set; }
        public string? Description { get; set; }
        public int? Rate { get; set; }

        public int? TotalVat { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
        public bool? isActive { get; set; }
    }
}
