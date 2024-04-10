using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPDemolitionApplication : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BPDemolitionApplication",
                columns: table => new
                {
                    DemolitionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MainMunicipality = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantIDNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantEmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantContactNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isPropertyOwner = table.Column<bool>(type: "bit", nullable: true),
                    OwnerIDNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerEmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerContactNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteERFNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteCadastralDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReasonForDemolition = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyUse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DemolitionFees = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPDemolitionApplication", x => x.DemolitionID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BPDemolitionApplication");
        }
    }
}
