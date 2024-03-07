using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class applicationsDepartmentsEdit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "needsZXNumber",
                table: "DepartmentsTable",
                type: "bit",
                nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "ContractorAccountDetails",
            //    table: "ApplicationListDTO",
            //    type: "nvarchar(max)",
            //    nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContractorAccountDetails",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "needsZXNumber",
                table: "DepartmentsTable");

            //migrationBuilder.DropColumn(
            //    name: "ContractorAccountDetails",
            //    table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "ContractorAccountDetails",
                table: "Application");
        }
    }
}
