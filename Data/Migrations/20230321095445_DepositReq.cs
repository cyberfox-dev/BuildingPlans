using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class DepositReq : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.CreateTable(
                 name: "DepositRequired",
                 columns: table => new
                 {
                     DepositRequiredID = table.Column<int>(type: "int", nullable: false)
                         .Annotation("SqlServer:Identity", "1, 1"),
                     ApplicationID = table.Column<int>(type: "int", nullable: true),
                     Desciption = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     SubDepartmentForCommentID = table.Column<int>(type: "int", nullable: true),
                     SubDepartmentID = table.Column<int>(type: "int", nullable: true),
                     Rate = table.Column<int>(type: "int", nullable: true),
                     Quantity = table.Column<int>(type: "int", nullable: true),
                     DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                     CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                     isActive = table.Column<bool>(type: "bit", nullable: false)
                 },
                 constraints: table =>
                 {
                     table.PrimaryKey("PK_DepositRequired", x => x.DepositRequiredID);
                 });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropTable(
                 name: "DepositRequired");*/
        }
    }
}
