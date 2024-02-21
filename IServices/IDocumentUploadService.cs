using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Models.BindingModel;


namespace WayleaveManagementSystem.IServices
{
    public interface IDocumentUploadService
    {

        Task<DocumentUpload> AddUpdateDocument(int? documentID,string documentName, string? DocumentLocalPath, int? applicationID, string? assignedUserID,string createdById, string? groupName, int?subDepID, string? subDepName, bool? isPlanning, bool? isRepository,string? description);
        //this will return T/F 
        public Task<bool> DeleteDocument(int documentID);



        Task<List<DocumentUploadDTO>> GetAllDocumentsForApplication(int? applicationID);
        Task<List<DocumentUploadDTO>> GetAllDocumentsForApplicationForPlanning(int? applicationID);
        Task<List<DocumentUploadDTO>> GetAllDocuments();
        Task<List<DocumentUploadDTO>> GetAllDocumentsForRepository();
        Task<List<DocumentUploadDTO>> GetAllDocumentsForUser(string assignedUserID);
      
    }
}
