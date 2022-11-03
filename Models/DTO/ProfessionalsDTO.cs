using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    public class ProfessionalsDTO
    {
        //public ProfessionalsDTO(int professinalID, string professinalType, string fullName, string bp_Number, bool? bpVerified, string email, string phoneNumber, string professionalRegNo,DateTime dateCreated ,DateTime dateUpdated, string? appUserID, int createdById)
        //{
        //    ProfessinalID = professinalID;
        //    ProfessinalType = professinalType;
        //    FullName = fullName;
        //    BP_Number = bp_Number;
        //    BpVerified = bpVerified;
        //    PhoneNumber = phoneNumber;
        //    Email = email;
        //    ProfessionalRegNo = professionalRegNo;
        //    DateCreated = dateCreated;
        //    DateUpdated = dateUpdated;
        //    CreatedById = createdById;
        //    AppUserID = appUserID;


        //}
        public int ProfessinalID { get; set; }

        public string ProfessinalType { get; set; }

        public string FullName { get; set; }

        public string BP_Number { get; set; }

        public bool? BpVerified { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string ProfessionalRegNo { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public string? AppUserID { get; set; }

        public string? IdNumber { get; set; }

       
    }

}
