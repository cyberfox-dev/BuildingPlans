using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class EscalationDates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<DateTime>(
            //    name: "EMBActionDate",
            //    table: "ApplicationListDTO",
            //    type: "datetime2",
            //    nullable: true);

            //migrationBuilder.AddColumn<DateTime>(
            //    name: "EscalationDate",
            //    table: "ApplicationListDTO",
            //    type: "datetime2",
            //    nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EMBActionDate",
                table: "Application",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EscalationDate",
                table: "Application",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "EMBActionDate",
            //    table: "ApplicationListDTO");

            //migrationBuilder.DropColumn(
            //    name: "EscalationDate",
            //    table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "EMBActionDate",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "EscalationDate",
                table: "Application");
        }
    }
}
