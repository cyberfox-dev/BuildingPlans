using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class PermitSupervisionFee : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SupervisionFee",
                table: "PermitSubForComment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isPaid",
                table: "PermitSubForComment",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SupervisionFee",
                table: "PermitSubForComment");

            migrationBuilder.DropColumn(
                name: "isPaid",
                table: "PermitSubForComment");
        }
    }
}
