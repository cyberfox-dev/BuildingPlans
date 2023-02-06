using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IMandatoryDocumentUploadsService
    {
        Task<MandatoryDocumentUpload> AddUpdateMandatoryDocument(int? MandatoryDocumentID, string MandatoryDocumentName, int? StageID);
      
        public Task<bool> DeleteMandatoryDocument(int mandatoryDocumentID);

        Task<List<MandatoryDocumentUpload>> GetAllMandatoryDocuments();

        Task<List<MandatoryDocumentUpload>> GetAllMandatoryDocumentsByStageID(int? stageID);


    }
}
