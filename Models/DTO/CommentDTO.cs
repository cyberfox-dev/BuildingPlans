using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    public class CommentDTO
    {
        public int CommentID { get; set; }
        public string? Comment { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }



    }

}
