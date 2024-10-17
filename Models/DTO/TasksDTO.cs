namespace BuildingPlans.Models.DTO
{
    public class TasksDTO
    {
        public int? TaskID { get; set; }
        public int? ApplicationID { get; set; }
        public string? TaskName { get; set; }
        public string? FunctionalArea { get; set; }
        public bool? isChecked { get; set; }
        public string? CheckedBy { get; set; }
        public string? TaskCreatedFor { get; set; }
        public string? CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool isActive { get; set; }
    }
}
