﻿using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IMandatoryDocumentUploadsService
    {
        Task<MandatoryDocumentUpload> AddUpdateMandatoryDocument(int? MandatoryDocumentID, string MandatoryDocumentName, string? CreatedByID);

        public Task<bool> DeleteMandatoryDocument(int mandatoryDocumentID);

        Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocumentsByID(int? mandatoryDocumentID);

        Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocuments();




    }
}