using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Data
{
    public class AppDBContext:IdentityDbContext<AppUser,IdentityRole,string>
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {

        }
        
    }
}
