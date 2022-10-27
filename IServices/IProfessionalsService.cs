using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;

namespace WayleaveManagementSystem.IServices
{
    public interface IProfessionalsService
    {

        //Task<Professionals> - This is the return type so its going to ruturn it in the fromt of the professinals model
        Task<Professionals> AddUpdateProfessional(int? professinalID, string professinalType, string fullName, string bp_Number, bool? bpVerified, string email, string phoneNumber, string professionalRegNo, string appUserID, int createdById);
        //this will return T/F 
        public Task<bool> DeleteProfessional(int professinalID);

        Task<List<ProfessionalsDTO>> GetAllProfessionals(string userId);
    }
}
