using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    // DTO - Data Trasfer Object
    public class ConfigDTO
    {
        public int ConfigID { get; set; }
        public string? ConfigName { get; set; }
        public string? ConfigDescription { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }


        public string? UtilitySlot1 { get; set; }
        public string? UtilitySlot2 { get; set; }
        public string? UtilitySlot3 { get; set; }

    }

}
