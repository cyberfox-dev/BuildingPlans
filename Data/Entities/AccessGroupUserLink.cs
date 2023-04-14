using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class  AccessGroupUserLink: BaseEntity
    {
        [Key]
        public int AccessGroupUserLinkID { get; set; }
        public int? AccessGroupID { get; set; }

        public string? UserID { get; set; }




    }
}
