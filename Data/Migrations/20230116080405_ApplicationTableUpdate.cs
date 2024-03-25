using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class ApplicationTableUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.AlterColumn<int>(
                name: "PreviousStageNumber",
                table: "Application",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "NextStageNumber",
                table: "Application",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.AlterColumn<string>(
                 name: "PreviousStageNumber",
                 table: "Application",
                 type: "nvarchar(max)",
                 nullable: true,
                 oldClrType: typeof(int),
                 oldType: "int",
                 oldNullable: true);

             migrationBuilder.AlterColumn<string>(
                 name: "NextStageNumber",
                 table: "Application",
                 type: "nvarchar(max)",
                 nullable: true,
                 oldClrType: typeof(int),
                 oldType: "int",
                 oldNullable: true);*/
        }
    }
}
