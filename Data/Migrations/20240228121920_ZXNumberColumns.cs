using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ZXNumberColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.AddColumn<string>(
                name: "RIMZXNumber",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaterZXNumber",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);*/

            migrationBuilder.AddColumn<string>(
                name: "RIMZXNumber",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaterZXNumber",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
/*            migrationBuilder.DropColumn(
                name: "RIMZXNumber",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "WaterZXNumber",
                table: "ApplicationListDTO");*/

            migrationBuilder.DropColumn(
                name: "RIMZXNumber",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "WaterZXNumber",
                table: "Application");
        }
    }
}
