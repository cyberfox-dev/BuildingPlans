using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class HasSuperVisionFee : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "MoveToPaidDate",
                table: "PermitSubForComment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "hasSuperVisionFee",
                table: "PermitSubForComment",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoveToPaidDate",
                table: "PermitSubForComment");

            migrationBuilder.DropColumn(
                name: "hasSuperVisionFee",
                table: "PermitSubForComment");
        }
    }
}
