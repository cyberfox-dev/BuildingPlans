using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class ProfessionalsLinks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
            //    name: "LinkedUserSpDTOs",
            //    columns: table => new
            //    {
            //        FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //        id = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //        ZoneLinkID = table.Column<int>(type: "int", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //    });

            //migrationBuilder.CreateTable(
            //    name: "ProfessionalsLink",
            //    columns: table => new
            //    {
            //        ProfessionalsLinkID = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        ApplicationID = table.Column<int>(type: "int", nullable: true),
            //        ProfessionalID = table.Column<int>(type: "int", nullable: true),
            //        DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        isActive = table.Column<bool>(type: "bit", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_ProfessionalsLink", x => x.ProfessionalsLinkID);
            //    });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "LinkedUserSpDTOs");

            //migrationBuilder.DropTable(
            //    name: "ProfessionalsLink");
        }
    }
}
