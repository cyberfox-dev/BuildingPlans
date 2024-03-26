using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface IBPManDocService
    {
        Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocuments();

    }
}
