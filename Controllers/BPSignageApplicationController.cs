using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Data.Migrations;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPSignageApplicationController : ControllerBase
    {
        private readonly AppDBContext _context;
        
        public BPSignageApplicationController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateSignageApplication")]
        public async Task<object> AddUpdateSignageApplication([FromBody] BPSignageApplicationBindingModel model)
        {
            try
            {
                var result = new object();
                if(model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameter are missing", null));
                }
                else
                {
                    if(model.ApplicationID == 0)
                    {
                        model.ApplicationID = null;
                    }

                    var tempSignageApplication = _context.BPSignageApplication.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                    if(tempSignageApplication == null)
                    {
                        tempSignageApplication = new BPSignageApplication()
                        {
                            ApplicationType = model.ApplicationType,
                            ApplicantType = model.ApplicationType,
                            OrganisationName = model.OrganisationName,
                            UserID = model.UserID,
                            ApplicantName = model.ApplicantName,
                            ApplicantSurname = model.ApplicantSurname,
                            ApplicantCell = model.ApplicantCell,
                            ApplicantTelephone = model.ApplicantTelephone,
                            ApplicantEmail = model.ApplicantEmail,
                            ApplicantFax = model.ApplicantFax,
                            AddressType = model.AddressType,
                            Address = model.Address,
                            NatureOfAdvertisement = model.NatureOfAdvertisement,
                            AreasOfControl = model.AreasOfControl,
                            Height = model.Height,
                            Width = model.Width,
                            NoOfFaces = model.NoOfFaces,
                            StartDate = model.StartDate,
                            EndDate = model.EndDate,
                            ApplicationFee = model.ApplicationFee,
                            MonthlyFee = model.MonthlyFee,
                            Voltage = model.Voltage,
                            ElectrictyRequired = model.ElectrictyRequired,
                            EnvironmentalImpactAssessment = model.EnvironmentalImpactAssessment,
                            AdvertisingSignRight = model.AdvertisingSignRight,
                            Encroachment = model.Encroachment,
                            CreatedById = model.CreatedById,
                            PreviousStage = model.PreviousStage,
                            CurrentStage = model.CurrentStage,
                            ProjectNumber = model.ProjectNumber,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };
                        await _context.BPSignageApplication.AddAsync(tempSignageApplication);
                        await _context.SaveChangesAsync();

                        result = tempSignageApplication;

                    }
                    else
                    {
                        if(model.ApplicationType != null)
                        {
                            tempSignageApplication.ApplicationType = model.ApplicationType;
                        }
                        if(model.ApplicantType != null)
                        {
                            tempSignageApplication.ApplicantType = model.ApplicantType;
                        }
                        if(model.OrganisationName != null)
                        {
                            tempSignageApplication.OrganisationName = model.OrganisationName;
                        }
                        if(model.UserID != null)
                        {
                            tempSignageApplication.UserID = model.UserID;
                        }
                        if (model.ApplicantName != null)
                        {
                            tempSignageApplication.ApplicantName = model.ApplicantName;
                        }
                        if(model.ApplicantSurname != null)
                        {
                            tempSignageApplication.ApplicantSurname = model.ApplicantSurname;
                        }
                        if(model.ApplicantCell != null)
                        {
                            tempSignageApplication.ApplicantCell = model.ApplicantCell;
                        }
                        if(model.ApplicantTelephone != null)
                        {
                            tempSignageApplication.ApplicantTelephone = model.ApplicantTelephone;
                        }
                        if(model.ApplicantEmail != null)
                        {
                            tempSignageApplication.ApplicantEmail = model.ApplicantEmail;
                        }
                        if(model.AddressType != null)
                        {
                            tempSignageApplication.AddressType = model.AddressType;
                        }
                        if(model.Address != null)
                        {
                            tempSignageApplication.Address = model.Address;
                        }
                        if(model.NatureOfAdvertisement != null)
                        {
                            tempSignageApplication.NatureOfAdvertisement = model.NatureOfAdvertisement;
                        }
                        if(model.AreasOfControl != null)
                        {
                            tempSignageApplication.AreasOfControl = model.AreasOfControl;
                        }
                        if(model.Height != null)
                        {
                            tempSignageApplication.Height = model.Height;
                        }
                        if(model.Width != null)
                        {
                            tempSignageApplication.Width = model.Width;
                        }
                        if(model.NoOfFaces != null)
                        {
                            tempSignageApplication.NoOfFaces = model.NoOfFaces;
                        }
                        if(model.StartDate != null)
                        {
                            tempSignageApplication.StartDate = model.StartDate;
                        }
                        if (model.EndDate != null)
                        {
                            tempSignageApplication.EndDate = model.EndDate;
                        }
                        if(model.ApplicationFee != null)
                        {
                            tempSignageApplication.ApplicationFee = model.ApplicationFee;
                        }
                        if(model.MonthlyFee != null)
                        {
                            tempSignageApplication.MonthlyFee = model.MonthlyFee;
                        }
                        if(model.Voltage != null)
                        {
                            tempSignageApplication.Voltage = model.Voltage;
                        }
                        if(model.ElectrictyRequired != null)
                        {
                            tempSignageApplication.ElectrictyRequired = model.ElectrictyRequired;
                        }
                        if(model.EnvironmentalImpactAssessment != null)
                        {
                            tempSignageApplication.EnvironmentalImpactAssessment = model.EnvironmentalImpactAssessment;
                        }
                        if(model.AdvertisingSignRight != null)
                        {
                            tempSignageApplication.AdvertisingSignRight = model.AdvertisingSignRight;
                        }
                        if(model.Encroachment != null)
                        {
                            tempSignageApplication.Encroachment = model.Encroachment;
                        }
                        if(model.PreviousStage != null)
                        {
                            tempSignageApplication.PreviousStage = model.PreviousStage;
                        }
                        if(model.CurrentStage != null)
                        {
                            tempSignageApplication.CurrentStage = model.CurrentStage;
                        }
                        if(model.ProjectNumber != null)
                        {
                            tempSignageApplication.ProjectNumber = model.ProjectNumber;
                        }
                        tempSignageApplication.DateUpdated = DateTime.Now;
                        _context.Update(tempSignageApplication);
                        await _context.SaveChangesAsync();
                        result = tempSignageApplication;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? "Signage Application Updated Successfully" : "Signage Application Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllSignageApplications")]
        public async Task<object> GetAllSignageApplications()
        {
            try
            {
                var result = await (from application in _context.BPSignageApplication
                                    where application.isActive == true
                                    select new BPSignageApplicationDTO()
                                    {
                                        ApplicationID = application.ApplicationID,
                                        ApplicationType = application.ApplicationType,
                                        ApplicantType = application.ApplicantType,
                                        OrganisationName = application.OrganisationName,
                                        UserID = application.UserID,
                                        ApplicantName = application.ApplicantName,
                                        ApplicantSurname = application.ApplicantSurname,
                                        ApplicantCell = application.ApplicantCell,
                                        ApplicantTelephone = application.ApplicantTelephone,
                                        ApplicantFax = application.ApplicantFax,
                                        ApplicantEmail = application.ApplicantEmail,
                                        AddressType = application.AddressType,
                                        Address = application.Address,
                                        NatureOfAdvertisement = application.NatureOfAdvertisement,
                                        AreasOfControl = application.AreasOfControl,
                                        Height = application.Height,
                                        Width = application.Width,
                                        NoOfFaces = application.NoOfFaces,
                                        StartDate = application.StartDate,
                                        EndDate = application.EndDate,
                                        ApplicationFee = application.ApplicationFee,
                                        MonthlyFee = application.MonthlyFee,
                                        Voltage = application.Voltage,
                                        ElectrictyRequired = application.ElectrictyRequired,
                                        EnvironmentalImpactAssessment = application.EnvironmentalImpactAssessment,
                                        AdvertisingSignRight = application.AdvertisingSignRight,
                                        Encroachment = application.Encroachment,
                                        PreviousStage = application.PreviousStage,
                                        CurrentStage = application.CurrentStage,
                                        ProjectNumber = application.ProjectNumber,
                                        DateCreated = application.DateCreated,
                                        DateUpdated = application.DateUpdated,
                                        CreatedById = application.CreatedById,
                                        
                                         
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Signage Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        
    }
}
