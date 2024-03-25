using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class UserProfileActingDepartment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlternativePhoneNumber",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DepartmentName",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ICASALicense",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SurnameName",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDefault",
                table: "UserProfilesTable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "zoneName",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserProfileID",
                table: "AccessGroupUserLink",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlternativePhoneNumber",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "DepartmentName",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "ICASALicense",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "SurnameName",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "isDefault",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "zoneName",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "UserProfileID",
                table: "AccessGroupUserLink");
        }
    }
}
