using System.ComponentModel.DataAnnotations;
using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.DTO
{
    public class MandatoryDocumentUploadDTO : BaseEntity
    {

        public int? MandatoryDocumentID { get; set; }
        public string? MandatoryDocumentName { get; set; }
        public int? StageID { get; set; }



    }
}
   

