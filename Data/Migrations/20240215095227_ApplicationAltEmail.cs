using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class ApplicationAltEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.AddColumn<string>(
                 name: "AlternativeEmail",
                 table: "ApplicationListDTO",
                 type: "nvarchar(max)",
                 nullable: true);*/

            migrationBuilder.AddColumn<string>(
                name: "AlternativeEmail",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropColumn(
                 name: "AlternativeEmail",
                 table: "ApplicationListDTO");*/

            migrationBuilder.DropColumn(
                name: "AlternativeEmail",
                table: "Application");
        }
    }
}
