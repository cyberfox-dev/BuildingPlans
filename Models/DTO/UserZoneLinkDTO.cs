using Microsoft.EntityFrameworkCore;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    [Keyless]
    public class UserZoneLinkDTO
    {
        
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
        //public List<string> Roles { get; set; }
    }

}
