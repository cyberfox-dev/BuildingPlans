namespace BuildingPlans.Models.BindingModel
{
    public class AccessGroupUserLinkBindingModel
    {
        public int AccessGroupUserLinkID { get; set; }
        public int? AccessGroupID { get; set; }

        public string? UserID { get; set; }

        public int? DepartmentID { get; set; }
        public int? ZoneID { get; set; }
        public int? UserProfileID { get; set; }

    }
}
