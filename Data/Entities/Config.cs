using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Config : BaseEntity
    {
        [Key]
        public int ConfigID { get; set; }
        public string? ConfigName { get; set; }
        public string? ConfigDescription { get; set; }


        public string? UtilitySlot1 { get; set; }
        public string? UtilitySlot2 { get; set; }
        public string? UtilitySlot3 { get; set; }



    }
   
}
