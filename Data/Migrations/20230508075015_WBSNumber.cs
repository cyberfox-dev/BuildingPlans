using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class WBSNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectNumber",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RejectCount",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectNumber",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "RejectCount",
                table: "ApplicationListDTO");
        }
    }
}
