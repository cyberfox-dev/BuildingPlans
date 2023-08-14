using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class SubForCommentZoneADD : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ZoneID",
                table: "SubDepartmentForComment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoneName",
                table: "SubDepartmentForComment",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ZoneID",
                table: "SubDepartmentForComment");

            migrationBuilder.DropColumn(
                name: "ZoneName",
                table: "SubDepartmentForComment");
        }
    }
}
