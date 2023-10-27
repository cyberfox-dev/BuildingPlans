using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class UserProfileActingDepartmentAltEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlternativeEmail",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlternativeEmail",
                table: "UserProfilesTable");
        }
    }
}
