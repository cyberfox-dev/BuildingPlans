using Microsoft.EntityFrameworkCore.Storage;
using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPAccessGroupsUserLink:BaseEntity
    {
        [Key]
        public int AccessGroupUserLinkID { get; set; }
        public int?AccessGroupID { get; set; }
        public string? AccessGroupName { get; set; }
        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }
        public string? SubdepartmentName { get; set; }
        public string? UserID { get; set; }
        public string? FunctionalArea { get; set; }
        public string? DepartmentName { get; set; }
        
    }
}
