using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class subDepartmentLinkToComment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.CreateTable(
                 name: "Comments",
                 columns: table => new
                 {
                     CommentID = table.Column<int>(type: "int", nullable: false)
                         .Annotation("SqlServer:Identity", "1, 1"),
                     ApplicationID = table.Column<int>(type: "int", nullable: true),
                     Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     SubDepartmentForCommentID = table.Column<int>(type: "int", nullable: true),
                     DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     isActive = table.Column<bool>(type: "bit", nullable: false)
                 },
                 constraints: table =>
                 {
                     table.PrimaryKey("PK_Comments", x => x.CommentID);
                 });

             migrationBuilder.CreateTable(
                 name: "SubDepartmentForComment",
                 columns: table => new
                 {
                     SubDepartmentForCommentID = table.Column<int>(type: "int", nullable: false)
                         .Annotation("SqlServer:Identity", "1, 1"),
                     ApplicationID = table.Column<int>(type: "int", nullable: true),
                     SubDepartmentID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     SubDepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     UserAssaignedToComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     CommentStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     isAwaitingClarity = table.Column<bool>(type: "bit", nullable: true),
                     IsRefered = table.Column<bool>(type: "bit", nullable: true),
                     ReferedToUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     isActive = table.Column<bool>(type: "bit", nullable: false)
                 },
                 constraints: table =>
                 {
                     table.PrimaryKey("PK_SubDepartmentForComment", x => x.SubDepartmentForCommentID);
                 });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*  migrationBuilder.DropTable(
                  name: "Comments");

              migrationBuilder.DropTable(
                  name: "SubDepartmentForComment");*/
        }
    }
}
