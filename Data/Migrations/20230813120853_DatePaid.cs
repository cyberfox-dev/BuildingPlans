using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class DatePaid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "Email",
            //    table: "LinkedUserSpDTOs",
            //    type: "nvarchar(max)",
            //    nullable: false,
            //    defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DatePaid",
                table: "ApplicationListDTO",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DatePaid",
                table: "Application",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "Email",
            //    table: "LinkedUserSpDTOs");

            migrationBuilder.DropColumn(
                name: "DatePaid",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "DatePaid",
                table: "Application");
        }
    }
}
