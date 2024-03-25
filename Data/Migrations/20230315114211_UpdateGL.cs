using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class UpdateGL : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*  migrationBuilder.AddColumn<int>(
                  name: "DepartmentID",
                  table: "GLCode",
                  type: "int",
                  nullable: true);

              migrationBuilder.AddColumn<string>(
                  name: "DepartmentName",
                  table: "GLCode",
                  type: "nvarchar(max)",
                  nullable: true);

              migrationBuilder.AddColumn<string>(
                  name: "ProfitCenter",
                  table: "GLCode",
                  type: "nvarchar(max)",
                  nullable: true);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropColumn(
                 name: "DepartmentID",
                 table: "GLCode");

             migrationBuilder.DropColumn(
                 name: "DepartmentName",
                 table: "GLCode");

             migrationBuilder.DropColumn(
                 name: "ProfitCenter",
                 table: "GLCode");*/
        }
    }
}
