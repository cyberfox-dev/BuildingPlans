﻿namespace BuildingPlans.Models.DTO
{
    public class ZoneLinkDTO
    {
        public int? ZoneLinkID { get; set; }

        public int? DepartmentID { get; set; }

        public int? SubDepartmentID { get; set; }

        public string? SubDepartmentName { get; set; }

        public string? AssignedUserID { get; set; }

        public string? UserType { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
        public int? ZoneID { get; set; }//

        public string? ZoneName { get; set; }


        public bool? isDepartmentAdmin { get; set; }
        public bool? isZoneAdmin { get; set; }
        public int? AccessGroupUserLinkID { get; set; }
        public string? AcessGroupName { get; set; }
        public bool? isDefault { get; set; }

        public string? AccessGroupName { get; set; }
        // public string? AccessGroupUserLinkID { get; set; }

    }
}
