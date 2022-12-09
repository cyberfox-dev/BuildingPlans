using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class CommentBuilder : BaseEntity
    {
        [Key]
        public int CommentID { get; set; }
        public string? CommentName { get; set; }



    }
}
