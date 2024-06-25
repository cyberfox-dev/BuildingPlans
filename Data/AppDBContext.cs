using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace BuildingPlans.Data
{
    public class AppDBContext : IdentityDbContext<AppUser, IdentityRole, string>
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Professionals> ProfessionalsTable { get; set; }
        public DbSet<ProfessionalsLinks> ProfessionalsLink { get; set; }
        public DbSet<UserProfile> UserProfilesTable { get; set; }

        public DbSet<Departments> DepartmentsTable { get; set; }

        public DbSet<SubDepartments> SubDepartmentsTable { get; set; }

        public DbSet<Zones> ZonesTable { get; set; }

        public DbSet<ZoneLink> ZoneLinkTable { get; set; }

        public DbSet<Stages> StageTable { get; set; }
        public DbSet<Roles> Role { get; set; }
        public DbSet<CommentBuilder> CommentBuilder { get; set; }
        public DbSet<Applications> Application { get; set; }

        public DbSet<DocumentUpload> DocumentUpload { get; set; }

        public DbSet<SubDepartmentForComment> SubDepartmentForComment { get; set; }
        public DbSet<Comments> Comments { get; set; }

        public DbSet<MandatoryDocumentUpload> MandatoryDocumentUploads { get; set; }
        public DbSet<ProjectSizeCheckList> ProjectSizeCheckList { get; set; }
        public virtual DbSet<ProjectSizedSelections> ProjectSizedSelections { get; set; }
        public virtual DbSet<ManuallyAssignUsers> ManuallyAssignUsers { get; set; }
        public DbSet<MandatoryDocumentStageLink> MandatoryDocumentStageLink { get; set; }
        public DbSet<ServiceItems> ServiceItem { get; set; }
        public DbSet<GLCode> GLCode { get; set; }
        public DbSet<Financial> Financial { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<ZoneForComment> ZoneForComment { get; set; }
        public DbSet<DepositRequired> DepositRequired { get; set; }
        public DbSet<MFT> MFT { get; set; }
        public DbSet<FAQ> FAQ { get; set; }
        public DbSet<ContactDetails> ContactDetails { get; set; }

        public DbSet<AccessGroups> AccessGroups { get; set; }
        public DbSet<ReviewerAssignment> ReviewerForComment { get; set; } //actionCentreEdits Sindiswa 17 January 2024
        public DbSet<TypeOfExcavation> TypesOfExcavation { get; set; }
        public DbSet<Config> Config { get; set; }
        public DbSet<AccessGroupUserLink> AccessGroupUserLink { get; set; }
        public DbSet<AccessGroupRoleLink> AccessGroupRoleLink { get; set; }
        public DbSet<PermitSubForComment> PermitSubForComment { get; set; }
        //Audit Trail Kyle 
        public DbSet<AuditTrail> AuditTrail { get; set; }
        public DbSet<DocumentsRepository> DocumentsRepository { get; set; }
        public DbSet<ZXNumberLog> ZXNumberLog { get; set; } //zxNumberUpdate Sindiswa 01 March 2024
        // Virtual Db Sets for SPs go here
        public virtual DbSet<UserSpDTO> UserSpDTOs { get; set; }

        public virtual DbSet<LinkedUserSpDTO> LinkedUserSpDTOs { get; set; }
        public virtual DbSet<ApplicationsDTO> ApplicationListDTO { get; set; }

        public virtual DbSet<DraftedProjects> DraftedProjectsTable { get; set; }

        //Building plans updates
        public DbSet<BPDocumentUploads> BPDocumentUploads { get; set; }
        public DbSet<BPFunctionalAreas> BPFunctionalAreas { get; set; }

        public DbSet<BPStagesCheckLists> bpStagesCheckLists { get; set; }
        public DbSet<BPMandatoryStageDocuments> BPMandatoryStageDocuments { get; set; }
        public DbSet<BPMandatoryDepartmentDocuments> BPMandatoryDepartmentDocuments { get; set; }
        public DbSet<BPDepartmentChecklists> BPDepartmentChecklists { get; set; }
        public DbSet<BPAccessGroups> BPAccessGroups { get; set; }
        public DbSet<BPAccessGroupRoleLink> BPAccessGroupRoleLink { get; set; }
        public DbSet<BPAccessGroupsUserLink> BPAccessGroupsUserLinks { get; set; }
        public DbSet<BPAddressType> BPAddressTypes { get; set; }
        public DbSet<BPNotifications> BPNotifications { get; set; }
        public DbSet<BPDepartmentLinkTable> BPDepartmentLinkTable { get; set; }
        public DbSet<BPFinancial> BPFinancial { get; set; }
        public DbSet<UserLinkToArchitect> UserLinkToArchitects { get; set; }
        public DbSet<BPMandatoryDocumentUploads> BPMandatoryDocumentUploads { get; set; }
        public DbSet<BPDepartments> BPDepartments { get; set; }
        public virtual DbSet<OccupationClassificationTable> OccupationClassificationTable { get; set; }
        public virtual DbSet<BPDocumentCategoryTable> BPDocumentCategoryTable { get; set; }
        public virtual DbSet<BuildingApplication> BuildingApplications { get; set; }
        public DbSet<StagesTableBP> StagesTableBP { get; set; }
        public DbSet<BPDemolitionApplication> BPDemolitionApplication { get; set; }
        public DbSet<BPSignageApplication> BPSignageApplication { get; set; }
        public DbSet<BPBannerApplication> BPBannerApplication { get; set; }
        public DbSet<BPFlagApplication> BPFlagApplication { get; set; }
        public DbSet<BPComplaints> BPComplaints { get; set; }
        public DbSet<BPRoles> BPRoles { get; set; }

        public DbSet<BPServiceItems> BPServiceItems { get; set; }
    }
}