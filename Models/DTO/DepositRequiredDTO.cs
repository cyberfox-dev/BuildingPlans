namespace WayleaveManagementSystem.Models.DTO
{
    public class DepositRequiredDTO
    {
     

        public int? DepositRequiredID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ServiceItemCode { get; set; }
        public string? SubDepartmentName { get; set; }
        public string? Desciption { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public int? SubDepartmentID { get; set; }
        public double? Rate { get; set; }
        public double? Quantity { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
        public bool? isActive { get; set; }

        public double? TotalAmount { get; set; }

        public int? ServiceItemCodeID { get; set; }

        public string? Remarks { get; set; }
        //WBS 
        public string? WBS { get; set; }
    }
}
