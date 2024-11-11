using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Formats.Gif;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPDemolitionApplicationController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPDemolitionApplicationController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateDemolitionApplication")]
        public async Task<object> AddUpdateDemolitionApplication([FromBody] BPDemolitionApplicationBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.DemolitionID == 0)
                    {
                        model.DemolitionID = null;
                    }

                    var tempDemolitionApplication = _context.BPDemolitionApplication.FirstOrDefault(x => x.DemolitionID == model.DemolitionID);
                    
                    if(tempDemolitionApplication == null)
                    {
                        tempDemolitionApplication = new BPDemolitionApplication()
                        {
                            MainMunicipality = model.MainMunicipality,
                            ApplicantName = model.ApplicantName,
                            ApplicantSurname = model.ApplicantSurname,
                            ApplicantIDNumber = model.ApplicantIDNumber,
                            ApplicantEmailAddress = model.ApplicantEmailAddress,
                            ApplicantContactNumber = model.ApplicantContactNumber,
                            isPropertyOwner  = model.isPropertyOwner,
                            OwnerIDNumber = model.OwnerIDNumber,
                            OwnerName = model.OwnerName,
                            OwnerSurname = model.OwnerSurname,
                            OwnerEmailAddress = model.OwnerEmailAddress,
                            OwnerContactNumber = model.OwnerContactNumber,
                            ApplicantAddress = model.ApplicantAddress,
                            SiteAddress = model.SiteAddress,
                            SiteCadastralDescription = model.SiteCadastralDescription,
                            SiteERFNumber = model.SiteERFNumber,
                            ReasonForDemolition = model.ReasonForDemolition,
                            PropertyUse = model.PropertyUse,
                            DemolitionFees = model.DemolitionFees,
                            CreatedById = model.CreatedById,
                            isArchive = model.isArchive,
                            PreviousStage = model.PreviousStage,
                            CurrentStage = model.CurrentStage,
                            ProjectNumber = model.ProjectNumber,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                            
                        };
                        await _context.BPDemolitionApplication.AddAsync(tempDemolitionApplication);
                        await _context.SaveChangesAsync();
                        result = tempDemolitionApplication;
                    }
                    else
                    {
                        if(model.MainMunicipality != null)
                        {
                            tempDemolitionApplication.MainMunicipality = model.MainMunicipality;
                        }
                        if(model.ApplicantName != null)
                        {
                            tempDemolitionApplication.ApplicantName = model.ApplicantName;
                        }
                        if (model.ApplicantSurname != null)
                        {
                            tempDemolitionApplication.ApplicantSurname = model.ApplicantSurname;        
                        }
                        if(model.ApplicantIDNumber != null)
                        {
                            tempDemolitionApplication.ApplicantIDNumber = model.ApplicantIDNumber;
                        }
                        if(model.ApplicantEmailAddress != null)
                        {
                            tempDemolitionApplication.ApplicantEmailAddress = model.ApplicantEmailAddress;
                        }
                        if(model.ApplicantContactNumber != null)
                        {
                            tempDemolitionApplication.ApplicantContactNumber = model.ApplicantContactNumber;
                        }
                        if(model.isPropertyOwner != null)
                        {
                            tempDemolitionApplication.isPropertyOwner = model.isPropertyOwner;
                        }
                        if (model.OwnerIDNumber != null)
                        {
                            tempDemolitionApplication.OwnerIDNumber = model.OwnerIDNumber;
                        }
                        if(model.OwnerName != null)
                        {
                            tempDemolitionApplication.OwnerName = model.OwnerName;
                        }
                        if(model.OwnerSurname != null)
                        {
                            tempDemolitionApplication.OwnerSurname = model.OwnerSurname;
                        }
                        if(model.OwnerEmailAddress != null)
                        {
                            tempDemolitionApplication.OwnerEmailAddress = model.OwnerEmailAddress;
                        }
                        if(model.OwnerContactNumber != null)
                        {
                            tempDemolitionApplication.OwnerContactNumber = model.OwnerContactNumber;
                        }
                        if(model.ApplicantAddress != null)
                        {
                            tempDemolitionApplication.ApplicantAddress = model.ApplicantAddress;
                        }
                        if(model.SiteAddress != null)
                        {
                            tempDemolitionApplication.SiteAddress = model.SiteAddress;
                        }
                        if(model.SiteERFNumber != null)
                        {
                            tempDemolitionApplication.SiteERFNumber = model.SiteERFNumber;
                        }
                        if(model.SiteCadastralDescription != null)
                        {
                            tempDemolitionApplication.SiteCadastralDescription = model.SiteCadastralDescription;
                        }
                        if(model.ReasonForDemolition != null)
                        {
                            tempDemolitionApplication.ReasonForDemolition = model.ReasonForDemolition;
                        }
                        if(model.PropertyUse != null)
                        {
                            tempDemolitionApplication.PropertyUse = model.PropertyUse;
                        }
                        if(model.DemolitionFees != null)
                        {
                            tempDemolitionApplication.DemolitionFees = model.DemolitionFees;
                        }
                        if(model.isArchive != null)
                        {
                            tempDemolitionApplication.isArchive = model.isArchive;
                        }
                        if(model.PreviousStage != null)
                        {
                            tempDemolitionApplication.PreviousStage = model.PreviousStage;
                        }
                        if(model.CurrentStage != null)
                        {
                            tempDemolitionApplication.CurrentStage = model.CurrentStage;
                        }
                        if(model.ProjectNumber != null)
                        {
                            tempDemolitionApplication.ProjectNumber = model.ProjectNumber;
                        }


                        tempDemolitionApplication.DateUpdated = DateTime.Now;
                        _context.Update(tempDemolitionApplication);
                        await _context.SaveChangesAsync();
                        result = tempDemolitionApplication;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DemolitionID > 0 ? "Demolition Application Updated Successfully" : "Demolition Application Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllDemolitionApplications")]
        public async Task<object> GetAllDemolitionApplications()
        {
            try
            {
                var result = await (from applications in _context.BPDemolitionApplication
                                    where applications.isActive == true  && applications.isArchive == false
                                    select new BPDemolitionApplicationDTO()
                                    {
                                        DemolitionID = applications.DemolitionID,
                                        MainMunicipality = applications.MainMunicipality,
                                        ApplicantName = applications.ApplicantName,
                                        ApplicantSurname = applications.ApplicantSurname,
                                        ApplicantIDNumber = applications.ApplicantIDNumber ,
                                        ApplicantEmailAddress = applications.ApplicantEmailAddress,
                                        ApplicantContactNumber = applications.ApplicantContactNumber,
                                        isPropertyOwner = applications.isPropertyOwner,
                                        OwnerIDNumber = applications.OwnerIDNumber,
                                        OwnerName  = applications.OwnerName,
                                        OwnerSurname  = applications.OwnerSurname,
                                        OwnerEmailAddress  = applications.OwnerEmailAddress,
                                        OwnerContactNumber = applications.OwnerContactNumber,
                                        ApplicantAddress = applications.ApplicantAddress,
                                        SiteAddress = applications.SiteAddress,
                                        SiteERFNumber = applications.SiteERFNumber,
                                        SiteCadastralDescription = applications.SiteCadastralDescription,
                                        ReasonForDemolition = applications.ReasonForDemolition,
                                        PropertyUse = applications.PropertyUse,
                                        DemolitionFees = applications.DemolitionFees,
                                        isArchive = applications.isArchive,
                                        CurrentStage = applications.CurrentStage,
                                        PreviousStage = applications.PreviousStage,
                                        ProjectNumber = applications.ProjectNumber,
                                        DateCreated = applications.DateCreated,
                                        DateUpdated = applications.DateUpdated,
                                        CreatedById = applications.CreatedById,
                                         


                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Banner Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetDemolitionApplicationByDemolitionID")]
        public async Task<object> GetDemolitionApplicationByDemolitionID([FromBody] BPDemolitionApplicationBindingModel model)
        {
            try
            {
                if(model.DemolitionID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from applications in _context.BPDemolitionApplication
                                        where applications.DemolitionID == model.DemolitionID && applications.isActive == true
                                        select new BPDemolitionApplicationDTO()
                                        {
                                            DemolitionID = applications.DemolitionID,
                                            MainMunicipality = applications.MainMunicipality,
                                            ApplicantName = applications.ApplicantName,
                                            ApplicantSurname = applications.ApplicantSurname,
                                            ApplicantIDNumber = applications.ApplicantIDNumber,
                                            ApplicantEmailAddress = applications.ApplicantEmailAddress,
                                            ApplicantContactNumber = applications.ApplicantContactNumber,
                                            isPropertyOwner = applications.isPropertyOwner,
                                            OwnerIDNumber = applications.OwnerIDNumber,
                                            OwnerName = applications.OwnerName,
                                            OwnerSurname = applications.OwnerSurname,
                                            OwnerEmailAddress = applications.OwnerEmailAddress,
                                            OwnerContactNumber = applications.OwnerContactNumber,
                                            ApplicantAddress = applications.ApplicantAddress,
                                            SiteAddress = applications.SiteAddress,
                                            SiteERFNumber = applications.SiteERFNumber,
                                            SiteCadastralDescription = applications.SiteCadastralDescription,
                                            ReasonForDemolition = applications.ReasonForDemolition,
                                            PropertyUse = applications.PropertyUse,
                                            DemolitionFees = applications.DemolitionFees,
                                            isArchive = applications.isArchive,
                                            CurrentStage = applications.CurrentStage,
                                            PreviousStage = applications.PreviousStage,
                                            ProjectNumber = applications.ProjectNumber,
                                            DateCreated = applications.DateCreated,
                                            DateUpdated = applications.DateUpdated,
                                            CreatedById = applications.CreatedById,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Demolition Applications", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteDemolitionApplicationByDemolitionID")]
        public async Task<object> DeleteDemolitionApplicationByDemolitionID([FromBody] BPDemolitionApplicationBindingModel model)
        {
            try
            {
                if(model.DemolitionID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempApplication = _context.BPDemolitionApplication.FirstOrDefault(x => x.DemolitionID == model.DemolitionID);

                    if(tempApplication == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could Not Find Demolition Application In Database", false));
                    }
                    else
                    {
                        tempApplication.isActive = false;
                        tempApplication.DateUpdated = DateTime.Now;

                        _context.Update(tempApplication);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK,"Demolition Application Deleted Successfully",true));
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
