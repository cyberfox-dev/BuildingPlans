namespace BuildingPlans.Models.BindingModel
{
    public class BPMandatoryDepartmentDocumentsBindingModel
    {
        public int? DocumentID { get; set; }
        public string? DocumentName { get; set; }
        public string? DepartmentName { get; set; }
        public string? FunctionalArea { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

        public string? CreatedById { get; set; }
    }
}
