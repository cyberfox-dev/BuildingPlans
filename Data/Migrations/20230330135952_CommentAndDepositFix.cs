using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class CommentAndDepositFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ApplicationID",
                table: "Notification",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceItemCode",
                table: "DepositRequired",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubDepartmentName",
                table: "DepositRequired",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubDepartmentID",
                table: "Comments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubDepartmentName",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceItemCode",
                table: "DepositRequired");

            migrationBuilder.DropColumn(
                name: "SubDepartmentName",
                table: "DepositRequired");

            migrationBuilder.DropColumn(
                name: "SubDepartmentID",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "SubDepartmentName",
                table: "Comments");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationID",
                table: "Notification",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
