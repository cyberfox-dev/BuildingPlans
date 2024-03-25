using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class PermitDocs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentLocalPath",
                table: "PermitSubForComment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermitDocName",
                table: "PermitSubForComment",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentLocalPath",
                table: "PermitSubForComment");

            migrationBuilder.DropColumn(
                name: "PermitDocName",
                table: "PermitSubForComment");
        }
    }
}
