using System;
using Microsoft.AspNetCore.Identity;

namespace WayleaveManagementSystem.Data.Entities
{
    public class AppUser:IdentityUser
    {
        //public string UserName { get; set; }
        public string FullName { get; set; }
        public DateTime DateCreated { get; set; } 
        public DateTime DateModified { get; set; }

        public List<Professionals>? Professionals { get; set; } 
    }
}
