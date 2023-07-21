using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class depositRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ServiceItemCode",
                table: "DepositRequired",
                newName: "Remarks");

            migrationBuilder.AddColumn<int>(
                name: "ServiceItemCodeID",
                table: "DepositRequired",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalAmount",
                table: "DepositRequired",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceItemCodeID",
                table: "DepositRequired");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "DepositRequired");

            migrationBuilder.RenameColumn(
                name: "Remarks",
                table: "DepositRequired",
                newName: "ServiceItemCode");
        }
    }
}
