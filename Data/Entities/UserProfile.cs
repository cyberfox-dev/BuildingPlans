using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class UserProfile: BaseEntity
    {
        [Key]
        public int UserProfileID { get; set; }
        public string UserID { get; set; }

        public string FullName { get; set; }

        public string Email { get; set;}

        public string? PhoneNumber { get; set;}

        public bool isInternal { get; set; }

        public string? BP_Number { get; set; }

         public string? CompanyName { get; set; }

        public string? CompanyRegNo { get; set; }

        public string? PhyscialAddress { get; set; }
        public string? Directorate { get; set; }

        public int? DepartmentID { get; set; }

        public int? SubDepartmentID { get; set; }

        public string? Branch { get; set; }

        public string? CostCenterNumber { get; set; }

        public string? CostCenterOwner { get; set; }

        public byte? CopyOfID { get; set; }





    }
}
