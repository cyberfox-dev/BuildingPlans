using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class UpdateProfessionals : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IDNumber",
                table: "ProfessionalsTable",
                newName: "IdNumber");

            migrationBuilder.AddColumn<string>(
                name: "IdNumber",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IdNumber",
                table: "ProfessionalsTable",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "CIDRating",
                table: "ProfessionalsTable",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdNumber",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "CIDRating",
                table: "ProfessionalsTable");

            migrationBuilder.RenameColumn(
                name: "IdNumber",
                table: "ProfessionalsTable",
                newName: "IDNumber");

            migrationBuilder.AlterColumn<int>(
                name: "IDNumber",
                table: "ProfessionalsTable",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
