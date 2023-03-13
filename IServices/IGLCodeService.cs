using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IGLCodeService
    {
        Task<GLCode> AddUpdateGLCode(int? glCodeID, string glCodeName, string? creadtedByID);
      
        public Task<bool> DeleteGLCode(int glCodeID);

        Task<List<GLCodeDTO>> GetGLCodeByID(int? glCodeID);
        Task<List<GLCodeDTO>> GetAllGLCodes();

    }
}
