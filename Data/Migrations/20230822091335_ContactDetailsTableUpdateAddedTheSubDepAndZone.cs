using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ContactDetailsTableUpdateAddedTheSubDepAndZone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubDepartmentID",
                table: "ContactDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubDepartmentName",
                table: "ContactDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ZoneID",
                table: "ContactDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoneName",
                table: "ContactDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubDepartmentID",
                table: "ContactDetails");

            migrationBuilder.DropColumn(
                name: "SubDepartmentName",
                table: "ContactDetails");

            migrationBuilder.DropColumn(
                name: "ZoneID",
                table: "ContactDetails");

            migrationBuilder.DropColumn(
                name: "ZoneName",
                table: "ContactDetails");
        }
    }
}
