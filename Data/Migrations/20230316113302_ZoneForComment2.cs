using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class ZoneForComment2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.CreateTable(
                 name: "ZoneForComment",
                 columns: table => new
                 {
                     ZoneForCommentID = table.Column<int>(type: "int", nullable: false)
                         .Annotation("SqlServer:Identity", "1, 1"),
                     ApplicationID = table.Column<int>(type: "int", nullable: true),
                     SubDepartmentID = table.Column<int>(type: "int", nullable: true),
                     ZoneID = table.Column<int>(type: "int", nullable: true),
                     ZoneName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     isActive = table.Column<bool>(type: "bit", nullable: false)
                 },
                 constraints: table =>
                 {
                     table.PrimaryKey("PK_ZoneForComment", x => x.ZoneForCommentID);
                 });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropTable(
                 name: "ZoneForComment");*/
        }
    }
}
