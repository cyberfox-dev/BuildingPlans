using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class hasSub : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VatNumber",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubDepartmentAdminUserID",
                table: "SubDepartmentsTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "hasSubDepartment",
                table: "DepartmentsTable",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationStatus",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentStageName",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentStageNumber",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CurrentStageStartDate",
                table: "ApplicationListDTO",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NextStageName",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NextStageNumber",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousStageName",
                table: "ApplicationListDTO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PreviousStageNumber",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VatNumber",
                table: "UserProfilesTable");

            migrationBuilder.DropColumn(
                name: "SubDepartmentAdminUserID",
                table: "SubDepartmentsTable");

            migrationBuilder.DropColumn(
                name: "hasSubDepartment",
                table: "DepartmentsTable");

            migrationBuilder.DropColumn(
                name: "ApplicationStatus",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "CurrentStageName",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "CurrentStageNumber",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "CurrentStageStartDate",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "NextStageName",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "NextStageNumber",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "PreviousStageName",
                table: "ApplicationListDTO");

            migrationBuilder.DropColumn(
                name: "PreviousStageNumber",
                table: "ApplicationListDTO");
        }
    }
}
