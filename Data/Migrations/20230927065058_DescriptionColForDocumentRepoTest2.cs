using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class DescriptionColForDocumentRepoTest2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
    name: "companyType",
    table: "UserProfilesTable",
    type: "nvarchar(max)",
    nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "refNumber",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ZoneID",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
    name: "companyType",
    table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "refNumber",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "ZoneID",
                table: "ApplicationListDTO");
        }
    }
}
