namespace WayleaveManagementSystem.Models.BindingModel
{
    public class StageBingingModel
    {
        public int? StageID { get; set; }
        public string? StageName { get; set; }
        public int? StageOrderNumber { get; set; }

        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
    }
}
