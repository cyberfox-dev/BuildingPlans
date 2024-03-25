using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class AccessGroupUserLink : BaseEntity
    {
        [Key]
        public int AccessGroupUserLinkID { get; set; }
        public int? AccessGroupID { get; set; }
        public int? UserProfileID { get; set; }
        public int? SubDepartmentID { get; set; }
        public int? ZoneID { get; set; }
        //To Remove
        public string? UserID { get; set; }






    }
}
