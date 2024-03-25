using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class CommentBuilder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.CreateTable(
                 name: "CommentBuilder",
                 columns: table => new
                 {
                     CommentID = table.Column<int>(type: "int", nullable: false)
                         .Annotation("SqlServer:Identity", "1, 1"),
                     CommentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     isActive = table.Column<bool>(type: "bit", nullable: false)
                 },
                 constraints: table =>
                 {
                     table.PrimaryKey("PK_CommentBuilder", x => x.CommentID);
                 });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropTable(
                 name: "CommentBuilder");*/
        }
    }
}
