namespace WayleaveManagementSystem.Models.BindingModel
{
    public class FinancialBindingModel
    {
        public int? FinancialID { get; set; }
        public string? FinancialName { get; set; }

        //
        public string? FinancialType { get; set; }
        public string? FinancialDocumentName { get; set; }

        public string? FinancialDocumentLocalPath { get; set; }

        public int? ApplicationID { get; set; }


    }
}
