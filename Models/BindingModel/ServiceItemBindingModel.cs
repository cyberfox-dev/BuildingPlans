namespace WayleaveManagementSystem.Models.BindingModel
{
    public class ServiceItemBindingModel
    {
        public int? ServiceItemID { get; set; }

        public string? ServiceItemCode { get; set; }
        public string? Description { get; set; }
        public int? Rate { get; set; }

        public int? TotalVat { get; set; }

        public string? CreatedById { get; set; }
       
    }
}
