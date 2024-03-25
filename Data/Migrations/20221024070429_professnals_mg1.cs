using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class professnals_mg1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProfessionalsTable",
                columns: table => new
                {
                    ProfessinalID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfessinalType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BP_Number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BpVerified = table.Column<bool>(type: "bit", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfessionalRegNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppUserID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalsTable", x => x.ProfessinalID);
                    table.ForeignKey(
                        name: "FK_ProfessionalsTable_AspNetUsers_AppUserID",
                        column: x => x.AppUserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfilesTable",
                columns: table => new
                {
                    UserProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isInternal = table.Column<bool>(type: "bit", nullable: false),
                    BP_Number = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompanyRegNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhyscialAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Directorate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentID = table.Column<int>(type: "int", nullable: true),
                    SubDepartmentID = table.Column<int>(type: "int", nullable: true),
                    Branch = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CostCenterNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CostCenterOwner = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CopyOfID = table.Column<byte>(type: "tinyint", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfilesTable", x => x.UserProfileID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalsTable_AppUserID",
                table: "ProfessionalsTable",
                column: "AppUserID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfessionalsTable");

            migrationBuilder.DropTable(
                name: "UserProfilesTable");
        }
    }
}
