using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class IsArchitectColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isArchitect",
                table: "UserProfilesTable",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isArchitect",
                table: "UserProfilesTable");
        }
    }
}
