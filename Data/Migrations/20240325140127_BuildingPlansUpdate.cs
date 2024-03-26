using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildingPlans.Data.Migrations
{
    public partial class BuildingPlansUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BPAccessGroupRoleLink",
                columns: table => new
                {
                    AccessGroupRoleLinkID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccessGroupName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPAccessGroupRoleLink", x => x.AccessGroupRoleLinkID);
                });

            migrationBuilder.CreateTable(
                name: "BPAccessGroups",
                columns: table => new
                {
                    AccessGroupID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccessGroupName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccessGroupDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPAccessGroups", x => x.AccessGroupID);
                });

            migrationBuilder.CreateTable(
                name: "BPAccessGroupsUserLinks",
                columns: table => new
                {
                    AccessGroupUserLinkID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccessGroupID = table.Column<int>(type: "int", nullable: true),
                    AccessGroupName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ZoneID = table.Column<int>(type: "int", nullable: true),
                    ZoneName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubdepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPAccessGroupsUserLinks", x => x.AccessGroupUserLinkID);
                });

            migrationBuilder.CreateTable(
                name: "BPAddressTypes",
                columns: table => new
                {
                    AddresTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPAddressTypes", x => x.AddresTypeID);
                });

            migrationBuilder.CreateTable(
                name: "BPDepartmentChecklists",
                columns: table => new
                {
                    ChecklistItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChecklistItem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPDepartmentChecklists", x => x.ChecklistItemID);
                });

            migrationBuilder.CreateTable(
                name: "BPDepartmentLinkTable",
                columns: table => new
                {
                    DepartmentLinkID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentID = table.Column<int>(type: "int", nullable: true),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignedUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isAdmin = table.Column<bool>(type: "bit", nullable: true),
                    AccessGroupName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccessGroupUserLinkID = table.Column<int>(type: "int", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPDepartmentLinkTable", x => x.DepartmentLinkID);
                });

            migrationBuilder.CreateTable(
                name: "BPDepartments",
                columns: table => new
                {
                    DepartmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    hasSubDepartment = table.Column<bool>(type: "bit", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPDepartments", x => x.DepartmentID);
                });

            migrationBuilder.CreateTable(
                name: "BPDocumentCategoryTable",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPDocumentCategoryTable", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "BPDocumentUploads",
                columns: table => new
                {
                    DocumentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentLocalPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationID = table.Column<int>(type: "int", nullable: true),
                    AssignedUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentGroupName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubDepartmentID = table.Column<int>(type: "int", nullable: true),
                    SubDepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isPlanning = table.Column<bool>(type: "bit", nullable: true),
                    isRepository = table.Column<bool>(type: "bit", nullable: true),
                    DescriptionForRepoDoc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPDocumentUploads", x => x.DocumentID);
                });

            migrationBuilder.CreateTable(
                name: "BPFinancial",
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
                    table.PrimaryKey("PK_BPFinancial", x => x.FinancialID);
                });

            migrationBuilder.CreateTable(
                name: "BPFunctionalAreas",
                columns: table => new
                {
                    FunctionalAreaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FAName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FAItemCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPFunctionalAreas", x => x.FunctionalAreaID);
                });

            migrationBuilder.CreateTable(
                name: "BPMandatoryDepartmentDocuments",
                columns: table => new
                {
                    DocumentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPMandatoryDepartmentDocuments", x => x.DocumentID);
                });

            migrationBuilder.CreateTable(
                name: "BPMandatoryDocumentUploads",
                columns: table => new
                {
                    MandatoryDocumentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MandatoryDocumentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MandatoryDocumentCategory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPMandatoryDocumentUploads", x => x.MandatoryDocumentID);
                });

            migrationBuilder.CreateTable(
                name: "BPMandatoryStageDocuments",
                columns: table => new
                {
                    DocumentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPMandatoryStageDocuments", x => x.DocumentID);
                });

            migrationBuilder.CreateTable(
                name: "BPNotifications",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationID = table.Column<int>(type: "int", nullable: true),
                    NotificationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotificationDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isRead = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BPNotifications", x => x.NotificationID);
                });

            migrationBuilder.CreateTable(
                name: "bpStagesCheckLists",
                columns: table => new
                {
                    CheckListItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChecklistItem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bpStagesCheckLists", x => x.CheckListItemID);
                });

            migrationBuilder.CreateTable(
                name: "BuildingApplications",
                columns: table => new
                {
                    ApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LSNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Surname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CellNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AltEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AltCellNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IDNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PremisesName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AddressType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ErfNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PortionNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NoOfUnits = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UnitNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhysicalAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Latitude = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Longitude = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArchitectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArchitectUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuildingPlanFor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeOfDevelopment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OccupationClassification = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlanFees = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StreetAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Suburb = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SGCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Stage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageNumber = table.Column<int>(type: "int", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingApplications", x => x.ApplicationID);
                });

            migrationBuilder.CreateTable(
                name: "OccupationClassificationTable",
                columns: table => new
                {
                    OccupationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OccupationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OccupationCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Occupancy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OccupancyDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OccupationClassificationTable", x => x.OccupationID);
                });

            migrationBuilder.CreateTable(
                name: "StagesTableBP",
                columns: table => new
                {
                    StageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageOrder = table.Column<int>(type: "int", nullable: true),
                    FunctionalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkipTrigger = table.Column<bool>(type: "bit", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StagesTableBP", x => x.StageID);
                });

            migrationBuilder.CreateTable(
                name: "UserLinkToArchitects",
                columns: table => new
                {
                    UserLinkID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArchitectUserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArchitectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClientUserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CLientFullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLinkToArchitects", x => x.UserLinkID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BPAccessGroupRoleLink");

            migrationBuilder.DropTable(
                name: "BPAccessGroups");

            migrationBuilder.DropTable(
                name: "BPAccessGroupsUserLinks");

            migrationBuilder.DropTable(
                name: "BPAddressTypes");

            migrationBuilder.DropTable(
                name: "BPDepartmentChecklists");

            migrationBuilder.DropTable(
                name: "BPDepartmentLinkTable");

            migrationBuilder.DropTable(
                name: "BPDepartments");

            migrationBuilder.DropTable(
                name: "BPDocumentCategoryTable");

            migrationBuilder.DropTable(
                name: "BPDocumentUploads");

            migrationBuilder.DropTable(
                name: "BPFinancial");

            migrationBuilder.DropTable(
                name: "BPFunctionalAreas");

            migrationBuilder.DropTable(
                name: "BPMandatoryDepartmentDocuments");

            migrationBuilder.DropTable(
                name: "BPMandatoryDocumentUploads");

            migrationBuilder.DropTable(
                name: "BPMandatoryStageDocuments");

            migrationBuilder.DropTable(
                name: "BPNotifications");

            migrationBuilder.DropTable(
                name: "bpStagesCheckLists");

            migrationBuilder.DropTable(
                name: "BuildingApplications");

            migrationBuilder.DropTable(
                name: "OccupationClassificationTable");

            migrationBuilder.DropTable(
                name: "StagesTableBP");

            migrationBuilder.DropTable(
                name: "UserLinkToArchitects");
        }
    }
}
