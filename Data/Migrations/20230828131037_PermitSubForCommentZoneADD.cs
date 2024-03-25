using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class PermitSubForCommentZoneADD : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ZoneID",
                table: "PermitSubForComment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoneName",
                table: "PermitSubForComment",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ZoneID",
                table: "PermitSubForComment");

            migrationBuilder.DropColumn(
                name: "ZoneName",
                table: "PermitSubForComment");
        }
    }
}
