﻿using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class FAQ : BaseEntity
    {
        [Key]
        public int FAQID { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }



    }

}
