namespace BuildingPlans.Models.BindingModel
{
    public class BPFunctionalAreaBindingModel
    {
        public int? FunctionalAreaID { get; set; }
        public string? FAName { get; set; }
        public string? FAItemCode { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }
    }
}
