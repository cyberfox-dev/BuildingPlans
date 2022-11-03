using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class UpdateProfessionals1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CIDRating",
                table: "ProfessionalsTable",
                newName: "CIBRating");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CIBRating",
                table: "ProfessionalsTable",
                newName: "CIDRating");
        }
    }
}
