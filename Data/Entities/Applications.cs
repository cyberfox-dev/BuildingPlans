using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Applications: BaseEntity
    {
        [Key]
        public int? ApplicationID { get; set; }
        public string UserID { get; set; }

        public string FullName { get; set; }

        public string Email { get; set;}

        public string? PhoneNumber { get; set;}

        //public bool isInternal { get; set; }
        public string? PhyscialAddress { get; set; }
        //public string? BP_Number { get; set; }

         public string? ReferenceNumber { get; set; }

        public string? CompanyRegNo { get; set; }


        //public string? Directorate { get; set; }

        //public int? DepartmentID { get; set; }

        //public int? SubDepartmentID { get; set; }

        public string? TypeOfApplication { get; set; }

        public string? NotificationNumber { get; set; }
        public string? WBSNumber { get; set; }

        public string? PhysicalAddressOfProject { get; set; }

        public string? CostCenterNumber { get; set; }

        public string? CostCenterOwner { get; set; }

        public byte? CopyOfID { get; set; }

        public string? IdNumber { get; set; }



    }
}
