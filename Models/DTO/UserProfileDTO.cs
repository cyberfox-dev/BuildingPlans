namespace BuildingPlans.Models.DTO
{
    public class UserProfileDTO
    {

        public int? UserProfileID { get; set; }
        public string? UserID { get; set; }

        public string? Name { get; set; }
        public string? Surname { get; set; }

        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? AlternativeEmail { get; set; }

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


        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

        public string? CreatedById { get; set; }
        public int? MapObjectID { get; internal set; }
        public bool? isArchitect { get; set; }
    }
}
