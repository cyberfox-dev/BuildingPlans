using System.ComponentModel.DataAnnotations;
using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Models.BindingModel
{
    public class DraftedProjectsBindingModel
    {
        public int? DraftID { get; set; }
        public int? ApplicationID { get; set; }
        public string? UserID { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
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
        public string? CreatedById { get; set; }
        public string? Engineer {  get; set; }
        public string? Contractor {  get; set; }
    }

}
