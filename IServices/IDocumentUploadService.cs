using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Models.BindingModel;


namespace WayleaveManagementSystem.IServices
{
    public interface IDocumentUploadService
    {

        Task<DocumentUpload> AddUpdateDocument(int? documentID,string documentName, byte[]? documentData, int? applicationID, string? assignedUserID,string createdById);
        //this will return T/F 
        public Task<bool> DeleteDocument(int documentID);

        Task<List<DocumentUploadDTO>> GetAllDocuments();
        Task<List<DocumentUploadDTO>> GetAllDocumentsForUser(string assignedUserID);
    }
}
