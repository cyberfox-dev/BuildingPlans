using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class MFT : BaseEntity
    {
        [Key]
        public int MFTID { get; set; }
        public int? ApplicationID { get; set; }
        public string? MFTNote { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentLocalPath { get; set; }

        public string? FullName { get; set; }
    }
}