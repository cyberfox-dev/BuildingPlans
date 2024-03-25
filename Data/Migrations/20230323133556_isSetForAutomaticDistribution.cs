using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class isSetForAutomaticDistribution : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*  migrationBuilder.AddColumn<bool>(
                  name: "isSetForAutomaticDistribution",
                  table: "SubDepartmentsTable",
                  type: "bit",
                  nullable: true);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*  migrationBuilder.DropColumn(
                  name: "isSetForAutomaticDistribution",
                  table: "SubDepartmentsTable");*/
        }
    }
}
