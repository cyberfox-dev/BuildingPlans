namespace WayleaveManagementSystem.Models.BindingModel
{
    public class MFTBindingModel
    {
        public int MFTID { get; set; }
        public int? ApplicationID { get; set; }
        public string? MFTNote { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentLocalPath { get; set; }

        public string? CreatedById { get; set; }

        public string? FullName { get; set; }

    }
}
