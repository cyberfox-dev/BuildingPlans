using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class applicationsupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "escalateDate",
                table: "Application",
                newName: "RejectCount");

            migrationBuilder.AddColumn<string>(
                name: "WBS",
                table: "DepositRequired",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "escalateDate",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectNumber",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WBS",
                table: "DepositRequired");

            migrationBuilder.DropColumn(
                name: "escalateDate",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "ProjectNumber",
                table: "Application");

            migrationBuilder.RenameColumn(
                name: "RejectCount",
                table: "Application",
                newName: "escalateDate");
        }
    }
}
