using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPAccessGroups:BaseEntity
    {
        [Key]
        public int AccessGroupID { get; set; }

        public string? AccessGroupName { get; set; }

        public string? AccessGroupDescription {  get; set; }

    }
}
