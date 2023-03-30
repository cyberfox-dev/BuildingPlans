using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class ManDoc_ServiceItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           /* migrationBuilder.CreateTable(
                name: "MandatoryDocumentStageLink",
                columns: table => new
                {
                    MandatoryDocumentStageLinkID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MandatoryDocumentID = table.Column<int>(type: "int", nullable: true),
                    StageID = table.Column<int>(type: "int", nullable: false),
                    StageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MandatoryDocumentStageLink", x => x.MandatoryDocumentStageLinkID);
                });

            migrationBuilder.CreateTable(
                name: "ServiceItem",
                columns: table => new
                {
                    ServiceItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceItemCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rate = table.Column<int>(type: "int", nullable: true),
                    TotalVat = table.Column<int>(type: "int", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceItem", x => x.ServiceItemID);
                });*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
           /* migrationBuilder.DropTable(
                name: "MandatoryDocumentStageLink");

            migrationBuilder.DropTable(
                name: "ServiceItem");*/
        }
    }
}
