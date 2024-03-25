using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class isRepProjectSizeCheckListActType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectSizeCheckListActivityType",
                table: "ProjectSizeCheckList",
                type: "nvarchar(max)",
                nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Coordinates",
            //    table: "ApplicationListDTO",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<bool>(
            //    name: "WBSRequired",
            //    table: "ApplicationListDTO",
            //    type: "bit",
            //    nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectSizeCheckListActivityType",
                table: "ProjectSizeCheckList");

            //migrationBuilder.DropColumn(
            //    name: "Coordinates",
            //    table: "ApplicationListDTO");

            //migrationBuilder.DropColumn(
            //    name: "WBSRequired",
            //    table: "ApplicationListDTO");
        }
    }
}
