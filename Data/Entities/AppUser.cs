using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace WayleaveManagementSystem.Data.Entities
{
    public class AppUser:IdentityUser
    {
        //[Key]
        //public int UserID { get; set; }
        //public string UserName { get; set; }
       
        public string FullName { get; set; }
        public DateTime DateCreated { get; set; } 
        public DateTime DateModified { get; set; }

        public List<Professionals>? Professionals { get; set; } 
    }
}
