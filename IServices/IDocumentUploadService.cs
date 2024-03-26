using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;


namespace BuildingPlans.IServices
{
    public interface IDocumentUploadService
    {

        Task<DocumentUpload> AddUpdateDocument(int? documentID, string documentName, string? DocumentLocalPath, int? applicationID, string? assignedUserID, string createdById, string? groupName, int? subDepID, string? subDepName, bool? isPlanning, bool? isRepository, string? description);
        //this will return T/F 
        Task<BPDocumentUploads> AddUpdateBPDocument(int? documentID, string documentName, string? DocumentLocalPath, int? applicationID, string? assignedUserID, string createdById, string? groupName, int? subDepID, string? subDepName, bool? isPlanning, bool? isRepository, string? description);
        public Task<bool> DeleteDocument(int documentID);
        public Task<bool> DeleteBPDocument(int documentID);


        Task<List<DocumentUploadDTO>> GetAllDocumentsForApplication(int? applicationID);
        Task<List<DocumentUploadDTO>> GetAllDocumentsForApplicationForPlanning(int? applicationID);
        Task<List<DocumentUploadDTO>> GetAllDocuments();
        Task<List<DocumentUploadDTO>> GetAllDocumentsForRepository();
        Task<List<DocumentUploadDTO>> GetAllDocumentsForUser(string assignedUserID);
        Task<List<DocumentUploadDTO>> GetAllBPDocumentsForRepository();
        Task<List<DocumentUploadDTO>> GetAllBPDocumentsForApplication(int? applicationID);
    }
}
