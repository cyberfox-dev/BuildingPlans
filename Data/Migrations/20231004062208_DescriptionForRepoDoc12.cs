using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class DescriptionForRepoDoc12 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionForRepoDoc",
                table: "DocumentUpload",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
               name: "DescriptionForRepoDoc",
               table: "DocumentUpload");
        }
    }
}
