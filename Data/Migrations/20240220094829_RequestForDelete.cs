using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class RequestForDelete : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SupervisionFee",
                table: "PermitSubForComment");

            migrationBuilder.AddColumn<bool>(
                name: "RequestForDelete",
                table: "PermitSubForComment",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestForDelete",
                table: "PermitSubForComment");

            migrationBuilder.AddColumn<string>(
                name: "SupervisionFee",
                table: "PermitSubForComment",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
