using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class StagesTableBP:BaseEntity
    {
        [Key]
        public int StageID { get; set;}
        public string? StageName { get; set;}
        public int? StageOrder { get; set;}

        public string? FunctionalArea {  get; set;}

        public bool SkipTrigger { get; set;}
    }
}
