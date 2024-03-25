using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class mess : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
      name: "Message",
      table: "Notification",
      type: "nvarchar(max)",
      nullable: true);
            migrationBuilder.AddColumn<string>(
           name: "DescriptionForRepoDoc",
           table: "DocumentUpload",
           type: "nvarchar(max)",
           nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
               name: "Message",
               table: "Notification"); migrationBuilder.DropColumn(
                name: "Message",
                table: "Notification");
            migrationBuilder.DropColumn(
               name: "DescriptionForRepoDoc",
               table: "DocumentUpload");
        }

    }
}
