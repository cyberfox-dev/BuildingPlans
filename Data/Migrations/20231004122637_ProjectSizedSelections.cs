using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ProjectSizedSelections : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SubDepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            //migrationBuilder.AddColumn<string>(
            //    name: "SubDepartmentName",
            //    table: "ZoneLinkTable",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "ZoneName",
            //    table: "ZoneLinkTable",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<bool>(
            //    name: "isDepartmentAdmin",
            //    table: "ZoneLinkTable",
            //    type: "bit",
            //    nullable: true);

            //migrationBuilder.AddColumn<bool>(
            //    name: "isZoneAdmin",
            //    table: "ZoneLinkTable",
            //    type: "bit",
            //    nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubDepartmentName",
                table: "UserProfilesTable",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectSizedSelections",
                columns: table => new
                {
                    SelectionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserFullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationID = table.Column<int>(type: "int", nullable: true),
                    SelectedProject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectSizedSelections", x => x.SelectionID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectSizedSelections");

            migrationBuilder.DropColumn(
                name: "SubDepartmentName",
                table: "ZoneLinkTable");

            //migrationBuilder.DropColumn(
            //    name: "ZoneName",
            //    table: "ZoneLinkTable");

            //migrationBuilder.DropColumn(
            //    name: "isDepartmentAdmin",
            //    table: "ZoneLinkTable");

            //migrationBuilder.DropColumn(
            //    name: "isZoneAdmin",
            //    table: "ZoneLinkTable");

            migrationBuilder.DropColumn(
                name: "SubDepartmentName",
                table: "UserProfilesTable");

            migrationBuilder.AlterColumn<int>(
                name: "SubDepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentID",
                table: "ZoneLinkTable",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
