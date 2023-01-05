using System.ComponentModel.DataAnnotations;
using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    public class DocumentUploadDTO:BaseEntity
    {

        public int DocumentID { get; set; }
        public string? DocumentName { get; set; }

        public byte[]? DocumentData { get; set; }

        public int? ApplicationID { get; set; }

        public string? AssignedUserID { get; set; }

        
    }
}
   

