using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class DocumentRepositoryTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "ZoneID",
            //    table: "DocumentUpload");

            //migrationBuilder.CreateTable(
            //    name: "DocumentsRepository",
            //    columns: table => new
            //    {
            //        DocumentsRepositoryID = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        DocumentsCategory = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        DepartmentID = table.Column<int>(type: "int", nullable: true),
            //        DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //        isActive = table.Column<bool>(type: "bit", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_DocumentsRepository", x => x.DocumentsRepositoryID);
            //    });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "DocumentsRepository");

            //migrationBuilder.AddColumn<int>(
            //    name: "ZoneID",
            //    table: "DocumentUpload",
            //    type: "int",
            //    nullable: true);
        }
    }
}
