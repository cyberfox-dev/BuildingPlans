using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class FibreNetworkLicensee : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.AddColumn<bool>(
                 name: "isFNLConfirmation",
                 table: "ApplicationListDTO",
                 type: "bit",
                 nullable: true);*/

            migrationBuilder.AddColumn<bool>(
                name: "isFNLConfirmation",
                table: "Application",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*  migrationBuilder.DropColumn(
                  name: "isFNLConfirmation",
                  table: "ApplicationListDTO");*/

            migrationBuilder.DropColumn(
                name: "isFNLConfirmation",
                table: "Application");
        }
    }
}
