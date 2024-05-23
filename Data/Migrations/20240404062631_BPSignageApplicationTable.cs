using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPSignageApplicationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentStage",
                table: "BPDemolitionApplication",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NextStage",
                table: "BPDemolitionApplication",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousStage",
                table: "BPDemolitionApplication",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BPSignageApplication",
                columns: table => new
                {
                    ApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrganisationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantCell = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantTelephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantFax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AddressType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NatureOfAdvertisement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AreasOfControl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Height = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Width = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NoOfFaces = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApplicationFee = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MonthlyFee = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Voltage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ElectrictyRequired = table.Column<bool>(type: "bit", nullable: true),
                    EnvironmentalImpactAssessment = table.Column<bool>(type: "bit", nullable: true),
                    AdvertisingSignRight = table.Column<bool>(type: "bit", nullable: true),
                    Encroachment = table.Column<bool>(type: "bit", nullable: true),
                    PreviousStage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CurrentStage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NextStage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPSignageApplication", x => x.ApplicationID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BPSignageApplication");

            migrationBuilder.DropColumn(
                name: "CurrentStage",
                table: "BPDemolitionApplication");

            migrationBuilder.DropColumn(
                name: "NextStage",
                table: "BPDemolitionApplication");

            migrationBuilder.DropColumn(
                name: "PreviousStage",
                table: "BPDemolitionApplication");
        }
    }
}
