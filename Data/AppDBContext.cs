using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Data
{
    public class AppDBContext:IdentityDbContext<AppUser,IdentityRole,string>
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

        public DbSet<MandatoryDocumentStageLink> MandatoryDocumentStageLink { get; set; }
        public DbSet<ServiceItems> ServiceItem { get; set; }
        public DbSet<GLCode> GLCode { get; set; }



        // Virtual Db Sets for SPs go here
        public virtual DbSet<UserSpDTO> UserSpDTOs { get; set; }

        public virtual DbSet<LinkedUserSpDTO> LinkedUserSpDTOs { get; set; }
        public virtual DbSet<ApplicationsDTO> ApplicationListDTO { get; set; }


    }
}
