﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class DescriptionColForDocumentRepo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "DescriptionForRepoDoc",
            //    table: "DocumentUpload",
            //    type: "nvarchar(max)",
            //    nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ZoneID",
                table: "ApplicationListDTO",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //      name: "DescriptionForRepoDoc",
            //      table: "DocumentUpload");

            migrationBuilder.DropColumn(
                name: "ZoneID",
                table: "ApplicationListDTO");
        }
    }
}
