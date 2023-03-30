using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ApplicationStages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.DropColumn(
                name: "ApplicatantType",
                table: "Application");

            migrationBuilder.CreateTable(
                name: "ApplicationListDTO",
                columns: table => new
                {
                    ApplicationID = table.Column<int>(type: "int", nullable: true),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhysicalAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReferenceNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompanyRegNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeOfApplication = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotificationNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WBSNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhysicalAddressOfProject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionOfProject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NatureOfWork = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExcavationType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpectedStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpectedEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.DropTable(
                name: "ApplicationListDTO");

            migrationBuilder.AddColumn<string>(
                name: "ApplicatantType",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);*/
        }
    }
}
