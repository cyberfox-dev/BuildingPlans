namespace BuildingPlans.Models.DTO
{
    public class BPAddressTypesDTO
    {
        public int? AddresTypeID { get; set; }
        public string? TypeName { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public bool? isActive { get; set; }
    }
}
