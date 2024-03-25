namespace BuildingPlans.DTO
{
    // DTO - Data Trasfer Object
    public class RolesDTO
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
        public int RoleID { get; set; }
        public string? RoleName { get; set; }
        public string? RoleType { get; set; }
        public string? RoleDescription { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public bool isActive { get; set; }

    }

}
