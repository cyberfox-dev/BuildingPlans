namespace BuildingPlans.Models.BindingModel
{
    public class MandatoryDocumentStageLinkBindingModel
    {
        public int? MandatoryDocumentStageLinkID { get; set; }

        public int? MandatoryDocumentID { get; set; }
        public int StageID { get; set; }

        public string? StageName { get; set; }

        public string? CreatedById { get; set; }

    }
}
