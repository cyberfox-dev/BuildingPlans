using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPFlagApplicationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BPFlagApplication",
                columns: table => new
                {
                    ApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantFax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantCell = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantTelephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PoleNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartPole = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndPole = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubjectMatter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NoOfFlags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NoOfAgents = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NatureOfAdvert = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlaceOfEvent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationFee = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPFlagApplication", x => x.ApplicationID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BPFlagApplication");
        }
    }
}
