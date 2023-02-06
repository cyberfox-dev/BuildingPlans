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

    }


    // new code
    //public int DocumentID { get; set; }
    //public string? DocumentName { get; set; }

    //public IFormFile? DocumentData { get; set; }

    //public string? Description { get; set; }

    //public int? ApplicationID { get; set; }

    //public string? AltText { get; set; }

    //public string? AssignedUserID { get; set; }
}
