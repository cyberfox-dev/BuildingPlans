using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPApplicationsTableUpdateAddedTownPlanningFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AgentCellNo",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AgentEmail",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AgentPostalAddress",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationType",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BPApplicationType",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionOfProject",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameOfAgent",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameOfCompany",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegNoOfCompany",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupportingDocuments",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isCombinedApplication",
                table: "BuildingApplications",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgentCellNo",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "AgentEmail",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "AgentPostalAddress",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "ApplicationType",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "BPApplicationType",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "DescriptionOfProject",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "NameOfAgent",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "NameOfCompany",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "RegNoOfCompany",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "SupportingDocuments",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "isCombinedApplication",
                table: "BuildingApplications");
        }
    }
}
