using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class AlternateContactDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
/*            migrationBuilder.AddColumn<string>(
                name: "AlternateEmail",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AlternateNumber",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
/*            migrationBuilder.DropColumn(
                name: "AlternateEmail",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "AlternateNumber",
                table: "UserProfilesTable");*/
        }
    }
}
