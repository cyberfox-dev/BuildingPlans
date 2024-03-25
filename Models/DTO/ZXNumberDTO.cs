namespace BuildingPlans.Models.DTO
{
    public class ZXNumberDTO
    {
        public int ZXNumberID { get; set; }
        public int? ApplicationID { get; set; }
        public int? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? ZXNumber { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public bool isActive { get; set; }
    }
}
