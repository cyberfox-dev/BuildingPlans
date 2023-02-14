using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IMandatoryDocumentUploadsService
    {
        Task<MandatoryDocumentUpload> AddUpdateMandatoryDocument(int? MandatoryDocumentID, string MandatoryDocumentName, int? StageID, string? CreatedByID);
      
        public Task<bool> DeleteMandatoryDocument(int mandatoryDocumentID);

        Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocumentsByStageID(int? stageID);

        Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocuments();




    }
}
