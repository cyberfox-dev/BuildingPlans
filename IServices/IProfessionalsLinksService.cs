using BuildingPlans.Data.Entities;
using BuildingPlans.Models.DTO;

namespace BuildingPlans.IServices
{
    public interface IProfessionalsLinksService
    {

        //Task<Professionals> - This is the return type so its going to ruturn it in the fromt of the professinals model
        Task<ProfessionalsLinks> AddUpdateProfessionalsLink(int? professionalsLinkID, int? applicationID, int? professionalID, string createdById);
        //this will return T/F 
        public Task<bool> DeleteProfessionalsLink(int professionalsLinkID);

        Task<List<ProfessionalsLinksDTO>> GetAllProfessionalsLink(string userId);

    }
}
