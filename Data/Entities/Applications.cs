﻿using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class Applications : BaseEntity
    {
        [Key]
        public int ApplicationID { get; set; }
        public string? UserID { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? AlternativeEmail { get; set; } // chekingNotifications Sindiswa 15 February 2024
        public string? PhoneNumber { get; set; }
        public string? PhyscialAddress { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? CompanyRegNo { get; set; }
        public string? TypeOfApplication { get; set; }
        public string? NotificationNumber { get; set; }
        public string? WBSNumber { get; set; }
        public string? PhysicalAddressOfProject { get; set; }
        public string? DescriptionOfProject { get; set; }
        public string? NatureOfWork { get; set; }
        public string? ExcavationType { get; set; }
        public DateTime? ExpectedStartDate { get; set; }
        public DateTime? ExpectedEndDate { get; set; }
        public string? Location { get; set; }
        public string? ProjectNumber { get; set; }
        public int? RejectCount { get; set; }


        //Stages
        public string? PreviousStageName { get; set; }
        public int? PreviousStageNumber { get; set; }
        public string? CurrentStageName { get; set; }
        public int? CurrentStageNumber { get; set; }
        public DateTime? CurrentStageStartDate { get; set; }
        public string? NextStageName { get; set; }
        public int? NextStageNumber { get; set; }

        public string? ApplicationStatus { get; set; }

        public bool? isDrafted { get; set; }
        public bool? isPlanning { get; set; }

        //for showing/hiding the escalate button

        public DateTime? PermitStartDate { get; set; }

        public DateTime? StageStartDate { get; set; }
        public DateTime? DatePaid { get; set; }

        public string? Coordinates { get; set; }

        public bool? WBSRequired { get; set; }

        /*Application Status Logic
        Verification Stage
        Unpaid
        Paid
        
        DD
        Distributed 
         */

        public int? ReApplyCount { get; set; } //reapply Sindiswa 22 January 2024
        public bool? isEscalated { get; set; } //escalation Sindiswa 29 January 2024
        public DateTime? EscalationDate { get; set; } //escalation Sindiswa 31 January 2024

        public DateTime? EMBActionDate { get; set; } //escalation Sindiswa 31 January 2024

        public bool? NetworkLicenses { get; set; } //Project size Kyle 27-02-24

        #region zxNum-and-contractorAccount Sindiswa 28 February 2024
        public string? WaterZXNumber { get; set; }
        public string? RIMZXNumber { get; set; }
        #endregion
        public string? ContractorAccountDetails { get; set; } //zxNumberUpdate Sindiswa 01 March 2024
    }
}
