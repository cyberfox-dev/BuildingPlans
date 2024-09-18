using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPApplicationsTableAddedOtherCols : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SupportingDocuments",
                table: "BuildingApplications",
                newName: "ValueOfProperty");

            migrationBuilder.RenameColumn(
                name: "NameOfAgent",
                table: "BuildingApplications",
                newName: "TypeOfExcavation");

            migrationBuilder.RenameColumn(
                name: "AgentPostalAddress",
                table: "BuildingApplications",
                newName: "TitleRestrictions");

            migrationBuilder.RenameColumn(
                name: "AgentEmail",
                table: "BuildingApplications",
                newName: "TitleDeedNo");

            migrationBuilder.RenameColumn(
                name: "AgentCellNo",
                table: "BuildingApplications",
                newName: "SizeOfApplication");

            migrationBuilder.AddColumn<string>(
                name: "ExtentOfProperty",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NatureOfWorks",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegisteredDescription",
                table: "BuildingApplications",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtentOfProperty",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "NatureOfWorks",
                table: "BuildingApplications");

            migrationBuilder.DropColumn(
                name: "RegisteredDescription",
                table: "BuildingApplications");

            migrationBuilder.RenameColumn(
                name: "ValueOfProperty",
                table: "BuildingApplications",
                newName: "SupportingDocuments");

            migrationBuilder.RenameColumn(
                name: "TypeOfExcavation",
                table: "BuildingApplications",
                newName: "NameOfAgent");

            migrationBuilder.RenameColumn(
                name: "TitleRestrictions",
                table: "BuildingApplications",
                newName: "AgentPostalAddress");

            migrationBuilder.RenameColumn(
                name: "TitleDeedNo",
                table: "BuildingApplications",
                newName: "AgentEmail");

            migrationBuilder.RenameColumn(
                name: "SizeOfApplication",
                table: "BuildingApplications",
                newName: "AgentCellNo");
        }
    }
}
