using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class SubDepartmentsMapLayerIDAdd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MapLayerID",
                table: "SubDepartmentsTable",
                type: "int",
                nullable: true);

            //migrationBuilder.AddColumn<DateTime>(
            //    name: "permitStartDate",
            //    table: "ApplicationListDTO",
            //    type: "datetime2",
            //    nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MapLayerID",
                table: "SubDepartmentsTable");

            //migrationBuilder.DropColumn(
            //    name: "permitStartDate",
            //    table: "ApplicationListDTO");
        }
    }
}
