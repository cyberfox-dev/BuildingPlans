﻿using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Models.DTO
{
    public class ApplicationsDTO
    {
        public int? ApplicationID { get; set; }
        public string? UserID { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? PhysicalAddress { get; set; }
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
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public bool isActive { get; set; }

    }
}