using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ApplicationStagesNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationStatus",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentStageName",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentStageNumber",
                table: "Application",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CurrentStageStartDate",
                table: "Application",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NextStageName",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NextStageNumber",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousStageName",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousStageNumber",
                table: "Application",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationStatus",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "CurrentStageName",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "CurrentStageNumber",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "CurrentStageStartDate",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "NextStageName",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "NextStageNumber",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "PreviousStageName",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "PreviousStageNumber",
                table: "Application");
        }
    }
}
