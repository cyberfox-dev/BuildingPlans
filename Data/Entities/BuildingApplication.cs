using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BuildingPlans.Data.Entities
{
    public class BuildingApplication : BaseEntity
    {
        [Key]
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
        public string? ArchitectUserID { get; set; }
        public string? BuildingPlanFor { get; set; }
        public string? TypeOfDevelopment { get; set; }
        public string? TotalArea { get; set; }
        public string? OccupationClassification { get; set; }
        public string? PlanFees { get; set; }
        public string? PropertyValue { get; set; }

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
    }
}
