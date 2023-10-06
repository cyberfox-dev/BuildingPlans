using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class  AccessGroupUserLink: BaseEntity
    {
        [Key]
        public int AccessGroupUserLinkID { get; set; }
        public int? AccessGroupID { get; set; }

        public string? UserID { get; set; }


        //Need to add subdepartment and zone?
        public int? SubDepartmentID { get; set; }
        public int? ZoneID { get; set; }

    }
}
