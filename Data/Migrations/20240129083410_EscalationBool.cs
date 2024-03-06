using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class EscalationBool : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReApplyCount",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isEscalated",
                table: "ApplicationListDTO",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isEscalated",
                table: "Application",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReApplyCount",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "isEscalated",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "isEscalated",
                table: "Application");
        }
    }
}
