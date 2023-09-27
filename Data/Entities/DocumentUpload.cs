using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class DocumentUpload : BaseEntity
    {
        [Key]
        public int DocumentID { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentLocalPath { get; set; } 
        public int? ApplicationID { get; set; }
        public string? AssignedUserID { get; set; }
        public string? DocumentGroupName { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
        public bool? isPlanning { get; set; }
        public bool? isRepository { get; set; }
        public string? DescriptionForRepoDoc { get; set; }

    }
}
