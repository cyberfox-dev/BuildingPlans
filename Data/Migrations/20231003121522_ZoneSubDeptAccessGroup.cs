using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class ZoneSubDeptAccessGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubDepartmentID",
                table: "AccessGroupUserLink",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoneID",
                table: "AccessGroupUserLink",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubDepartmentID",
                table: "AccessGroupUserLink");

            migrationBuilder.DropColumn(
                name: "ZoneID",
                table: "AccessGroupUserLink");
        }
    }
}
