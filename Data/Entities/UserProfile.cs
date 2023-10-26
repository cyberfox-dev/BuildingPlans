using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class UserProfile: BaseEntity
    {
        [Key]
        public int? UserProfileID { get; set; }
        public string? UserID { get; set; }

        public string? Name { get; set; }
        public string? SurnameName { get; set; }

        public string? FullName { get; set; }
        public string? Email { get; set;}

        public bool? isInternal { get; set; }
        public bool? isDefault { get; set; }

        //External Information
        public string? PhoneNumber { get; set; }
        public string? AlternativePhoneNumber { get; set; }

        public string? BP_Number { get; set; }

         public string? CompanyName { get; set; }

        public string? CompanyRegNo { get; set; }

        public string? PhyscialAddress { get; set; }
        //To Remove?
        public string? CopyOfID { get; set; }
        //To Remove?
        public string? IdNumber { get; set; }

        public string? VatNumber { get; set; }
        public string? ICASALicense { get; set; }


        //Internal Information
        public string? Directorate { get; set; }
        public int? DepartmentID { get; set; }

        public string? DepartmentName { get; set; }

        public string? Branch { get; set; }

        public string? CostCenterNumber { get; set; }

        public string? CostCenterOwner { get; set; }
        public bool? depConfirmation { get; set; }
        public int? zoneID { get; set; }
        public string? zoneName { get; set; }
        public string? refNumber { get; set; }
        public string? companyType { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
        //To Remove
        public bool? isDepartmentAdmin { get; set; }
        //To Remove
        public bool? isZoneAdmin { get; set; }

    }
}
