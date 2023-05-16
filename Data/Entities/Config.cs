using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Config : BaseEntity
    {
        [Key]
        public int ConfigID { get; set; }
        public string? ConfigName { get; set; }
        public string? ConfigDescription { get; set; }



    }
   
}
