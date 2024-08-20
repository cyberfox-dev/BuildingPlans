using BuildingPlans.Data.Entities;
using NetTopologySuite.Geometries;
namespace BuildingPlans.Models.DTO
{
    public class BuildingApplicationDTO
    {
        public int ApplicationID { get; set; }
        public string? LSNumber { get; set; }
        public string? UserID { get; set; }
        public string? FirstName { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? CellNumber { get; set; }
        public string? AltEmail { get; set; }
        public string? AltCellNumber { get; set; }
        public string? IDNumber { get; set; }
        public string? PropertyDescription { get; set; }
        public string? PremisesName { get; set; }
        public string? AddressType { get; set; }
        public string? ErfNumber { get; set; }
        public string? PortionNumber { get; set; }
        public string? NoOfUnits { get; set; }
        public string? UnitNumber { get; set; }
        public string? PhysicalAddress { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public string? ArchitectName { get; set; }
        public string? BuildingPlanFor { get; set; }
        public string? TypeOfDevelopment { get; set; }
        public string? TotalArea { get; set; }
        public string? OccupationClassification { get; set; }
        public string? PlanFees { get; set; }
        public string? PropertyValue { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime?DateUpdated { get; set; }
        public bool? isActive { get; set; }
        public string? ArchitectUserID { get; set; }
        public string? StreetAddress { get; set; }
        public string? Suburb { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? SGCode { get; set; }
        public string? Status { get; set; }
        public string? Stage { get; set; }
        public int? StageNumber { get; set; }
        public bool? OmnibusServitude { get; set; }
        public string? BPApplicationID { get; set; }
        public string? BPApplicationType { get; set; }
        public string? ApplicationType { get; set; }
        public bool? isCombinedApplication { get; set; }
        public string? NameOfCompany { get; set; }
        public string? RegNoOfCompany { get; set; }
        public string? NameOfAgent { get; set; }
        public string? AgentCellNo { get; set; }
        public string? AgentEmail { get; set; }
        public string? AgentPostalAddress { get; set; }
        public string? DescriptionOfProject { get; set; }
        public string? SupportingDocuments { get; set; }
        
    }
}
