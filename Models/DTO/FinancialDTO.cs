﻿using BuildingPlans.Data.Entities;

namespace BuildingPlans.DTO
{
    public class FinancialDTO : BaseEntity
    {

        public int? FinancialID { get; set; }
        public string? FinancialName { get; set; }
        public string? FinancialType { get; set; }
        public string? DocumentName { get; set; }

        public string? DocumentLocalPath { get; set; }

        public int? ApplicationID { get; set; }

    }
}


