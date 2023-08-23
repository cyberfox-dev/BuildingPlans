namespace WayleaveManagementSystem.Models.BindingModel
{
    public class ContactDetailsBindingModel
    {
        public int ContactDetailID { get; set; }
        public string? FullName { get; set; }

        public string? Email { get; set; }
        public string? CellNo { get; set; }
        public string? CreatedByID { get; set; }

    }
}
