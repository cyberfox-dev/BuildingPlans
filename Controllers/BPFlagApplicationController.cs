using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPFlagApplicationController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPFlagApplicationController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateFlagApplication")]
        public async Task<object> AddUpdateFlagApplication([FromBody] BPFlagApplicationBindingModel model)
        {
            try
            {
                var result = new object();

                if(model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.ApplicationID == 0)
                    {
                        model.ApplicationID = null;
                    }
                    var tempApplication = _context.BPFlagApplication.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                    if (tempApplication == null)
                    {
                        tempApplication = new BPFlagApplication()
                        {
                            ApplicationID = model.ApplicationID,
                            UserID = model.UserID,
                            ApplicantName = model.ApplicantName,
                            ApplicantSurname = model.ApplicantSurname,
                            ApplicantEmail = model.ApplicantEmail,
                            ApplicantFax = model.ApplicantFax,
                            ApplicantCell = model.ApplicantCell,
                            ApplicantTelephone = model.ApplicantTelephone,
                            ApplicantAddress = model.ApplicantAddress,
                            ApplicationType = model.ApplicationType,
                            Location = model.Location,
                            PoleNumber = model.PoleNumber,
                            StartPole = model.StartPole,
                            EndPole = model.EndPole,
                            SubjectMatter = model.SubjectMatter,
                            NoOfFlags = model.NoOfFlags,
                            NoOfAgents = model.NoOfAgents,
                            NatureOfAdvert = model.NatureOfAdvert,
                            StartDate = model.StartDate,
                            EndDate = model.EndDate,
                            PlaceOfEvent = model.PlaceOfEvent,
                            ApplicationFee = model.ApplicationFee,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };

                        await _context.BPFlagApplication.AddAsync(tempApplication);
                        await _context.SaveChangesAsync();

                        result = tempApplication;
                    }
                    else{

                        if(model.UserID != null)
                        {
                            tempApplication.UserID = model.UserID;
                        }
                        if(model.ApplicantName != null)
                        {
                            tempApplication.ApplicantName = model.ApplicantName;
                        }
                        if(model.ApplicantSurname != null)
                        {
                            tempApplication.ApplicantSurname = model.ApplicantSurname;
                        }
                        if(model.ApplicantEmail != null)
                        {
                            tempApplication.ApplicantEmail = model.ApplicantEmail;
                        }
                        if(model.ApplicantFax != null)
                        {
                            tempApplication.ApplicantFax = model.ApplicantFax;
                        }
                        if(model.ApplicantCell != null)
                        {
                            tempApplication.ApplicantCell = model.ApplicantCell;
                        }
                        if (model.ApplicantTelephone != null)
                        {
                            tempApplication.ApplicantTelephone = model.ApplicantTelephone;
                        }
                        if(model.ApplicantAddress != null)
                        {
                            tempApplication.ApplicantAddress = model.ApplicantAddress; 
                        }
                        if(model.Location != null)
                        {
                            tempApplication.Location = model.Location;
                        }
                        if(model.PoleNumber != null)
                        {
                            tempApplication.PoleNumber = model.PoleNumber;
                        }
                        if(model.StartPole != null)
                        {
                            tempApplication.StartPole = model.StartPole;
                        }
                        if(model.EndPole != null)
                        {
                            tempApplication.EndPole = model.EndPole;
                        }
                        if(model.SubjectMatter != null)
                        {
                            tempApplication.SubjectMatter = model.SubjectMatter;
                        }
                        if(model.NoOfFlags != null)
                        {
                            tempApplication.NoOfFlags = model.NoOfFlags;
                        }
                        if(model.NatureOfAdvert != null)
                        {
                            tempApplication.NatureOfAdvert = model.NatureOfAdvert;
                        }
                        if (model.StartDate != null)
                        {
                            tempApplication.StartDate = model.StartDate;
                        }
                        if(model.EndDate != null)
                        {
                            tempApplication.EndDate = model.EndDate;
                        }
                        if(model.PlaceOfEvent != null)
                        {
                            tempApplication.PlaceOfEvent = model.PlaceOfEvent;
                        }
                        if(model.ApplicationFee != null)
                        {
                            tempApplication.ApplicationFee = model.ApplicationFee;
                        }

                        tempApplication.DateUpdated = DateTime.Now;

                        _context.Update(tempApplication);
                        await _context.SaveChangesAsync();
                        result = tempApplication;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? "Flag Application Updated Successfully" : "FLag Application Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllFlagApplications")]
        public async Task<object> GetAllFlagApplications()
        {
            try
            {
                var result = await (from applications in _context.BPFlagApplication
                                    where applications.isActive == true
                                    select new BPFlagApplicationDTO()
                                    {
                                        ApplicationID = applications.ApplicationID,
                                        UserID = applications.UserID,
                                        ApplicantName = applications.ApplicantName,
                                        ApplicantSurname = applications.ApplicantSurname,
                                        ApplicantEmail = applications.ApplicantEmail,
                                        ApplicantFax = applications.ApplicantFax,
                                        ApplicantCell = applications.ApplicantCell,
                                        ApplicantTelephone = applications.ApplicantTelephone,
                                        ApplicantAddress = applications.ApplicantAddress,
                                        ApplicationType = applications.ApplicationType,
                                        Location = applications.Location,
                                        PoleNumber = applications.PoleNumber,
                                        StartPole = applications.StartPole,
                                        EndPole = applications.EndPole,
                                        SubjectMatter = applications.SubjectMatter,
                                        NoOfFlags = applications.NoOfFlags,
                                        NoOfAgents = applications.NoOfAgents,
                                        NatureOfAdvert = applications.NatureOfAdvert,
                                        StartDate = applications.StartDate,
                                        EndDate = applications.EndDate,
                                        PlaceOfEvent = applications.PlaceOfEvent,
                                        ApplicationFee = applications.ApplicationFee,
                                        CreatedById = applications.CreatedById,
                                        DateCreated = applications.DateCreated,
                                        DateUpdated = applications.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Flag Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPost("GetFlagApplicationByApplicationID")]
        public async Task<object> GetFlagApplicationByApplicationID([FromBody]BPFlagApplicationBindingModel model)
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from applications in _context.BPFlagApplication
                                         where applications.ApplicationID == model.ApplicationID && applications.isActive == true
                                         select new BPFlagApplicationDTO() {
                                             ApplicationID = applications.ApplicationID,
                                             UserID = applications.UserID,
                                             ApplicantName = applications.ApplicantName,
                                             ApplicantSurname = applications.ApplicantSurname,
                                             ApplicantEmail = applications.ApplicantEmail,
                                             ApplicantFax = applications.ApplicantFax,
                                             ApplicantCell = applications.ApplicantCell,
                                             ApplicantTelephone = applications.ApplicantTelephone,
                                             ApplicantAddress = applications.ApplicantAddress,
                                             ApplicationType = applications.ApplicationType,
                                             Location = applications.Location,
                                             PoleNumber = applications.PoleNumber,
                                             StartPole = applications.StartPole,
                                             EndPole = applications.EndPole,
                                             SubjectMatter = applications.SubjectMatter,
                                             NoOfFlags = applications.NoOfFlags,
                                             NoOfAgents = applications.NoOfAgents,
                                             NatureOfAdvert = applications.NatureOfAdvert,
                                             StartDate = applications.StartDate,
                                             EndDate = applications.EndDate,
                                             PlaceOfEvent = applications.PlaceOfEvent,
                                             ApplicationFee = applications.ApplicationFee,
                                             CreatedById = applications.CreatedById,
                                             DateCreated = applications.DateCreated,
                                             DateUpdated = applications.DateUpdated,

                                        }).ToListAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Flag Application By ApplicationID", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteFlagApplicationByAplicationID")]
        public async Task<object> DeleteFlagApplicationByApplicationID([FromBody] BPFlagApplicationBindingModel model)
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempApplication = _context.BPFlagApplication.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                    if(tempApplication == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could Not Find Application In Database", false));
                    }
                    else
                    {
                        tempApplication.isActive = false;
                        tempApplication.DateUpdated = DateTime.Now;

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Deleted Flag Application", true));
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
