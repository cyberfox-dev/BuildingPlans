using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class isGISReviewer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GISReviewerUserID",
                table: "SubDepartmentForComment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isGISReviewing",
                table: "SubDepartmentForComment",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GISReviewerUserID",
                table: "SubDepartmentForComment");

            migrationBuilder.DropColumn(
                name: "isGISReviewing",
                table: "SubDepartmentForComment");
        }
    }
}
