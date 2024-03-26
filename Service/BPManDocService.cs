using BuildingPlans.Data;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class BPManDocService : IBPManDocService
    {
        private readonly AppDBContext _context;

        public BPManDocService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocuments()
        {

            return await (
                 from mandatoryDocumentUpload in _context.BPMandatoryDocumentUploads
                 where mandatoryDocumentUpload.isActive == true
                 select new MandatoryDocumentUploadDTO()
                 {
                     MandatoryDocumentID = mandatoryDocumentUpload.MandatoryDocumentID,
                     MandatoryDocumentName = mandatoryDocumentUpload.MandatoryDocumentName,

                     DateCreated = mandatoryDocumentUpload.DateCreated,
                     DateUpdated = mandatoryDocumentUpload.DateUpdated,
                     MandatoryDocumentCategory = mandatoryDocumentUpload.MandatoryDocumentCategory,
                     CreatedById = mandatoryDocumentUpload.CreatedById,
                     isActive = true


                 }
                 ).ToListAsync();
        }
    }
}
