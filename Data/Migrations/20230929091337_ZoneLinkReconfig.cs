using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ZoneLinkReconfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SubDepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "SubDepartmentName",
                table: "ZoneLinkTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoneName",
                table: "ZoneLinkTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDepartmentAdmin",
                table: "ZoneLinkTable",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isZoneAdmin",
                table: "ZoneLinkTable",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubDepartmentName",
                table: "ZoneLinkTable");

            migrationBuilder.DropColumn(
                name: "ZoneName",
                table: "ZoneLinkTable");

            migrationBuilder.DropColumn(
                name: "isDepartmentAdmin",
                table: "ZoneLinkTable");

            migrationBuilder.DropColumn(
                name: "isZoneAdmin",
                table: "ZoneLinkTable");

            migrationBuilder.AlterColumn<int>(
                name: "SubDepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
