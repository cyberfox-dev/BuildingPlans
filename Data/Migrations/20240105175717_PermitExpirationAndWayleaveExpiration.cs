using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class PermitExpirationAndWayleaveExpiration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PermitExpiration",
                table: "SubDepartmentsTable",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WayleaveExpiration",
                table: "SubDepartmentsTable",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermitExpiration",
                table: "SubDepartmentsTable");

            migrationBuilder.DropColumn(
                name: "WayleaveExpiration",
                table: "SubDepartmentsTable");
        }
    }
}
