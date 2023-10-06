using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WayleaveManagementSystem.Data.Migrations
{
    public partial class CompanyTypeAndReferenceNum : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //        migrationBuilder.AddColumn<string>(
            //         name: "companyType",
            //table: "UserProfilesTable",
            //type: "nvarchar(max)",
            //nullable: true);

            //        migrationBuilder.AddColumn<string>(
            //            name: "refNumber",
            //            table: "UserProfilesTable",
            //            type: "nvarchar(max)",
            //            nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
    //        migrationBuilder.DropColumn(
    //         name: "companyType",
    //table: "UserProfilesTable");

    //        migrationBuilder.DropColumn(
    //            name: "refNumber",
    //            table: "UserProfilesTable");
        }
    }
}
