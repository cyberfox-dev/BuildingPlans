using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class subDepartmentTableUpdateForGLCodeAndProfitCenter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GlCode",
                table: "SubDepartmentsTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfitCenter",
                table: "SubDepartmentsTable",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GlCode",
                table: "SubDepartmentsTable");

            migrationBuilder.DropColumn(
                name: "ProfitCenter",
                table: "SubDepartmentsTable");
        }
    }
}
