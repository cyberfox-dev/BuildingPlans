using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class Financial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Financial",
                columns: table => new
                {
                    FinancialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FinancialName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FinancialType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentLocalPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationID = table.Column<int>(type: "int", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Financial", x => x.FinancialID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Financial");
        }
    }
}
