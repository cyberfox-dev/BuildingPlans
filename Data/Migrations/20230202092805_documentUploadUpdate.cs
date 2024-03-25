using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class documentUploadUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropColumn(
                 name: "DocumentData",
                 table: "DocumentUpload");

             migrationBuilder.AddColumn<string>(
                 name: "DocumentLocalPath",
                 table: "DocumentUpload",
                 type: "nvarchar(max)",
                 nullable: true);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.DropColumn(
                 name: "DocumentLocalPath",
                 table: "DocumentUpload");

             migrationBuilder.AddColumn<byte[]>(
                 name: "DocumentData",
                 table: "DocumentUpload",
                 type: "varbinary(max)",
                 nullable: true);*/
        }
    }
}
