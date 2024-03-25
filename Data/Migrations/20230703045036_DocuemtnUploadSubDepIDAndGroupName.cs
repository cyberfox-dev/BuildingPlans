using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class DocuemtnUploadSubDepIDAndGroupName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentGroupName",
                table: "DocumentUpload",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubDepartmentID",
                table: "DocumentUpload",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentGroupName",
                table: "DocumentUpload");

            migrationBuilder.DropColumn(
                name: "SubDepartmentID",
                table: "DocumentUpload");
        }
    }
}
