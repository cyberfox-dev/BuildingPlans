namespace BuildingPlans.DTO
{
    // DTO - Data Trasfer Object
    public class ZonesForCommentDTO
    {
        public int? ZoneForCommentID { get; set; }

        public int? ApplicationID { get; set; }

        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }

        public int? ZoneID { get; set; }
        public string? ZoneName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public bool isActive { get; set; }




    }

}
