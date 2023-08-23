namespace WayleaveManagementSystem.Models.DTO
{
    public class ContactDetailsDTO
    {


        public int ContactDetailID { get; set; }
        public string? FullName { get; set; }

        public string? Email { get; set; }
        public string? CellNo { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }

        public bool? isActive { get; set; }



    }
}
