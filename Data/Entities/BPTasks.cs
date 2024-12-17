using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPTasks:BaseEntity
    {
        [Key]
        public int? TaskID {  get; set; }
        public int? ApplicationID { get; set; }
        public string? TaskName { get; set; }
        public string? FunctionalArea { get; set; }
        public bool? isChecked {  get; set; }
        public string? CheckedBy {  get; set; }
        public string? TaskCreatedFor {  get; set; }
        public string? DepartmentName { get; set; }


    }
}
