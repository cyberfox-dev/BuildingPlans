using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface IGLCodeService
    {
        Task<GLCode> AddUpdateGLCode(int? glCodeID, string glCodeName, string? creadtedByID, string? profitCenter);

        public Task<bool> DeleteGLCode(int glCodeID);
        public Task<bool> SetLinkDepartmentToGLCode(int? glCodeID, int? departmentID, string? departmentName);

        Task<List<GLCodeDTO>> GetGLCodeByID(int? glCodeID);
        Task<List<GLCodeDTO>> GetAllGLCodes();

    }
}
