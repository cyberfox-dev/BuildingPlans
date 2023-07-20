using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class MDCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GLCode",
                table: "SubDepartmentsTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfitCentre",
                table: "SubDepartmentsTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MandatoryDocumentCategory",
                table: "MandatoryDocumentUploads",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GLCode",
                table: "SubDepartmentsTable");

            migrationBuilder.DropColumn(
                name: "ProfitCentre",
                table: "SubDepartmentsTable");

            migrationBuilder.DropColumn(
                name: "MandatoryDocumentCategory",
                table: "MandatoryDocumentUploads");
        }
    }
}
