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
using System.Runtime.InteropServices;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPBannerApplicationController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPBannerApplicationController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateBannerApplication")]
        public async Task<object> AddUpdateBannerApplication([FromBody] BPBannerApplicationBindingModel model)
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
                    if (model.ApplicationID == 0)
                    {
                        model.ApplicationID = null;
                    }

                    var tempBannerApplication = _context.BPBannerApplication.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                    if (tempBannerApplication == null)
                    {
                        tempBannerApplication = new BPBannerApplication()
                        {
                            UserID = model.UserID,
                            ApplicantName = model.ApplicantName,
                            ApplicantSurname = model.ApplicantSurname,
                            ApplicantEmail = model.ApplicantEmail,
                            ApplicantFax = model.ApplicantFax,
                            ApplicantCell = model.ApplicantCell,
                            ApplicantTelephone = model.ApplicantTelephone,
                            Address = model.Address,
                            TypeOfAdvert = model.TypeOfAdvert,
                            NatureOfEvent = model.NatureOfEvent,
                            DescriptionOfAdvert = model.DescriptionOfAdvert,
                            NameOfEvent = model.NameOfEvent,
                            StartDate = model.StartDate,
                            EndDate = model.EndDate,
                            SizeOfPoster = model.SizeOfPoster,
                            NumberOfPosters = model.NumberOfPosters,
                            ApplicationFee = model.ApplicationFee,
                            PreviousStage = model.PreviousStage,
                            CurrentStage = model.CurrentStage,
                            NextStage = model.NextStage
                        };

                        await _context.BPBannerApplication.AddAsync(tempBannerApplication);
                        await _context.SaveChangesAsync();

                        result = tempBannerApplication;
                    }
                    else
                    {
                        if (model.UserID != null)
                        {
                            tempBannerApplication.UserID = model.UserID;
                        }
                        if (model.ApplicantName != null)
                        {
                            tempBannerApplication.ApplicantName = model.ApplicantName;
                        }
                        if (model.ApplicantSurname != null)
                        {
                            tempBannerApplication.ApplicantSurname = model.ApplicantSurname;
                        }
                        if (model.ApplicantEmail != null)
                        {
                            tempBannerApplication.ApplicantEmail = model.ApplicantEmail;
                        }
                        if (model.ApplicantFax != null)
                        {
                            tempBannerApplication.ApplicantFax = model.ApplicantFax;
                        }
                        if (model.ApplicantCell != null)
                        {
                            tempBannerApplication.ApplicantCell = model.ApplicantCell;
                        }
                        if (model.ApplicantTelephone != null)
                        {
                            tempBannerApplication.ApplicantTelephone = model.ApplicantEmail;
                        }
                        if (model.Address != null)
                        {
                            tempBannerApplication.Address = model.Address;
                        }
                        if (model.TypeOfAdvert != null)
                        {
                            tempBannerApplication.TypeOfAdvert = model.TypeOfAdvert;
                        }
                        if (model.NameOfEvent != null)
                        {
                            tempBannerApplication.NameOfEvent = model.NameOfEvent;
                        }
                        if (model.StartDate != null)
                        {
                            tempBannerApplication.StartDate = model.StartDate;
                        }
                        if (model.EndDate != null)
                        {
                            tempBannerApplication.EndDate = model.EndDate;
                        }
                        if (model.SizeOfPoster != null)
                        {
                            tempBannerApplication.SizeOfPoster = model.SizeOfPoster;
                        }
                        if (model.NumberOfPosters != null)
                        {
                            tempBannerApplication.NumberOfPosters = model.NumberOfPosters;
                        }
                        if (model.ApplicationFee != null)
                        {
                            tempBannerApplication.ApplicationFee = model.ApplicationFee;
                        }
                        if (model.PreviousStage != null)
                        {
                            tempBannerApplication.PreviousStage = model.PreviousStage;
                        }
                        if (model.CurrentStage != null)
                        {
                            tempBannerApplication.CurrentStage = model.CurrentStage;
                        }
                        if (model.NextStage != null)
                        {
                            tempBannerApplication.NextStage = model.NextStage;
                        }

                        _context.Update(tempBannerApplication);
                        await _context.SaveChangesAsync();

                        result = tempBannerApplication;

                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? "Banner Application Updated Successfully" : "Banner Application Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllBannerApplications")]
        public async Task<object> GetAllBannerApplications()
        {
            try
            {
                var result = await (from applications in _context.BPBannerApplication
                                    where applications.isActive == true
                                    select new BPBannerApplicationDTO()
                                    {
                                        ApplicationID = applications.ApplicationID,
                                        UserID = applications.UserID,
                                        ApplicantName = applications.ApplicantName,
                                        ApplicantSurname = applications.ApplicantSurname,
                                        ApplicantEmail = applications.ApplicantEmail,
                                        ApplicantFax = applications.ApplicantFax,
                                        ApplicantCell = applications.ApplicantCell,
                                        ApplicantTelephone = applications.ApplicantTelephone,
                                        Address = applications.Address,
                                        TypeOfAdvert = applications.TypeOfAdvert,
                                        NatureOfEvent = applications.NatureOfEvent,
                                        DescriptionOfAdvert = applications.DescriptionOfAdvert,
                                        NameOfEvent = applications.NameOfEvent,
                                        StartDate = applications.StartDate,
                                        EndDate = applications.EndDate,
                                        SizeOfPoster = applications.SizeOfPoster,
                                        NumberOfPosters = applications.NumberOfPosters,
                                        ApplicationFee = applications.ApplicationFee,
                                        PreviousStage = applications.PreviousStage,
                                        CurrentStage = applications.CurrentStage,
                                        NextStage = applications.NextStage,
                                        CreatedById = applications.CreatedById,
                                        DateCreated = applications.DateCreated,
                                        DateUpdated = applications.DateUpdated,


                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Banner Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetBannerApplicationByApplicationID")]
        public async Task<object> GetBannerApplicationByApplicationID([FromBody] BPBannerApplicationBindingModel model)
        {
            try
            {
                if(model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from applications in _context.BPBannerApplication
                                        where applications.ApplicationID == model.ApplicationID && applications.isActive == true
                                        select new BPBannerApplicationDTO()
                                        {
                                            ApplicationID = applications.ApplicationID,
                                            UserID = applications.UserID,
                                            ApplicantName = applications.ApplicantName,
                                            ApplicantSurname = applications.ApplicantSurname,
                                            ApplicantEmail = applications.ApplicantEmail,
                                            ApplicantFax = applications.ApplicantFax,
                                            ApplicantCell = applications.ApplicantCell,
                                            ApplicantTelephone = applications.ApplicantTelephone,
                                            Address = applications.Address,
                                            TypeOfAdvert = applications.TypeOfAdvert,
                                            NatureOfEvent = applications.NatureOfEvent,
                                            DescriptionOfAdvert = applications.DescriptionOfAdvert,
                                            NameOfEvent = applications.NameOfEvent,
                                            StartDate = applications.StartDate,
                                            EndDate = applications.EndDate,
                                            SizeOfPoster = applications.SizeOfPoster,
                                            NumberOfPosters = applications.NumberOfPosters,
                                            ApplicationFee = applications.ApplicationFee,
                                            PreviousStage = applications.PreviousStage,
                                            CurrentStage = applications.CurrentStage,
                                            NextStage = applications.NextStage,
                                            CreatedById = applications.CreatedById,
                                            DateCreated = applications.DateCreated,
                                            DateUpdated = applications.DateUpdated,
                                        }).ToListAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Banner Applications", result));

                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteBannerApplicationByApplicationID")]
        public async Task<object> DeleteApplicationByApplicationID([FromBody] BPBannerApplicationBindingModel model)
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.ApplicationID == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing",null));
                    }
                    else
                    {
                        var tempApplication =  _context.BPBannerApplication.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                        if (tempApplication == null)
                        {
                            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could Not Find Application On Database", false));
                        }
                        else
                        {
                            tempApplication.isActive = false;
                            tempApplication.DateUpdated = DateTime.Now;

                            _context.Update(tempApplication);
                            await _context.SaveChangesAsync();

                            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Deleted Successfully",true));
                        }
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

