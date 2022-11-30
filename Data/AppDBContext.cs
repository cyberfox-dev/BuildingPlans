using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;

namespace WayleaveManagementSystem.Data
{
    public class AppDBContext:IdentityDbContext<AppUser,IdentityRole,string>
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Professionals> ProfessionalsTable { get; set; }
        public DbSet<UserProfile> UserProfilesTable { get; set; }

        public DbSet<Departments> DepartmentsTable { get; set; }

        public DbSet<SubDepartments> SubDepartmentsTable { get; set; }

        public DbSet<Zones> ZonesTable { get; set; }

        public DbSet<ZoneLink> ZoneLinkTable { get; set; }

        public DbSet<Stages> StageTable { get; set; }
        public DbSet<Roles> Role { get; set; }

        public virtual DbSet<UserSpDTO> UserSpDTOs { get; set; }

        public virtual DbSet<LinkedUserSpDTO> LinkedUserSpDTOs { get; set; }

    }
}
