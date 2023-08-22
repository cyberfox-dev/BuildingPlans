using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ContactDetails : BaseEntity
    {
        [Key]
        public int ContactDetailID { get; set; }
        public string? FullName { get; set; }

        public string? Email { get; set; }
        public string? CellNo { get; set; }


    }
}
