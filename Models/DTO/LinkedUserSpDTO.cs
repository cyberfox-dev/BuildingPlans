using Microsoft.EntityFrameworkCore;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    [Keyless]
    public class LinkedUserSpDTO
    {
      
        public string FullName { get; set; }
   
        public string id { get; set; }

        public int ZoneLinkID { get; set; }

        public string Email { get; set; }
    }

}
