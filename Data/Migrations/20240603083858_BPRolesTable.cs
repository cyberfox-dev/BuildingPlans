using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BPRolesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccessGroupID",
                table: "BPAccessGroupRoleLink",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RoleID",
                table: "BPAccessGroupRoleLink",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BPRoles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoleType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoleDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPRoles", x => x.RoleID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BPRoles");

            migrationBuilder.DropColumn(
                name: "AccessGroupID",
                table: "BPAccessGroupRoleLink");

            migrationBuilder.DropColumn(
                name: "RoleID",
                table: "BPAccessGroupRoleLink");
        }
    }
}
