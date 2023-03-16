using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Models.DTO
{
    public class UserProfileDTO
    {
        //public UserProfileDTO(int userProfileID, string userID, string fullName, string email, string? phoneNumber, bool IsInternal, string? bp_Number, string? companyName, string? companyRegNo, string? physcialAddress, string? directorate, int? departmentID, int? subDepartmentID, string? branch, string? costCenterNumber, string? costCenterOwner, byte? copyOfID)
        //{
        //    UserProfileID = userProfileID;
        //    UserID = userID;
        //    FullName = fullName;
        //    Email = email;
        //    PhoneNumber = phoneNumber;
        //    isInternal = IsInternal;
        //    BP_Number = bp_Number;
        //    CompanyName = companyName;
        //    CompanyRegNo = companyName;
        //    PhyscialAddress = physcialAddress;
        //    Directorate = directorate;
        //    DepartmentID = departmentID;
        //    SubDepartmentID = subDepartmentID;
        //    Branch = branch;
        //    CostCenterNumber = costCenterNumber;
        //    CostCenterOwner = costCenterOwner;
        //    CopyOfID = copyOfID;
        //}
        public int? UserProfileID { get; set; }
        public string UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public bool isInternal { get; set; }
        public string? BP_Number { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyRegNo { get; set; }
        public string? PhyscialAddress { get; set; }
        public string? Directorate { get; set; }
        public int? DepartmentID { get; set; }
        public bool? isDepartmentAdmin { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? Branch { get; set; }
        public string? CostCenterNumber { get; set; }
        public string? CostCenterOwner { get; set; }
        public string? CopyOfID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public bool isActive { get; set; }

        public string? IdNumber { get; set; }

        public string? VatNumber { get; set; }

    }    
}
