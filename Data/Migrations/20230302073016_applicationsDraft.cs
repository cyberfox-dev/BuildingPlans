using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class applicationsDraft : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StageID",
                table: "MandatoryDocumentUploads");

            migrationBuilder.AddColumn<bool>(
                name: "isDrafted",
                table: "ApplicationListDTO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isDrafted",
                table: "Application",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isDrafted",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "isDrafted",
                table: "Application");

            migrationBuilder.AddColumn<int>(
                name: "StageID",
                table: "MandatoryDocumentUploads",
                type: "int",
                nullable: true);
        }
    }
}
