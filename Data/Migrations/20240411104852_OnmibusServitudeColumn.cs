using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class OnmibusServitudeColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OmnibusServitude",
                table: "BuildingApplications",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OmnibusServitude",
                table: "BuildingApplications");
        }
    }
}
