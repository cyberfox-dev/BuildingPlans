using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class subDepartmentLinkToComment2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.AlterColumn<int>(
                 name: "SubDepartmentID",
                 table: "SubDepartmentForComment",
                 type: "int",
                 nullable: true,
                 oldClrType: typeof(string),
                 oldType: "nvarchar(max)",
                 oldNullable: true);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*  migrationBuilder.AlterColumn<string>(
                  name: "SubDepartmentID",
                  table: "SubDepartmentForComment",
                  type: "nvarchar(max)",
                  nullable: true,
                  oldClrType: typeof(int),
                  oldType: "int",
                  oldNullable: true);*/
        }
    }
}
