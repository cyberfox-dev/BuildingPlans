namespace BuildingPlans.Models.BindingModel
{
    public class DepositRequiredBindingModel
    {
        public int? DepositRequiredID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ServiceItemCode { get; set; }
        public string? Desciption { get; set; }
        public int? SubDepartmentForCommentID { get; set; }

        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }


        public double? Rate { get; set; }

        public int? Quantity { get; set; }

        public string? CreatedById { get; set; }

        public double? TotalAmount { get; set; }

        public string? Remarks { get; set; }
        public int? ServiceItemCodeID { get; set; }

        //WBS 

        public string? WBS { get; set; }

    }
}
