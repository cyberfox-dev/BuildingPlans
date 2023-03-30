using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class isDepartmentAdmin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          /*  migrationBuilder.AddColumn<string>(
                name: "VatNumber",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDepartmentAdmin",
                table: "UserProfilesTable",
                type: "bit",
                nullable: false,
                defaultValue: false);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
           /* migrationBuilder.DropColumn(
                name: "VatNumber",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "isDepartmentAdmin",
                table: "UserProfilesTable");*/
        }
    }
}
