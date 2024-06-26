﻿using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class Notification : BaseEntity
    {
        [Key]
        public int? NotificationID { get; set; }
        public string? NotificationName { get; set; }

        public string? NotificationDescription { get; set; }
        public bool? IsRead { get; set; }

        public string? UserID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Message { get; set; }


    }
}
