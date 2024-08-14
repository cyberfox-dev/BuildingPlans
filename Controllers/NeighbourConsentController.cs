using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NeighbourConsentController : ControllerBase
    {
       private readonly AppDBContext _context;

        public NeighbourConsentController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateNeighboutConsent")]
        public async Task<object> AddUpdateNeighbourConsent([FromBody] NeighbourConsentBindingmodel model)
        {
            try
            {
                var result = new object();

                if(model.ApplicationID == null || model.Address == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.ConsentID == 0)
                    {
                        model.ConsentID = null;
                    }

                    var tempNeighbourConsent = _context.NeighbourConsent.FirstOrDefault(x =>x.ConsentID == model.ConsentID);

                    if(tempNeighbourConsent == null)
                    {
                        tempNeighbourConsent = new NeighbourConsent()
                        {
                            ApplicationID = model.ApplicationID,
                            Address = model.Address,
                            DocumentName = model.DocumentName,
                            DocumentLocalPath = model.DocumentLocalPath,
                            ConsentStatus = model.ConsentStatus,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true
                        };

                        await _context.NeighbourConsent.AddAsync(tempNeighbourConsent);
                        await _context.SaveChangesAsync();

                        result = tempNeighbourConsent;
                    }
                    else
                    {
                        if(model.Address != null)
                        {
                            tempNeighbourConsent.Address = model.Address;
                        }

                        if(model.DocumentName != null)
                        {
                            tempNeighbourConsent.DocumentName = model.DocumentName; 
                        }

                        if(model.DocumentLocalPath != null)
                        {
                            tempNeighbourConsent.DocumentLocalPath = model.DocumentLocalPath;
                        }
                        if (model.ConsentStatus != null)
                        {
                            tempNeighbourConsent.ConsentStatus = model.ConsentStatus;
                        }
                        tempNeighbourConsent.DateUpdated = DateTime.Now;

                        _context.Update(tempNeighbourConsent);
                        await _context.SaveChangesAsync();

                        result = tempNeighbourConsent;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ConsentID > 0 ? "Neighbour Consent Updated Successfully" : "Neighbour Consent Add Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllNeighbourConsentForApplication")]
        public async Task<object> GetAllNeighbourConsentFroApplication([FromBody] NeighbourConsentBindingmodel model)
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from consent in _context.NeighbourConsent
                                        where consent.ApplicationID == model.ApplicationID && consent.isActive == true
                                        select new NeighbourConsentDTO()
                                        {
                                            ConsentID = consent.ConsentID,
                                            ApplicationID = consent.ApplicationID,
                                            Address = consent.Address,
                                            DocumentLocalPath = consent.DocumentLocalPath,
                                            DocumentName = consent.DocumentName,
                                            ConsentStatus = consent.ConsentStatus,
                                            CreatedById = consent.CreatedById,
                                            DateCreated = consent.DateCreated,
                                            DateUpdated = consent.DateUpdated, 

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all neighbour consents for application", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetNeighbourConsentByConsentID")]
        public async Task<object> GetNeighboutConsentByConsentID([FromBody] NeighbourConsentBindingmodel model)
        {
            try
            {
                if(model.ConsentID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from consent in _context.NeighbourConsent
                                        where consent.ConsentID == model.ConsentID && consent.isActive == true
                                        select new NeighbourConsentDTO()
                                        {
                                            ConsentID = consent.ConsentID,
                                            ApplicationID = consent.ApplicationID,
                                            Address = consent.Address,
                                            DocumentLocalPath = consent.DocumentLocalPath,
                                            DocumentName = consent.DocumentName,
                                            ConsentStatus = consent.ConsentStatus,
                                            CreatedById = consent.CreatedById,
                                            DateCreated = consent.DateCreated,
                                            DateUpdated = consent.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Neighbour Consent By ConsentID", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteNeighbourConsentByConsentID")]
        public async Task<object> DeleteNeighbourConsentByConsentID([FromBody] NeighbourConsentBindingmodel model)
        {
            try
            {
                if(model.ConsentID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempNeighbourConsent = _context.NeighbourConsent.FirstOrDefault(x => x.ConsentID == model.ConsentID);

                    if(tempNeighbourConsent == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could Not Find Entry In Database", false));
                    }
                    else
                    {
                        tempNeighbourConsent.isActive = false;
                        tempNeighbourConsent.DateUpdated = DateTime.Now;

                        _context.Update(tempNeighbourConsent);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Neighbour Consent Deleted Successfully", true));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
