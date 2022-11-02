using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Professionals:BaseEntity
    {
        [Key]
        public int ProfessinalID { get; set; }

        public string ProfessinalType { get; set; }

        public string FullName { get; set; }

        public string BP_Number { get; set; }

        public bool? BpVerified { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string ProfessionalRegNo { get; set; }

        public string AppUserID { get; set; }

        public int IDNumber { get; set; }

        public AppUser AppUser { get; set; }




    }
}
