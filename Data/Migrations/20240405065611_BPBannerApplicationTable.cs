using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPBannerApplicationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BPBannerApplication",
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
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeOfAdvert = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NatureOfEvent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionOfAdvert = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NameOfEvent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SizeOfPoster = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumberOfPosters = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationFee = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_BPBannerApplication", x => x.ApplicationID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BPBannerApplication");
        }
    }
}
