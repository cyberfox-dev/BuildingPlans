using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class SP_GetUsersNotLinkedByUserID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"CREATE PROCEDURE [dbo].[SP_GetUsersNotLinkedByUserID]
                   
                AS
                BEGIN
                    SET NOCOUNT ON;
                   SELECT * FROM AspNetUsers
LEFT JOIN ZoneLinkTable
ON AspNetUsers.Id = ZoneLinkTable.AssignedUserID
WHERE ZoneLinkTable.AssignedUserID IS NULL OR ZoneLinkTable.isActive=0;
                END";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
