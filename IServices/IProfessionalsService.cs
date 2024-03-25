using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;

namespace BuildingPlans.IServices
{
    public interface IProfessionalsService
    {

        //Task<Professionals> - This is the return type so its going to ruturn it in the fromt of the professinals model
        Task<Professionals> AddUpdateProfessional(int? professinalID, string professinalType, string fullName, string bp_Number, bool? bpVerified, string email, string phoneNumber, string professionalRegNo, string appUserID, string? IdNumber, string createdById, string? CIBRating);
        //this will return T/F 
        public Task<bool> DeleteProfessional(int professinalID);

        Task<List<ProfessionalsDTO>> GetAllProfessionals(string userId);

        Task<List<ProfessionalsDTO>> GetProfessionalsListByProfessionalType(string userId, string professinalType);
        Task<List<ProfessionalsDTO>> GetAllProfessionalsLinkByApplicationID(int? applicationID, string? professinalType);
    }
}
