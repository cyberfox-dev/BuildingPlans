using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ConfigUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FinalApproval",
                table: "SubDepartmentForComment",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UtilitySlot1",
                table: "Config",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UtilitySlot2",
                table: "Config",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UtilitySlot3",
                table: "Config",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalApproval",
                table: "SubDepartmentForComment");

            migrationBuilder.DropColumn(
                name: "UtilitySlot1",
                table: "Config");

            migrationBuilder.DropColumn(
                name: "UtilitySlot2",
                table: "Config");

            migrationBuilder.DropColumn(
                name: "UtilitySlot3",
                table: "Config");
        }
    }
}
