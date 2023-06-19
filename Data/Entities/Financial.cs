using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class Financial : BaseEntity
    {
        [Key]
        public int FinancialID { get; set; }
        public string? FinancialName { get; set; }
        public string? FinancialType { get; set; }
        public string? DocumentName { get; set; }
        
        public string? DocumentLocalPath { get; set; } 

        public int? ApplicationID { get; set; }



    }
}
