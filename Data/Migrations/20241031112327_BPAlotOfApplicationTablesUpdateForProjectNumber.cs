using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPAlotOfApplicationTablesUpdateForProjectNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NextStage",
                table: "BPSignageApplication",
                newName: "ProjectNumber");

            migrationBuilder.RenameColumn(
                name: "NextStage",
                table: "BPDemolitionApplication",
                newName: "ProjectNumber");

            migrationBuilder.RenameColumn(
                name: "NextStage",
                table: "BPBannerApplication",
                newName: "ProjectNumber");

            migrationBuilder.AddColumn<string>(
                name: "ProjectNumber",
                table: "BPFlagApplication",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectNumber",
                table: "BPFlagApplication");

            migrationBuilder.RenameColumn(
                name: "ProjectNumber",
                table: "BPSignageApplication",
                newName: "NextStage");

            migrationBuilder.RenameColumn(
                name: "ProjectNumber",
                table: "BPDemolitionApplication",
                newName: "NextStage");

            migrationBuilder.RenameColumn(
                name: "ProjectNumber",
                table: "BPBannerApplication",
                newName: "NextStage");
        }
    }
}
