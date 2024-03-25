using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class addedZonesToUserProfileTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "zoneID",
                table: "UserProfilesTable",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "zoneName",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "zoneID",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "zoneName",
                table: "UserProfilesTable");
        }
    }
}
