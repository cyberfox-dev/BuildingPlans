using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class UserProfileActingDepartmentAltEmail2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SurnameName",
                table: "UserProfilesTable",
                newName: "Surname");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Surname",
                table: "UserProfilesTable",
                newName: "SurnameName");
        }
    }
}
