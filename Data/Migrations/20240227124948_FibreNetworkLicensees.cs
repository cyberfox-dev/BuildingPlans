using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class FibreNetworkLicensees : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "DepositRequired",
                type: "int",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

           /* migrationBuilder.AddColumn<bool>(
                name: "NetworkLicenses",
                table: "ApplicationListDTO",
                type: "bit",
                nullable: true);*/

            migrationBuilder.AddColumn<bool>(
                name: "NetworkLicenses",
                table: "Application",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
/*            migrationBuilder.DropColumn(
                name: "NetworkLicenses",
                table: "ApplicationListDTO");*/

            migrationBuilder.DropColumn(
                name: "NetworkLicenses",
                table: "Application");

            migrationBuilder.AlterColumn<double>(
                name: "Quantity",
                table: "DepositRequired",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
