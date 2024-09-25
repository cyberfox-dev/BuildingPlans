using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Service;
using BuildingPlans.Models.DTO;
using BuildingPlans.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Runtime.CompilerServices;
using iText.Commons.Actions.Contexts;
using NetTopologySuite.Geometries;
namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuildingApplicationController : ControllerBase
    {
        private readonly AppDBContext _context;
        public BuildingApplicationController(AppDBContext context)
        {
            _context = context;

        }
        [HttpPost("AddUpdateBuildingApplication")]
        public async Task<object> AddUpdateBuildingApplication([FromBody] BuildingApplicationBindingModel model)
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

                    var tempBuildingApplication = _context.BuildingApplications.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                    if (tempBuildingApplication == null)
                    {
                        tempBuildingApplication = new BuildingApplication()
                        {
                            LSNumber = model.LSNumber,
                            UserID = model.UserID,
                            FirstName = model.FirstName,
                            Surname = model.Surname,
                            EmailAddress = model.EmailAddress,
                            CellNumber = model.CellNumber,
                            AltEmail = model.AltEmail,
                            PhysicalAddress = model.PhysicalAddress,
                            AltCellNumber = model.AltCellNumber,
                            IDNumber = model.IDNumber,
                            PropertyDescription = model.PropertyDescription,
                            PremisesName = model.PremisesName,
                            AddressType = model.AddressType,
                            ErfNumber = model.ErfNumber,
                            PortionNumber = model.PortionNumber,
                            NoOfUnits = model.NoOfUnits,
                            UnitNumber = model.UnitNumber,
                            Latitude = model.Latitude,
                            Longitude = model.Longitude,
                            ArchitectName = model.ArchitectName,
                            BuildingPlanFor = model.BuildingPlanFor,
                            TypeOfDevelopment = model.TypeOfDevelopment,
                            TotalArea = model.TotalArea,
                            OccupationClassification = model.OccupationClassification,
                            PlanFees = model.PlanFees,
                            PropertyValue = model.PropertyValue,
                            StreetAddress = model.StreetAddress,
                            Suburb = model.Suburb,
                            City = model.City,
                            PostalCode = model.PostalCode,
                            SGCode = model.SGCode,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                            CreatedById = model.CreatedById,
                            Stage = model.Stage,
                            StageNumber = model.StageNumber,
                            Status = model.Status,
                            OmnibusServitude = model.OmnibusServitude,
                            BPApplicationID = model.BPApplicationID,
                            BPApplicationType= model.BPApplicationType,
                            ApplicationType= model.ApplicationType,
                           isCombinedApplication = model.isCombinedApplication,
                           NameOfCompany = model.NameOfCompany,
                           NatureOfWorks = model.NatureOfWorks,
                           TitleDeedNo = model.TitleDeedNo,
                           ExtentOfProperty = model.ExtentOfProperty,
                           DescriptionOfProject = model.DescriptionOfProject,
                           RegNoOfCompany = model.RegNoOfCompany,
                           RegisteredDescription = model.RegisteredDescription,
                           SizeOfApplication = model.SizeOfApplication,
                           TitleRestrictions = model.TitleRestrictions,
                           TypeOfExcavation = model.TypeOfExcavation,
                           ValueOfProperty = model.ValueOfProperty,

                        };
                        await _context.BuildingApplications.AddAsync(tempBuildingApplication);
                        await _context.SaveChangesAsync();

                        result = tempBuildingApplication;
                    }
                    else
                    {
                        if (model.LSNumber != null)
                        {
                            tempBuildingApplication.LSNumber = model.LSNumber;
                        }

                        if (model.UserID != null)
                        {
                            tempBuildingApplication.UserID = model.UserID;
                        }
                        if (model.FirstName != null)
                        {
                            tempBuildingApplication.FirstName = model.FirstName;
                        }
                        if (model.Surname != null)
                        {
                            tempBuildingApplication.Surname = model.Surname;
                        }
                        if (model.EmailAddress != null)
                        {
                            tempBuildingApplication.EmailAddress = model.EmailAddress;
                        }
                        if (model.CellNumber != null)
                        {
                            tempBuildingApplication.CellNumber = model.CellNumber;
                        }
                        if (model.AltEmail != null)
                        {
                            tempBuildingApplication.AltEmail = model.AltEmail;
                        }
                        if (model.AltCellNumber != null)
                        {
                            tempBuildingApplication.AltCellNumber = model.AltCellNumber;
                        }
                        if (model.IDNumber != null)
                        {
                            tempBuildingApplication.IDNumber = model.IDNumber;
                        }
                        if (model.PropertyDescription != null)
                        {
                            tempBuildingApplication.PropertyDescription = model.PropertyDescription;
                        }
                        if (model.PremisesName != null)
                        {
                            tempBuildingApplication.PremisesName = model.PremisesName;
                        }
                        if (model.AddressType != null)
                        {
                            tempBuildingApplication.AddressType = model.AddressType;
                        }
                        if (model.ErfNumber != null)
                        {
                            tempBuildingApplication.ErfNumber = model.ErfNumber;
                        }
                        if (model.PortionNumber != null)
                        {
                            tempBuildingApplication.PortionNumber = model.PortionNumber;
                        }
                        if (model.NoOfUnits != null)
                        {
                            tempBuildingApplication.NoOfUnits = model.NoOfUnits;
                        }
                        if (model.UnitNumber != null)
                        {
                            tempBuildingApplication.UnitNumber = model.UnitNumber;
                        }
                        if (model.PhysicalAddress != null)
                        {
                            tempBuildingApplication.PhysicalAddress = model.PhysicalAddress;
                        }
                        if (model.Latitude != null)
                        {
                            tempBuildingApplication.Latitude = model.Latitude;
                        }
                        if (model.Longitude != null)
                        {
                            tempBuildingApplication.Longitude = model.Longitude;
                        }
                        if (model.ArchitectName != null)
                        {
                            tempBuildingApplication.ArchitectName = model.ArchitectName;
                        }
                        if (model.BuildingPlanFor != null)
                        {
                            tempBuildingApplication.BuildingPlanFor = model.BuildingPlanFor;
                        }
                        if (model.TypeOfDevelopment != null)
                        {
                            tempBuildingApplication.TypeOfDevelopment = model.TypeOfDevelopment;
                        }
                        if (model.TotalArea != null)
                        {
                            tempBuildingApplication.TotalArea = model.TotalArea;
                        }
                        if (model.OccupationClassification != null)
                        {
                            tempBuildingApplication.OccupationClassification = model.OccupationClassification;
                        }
                        if (model.PlanFees != null)
                        {
                            tempBuildingApplication.PlanFees = model.PlanFees;
                        }
                        if (model.PropertyValue != null)
                        {
                            tempBuildingApplication.PropertyValue = model.PropertyValue;
                        }
                        if (model.StreetAddress != null)
                        {
                            tempBuildingApplication.StreetAddress = model.StreetAddress;
                        }
                        if (model.Suburb != null)
                        {
                            tempBuildingApplication.Suburb = model.Suburb;
                        }
                        if (model.City != null)
                        {
                            tempBuildingApplication.City = model.City;
                        }
                        if (model.PostalCode != null)
                        {
                            tempBuildingApplication.PostalCode = model.PostalCode;
                        }
                        if (model.SGCode != null)
                        {
                            tempBuildingApplication.SGCode = model.SGCode;
                        }
                        if (model.Status != null)
                        {
                            tempBuildingApplication.Status = model.Status;
                        }
                        if (model.Stage != null)
                        {
                            tempBuildingApplication.Stage = model.Stage;
                        }
                        if (model.StageNumber != null)
                        {
                            tempBuildingApplication.StageNumber = model.StageNumber;
                        }
                        if (model.OmnibusServitude != null)
                        {
                            tempBuildingApplication.OmnibusServitude = model.OmnibusServitude;
                        }
                        if (model.BPApplicationID != null)
                        {
                            tempBuildingApplication.BPApplicationID = model.BPApplicationID;
                        }
                        if (model.BPApplicationType != null)
                        {
                            tempBuildingApplication.BPApplicationType = model.BPApplicationType;
                        }
                        if (model.ApplicationType != null)
                        {
                            tempBuildingApplication.ApplicationType = model.ApplicationType;
                        }
                        if (model.isCombinedApplication != null)
                        {
                            tempBuildingApplication.isCombinedApplication = model.isCombinedApplication;
                        }
                        if (model.isCombinedApplication != null)
                        {
                            tempBuildingApplication.isCombinedApplication = model.isCombinedApplication;
                        }
                        if (model.NameOfCompany != null)
                        {
                            tempBuildingApplication.NameOfCompany = model.NameOfCompany;
                        }
                        if (model.RegNoOfCompany != null)
                        {
                            tempBuildingApplication.RegNoOfCompany = model.RegNoOfCompany;
                        }
                        if (model.RegisteredDescription != null)
                        {
                            tempBuildingApplication.RegisteredDescription = model.RegisteredDescription;
                        }
                        if (model.TitleRestrictions != null)
                        {
                            tempBuildingApplication.TitleRestrictions = model.TitleRestrictions;
                        }
                        if (model.ExtentOfProperty != null)
                        {
                            tempBuildingApplication.ExtentOfProperty = model.ExtentOfProperty;
                        }
                        if (model.TitleDeedNo != null)
                        {
                            tempBuildingApplication.TitleDeedNo = model.TitleDeedNo;
                        }
                        if (model.DescriptionOfProject != null)
                        {
                            tempBuildingApplication.DescriptionOfProject = model.DescriptionOfProject;
                        }
                        if (model.ValueOfProperty != null)
                        {
                            tempBuildingApplication.ValueOfProperty = model.ValueOfProperty;
                        }
                        if (model.SizeOfApplication != null)
                        {
                            tempBuildingApplication.SizeOfApplication = model.SizeOfApplication;
                        }
                        if (model.TypeOfExcavation != null)
                        {
                            tempBuildingApplication.TypeOfExcavation = model.TypeOfExcavation;
                        }
                        if (model.NatureOfWorks != null)
                        {
                            tempBuildingApplication.NatureOfWorks = model.NatureOfWorks;
                        }
                        tempBuildingApplication.DateUpdated = DateTime.Now;

                        _context.Update(tempBuildingApplication);
                        await _context.SaveChangesAsync();

                        result = tempBuildingApplication;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? " Application Updated Successfully" : "Application Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllBuildingApplications")]
        public async Task<object> GetAllBuildingApplications()
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.isActive == true && buildingApplication.LSNumber != null
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,
                        BPApplicationID = buildingApplication.BPApplicationID,
                        TitleRestrictions = buildingApplication.TitleRestrictions,
                        ExtentOfProperty = buildingApplication.ExtentOfProperty,
                        TitleDeedNo = buildingApplication.TitleDeedNo,
                        RegisteredDescription = buildingApplication.RegisteredDescription,
                        ApplicationType = buildingApplication.ApplicationType,
                        BPApplicationType = buildingApplication.BPApplicationType,
                        DescriptionOfProject = buildingApplication.DescriptionOfProject,
                        isCombinedApplication = buildingApplication.isCombinedApplication,
                        NameOfCompany = buildingApplication.NameOfCompany,
                        RegNoOfCompany = buildingApplication.RegNoOfCompany,
                    }
                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetBuildingApplicationByApplicationID")]
        public async Task<object> GetBuildingApplicationByApplicationID([FromBody] BuildingApplicationBindingModel model)
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.ApplicationID == model.ApplicationID && buildingApplication.isActive == true
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,
                        BPApplicationID = buildingApplication.BPApplicationID,
                        BPApplicationType = buildingApplication.BPApplicationType,
                        TitleRestrictions = buildingApplication.TitleRestrictions,
                        ExtentOfProperty = buildingApplication.ExtentOfProperty,
                        TitleDeedNo = buildingApplication.TitleDeedNo,
                        RegisteredDescription = buildingApplication.RegisteredDescription,
                        ApplicationType = buildingApplication.ApplicationType,
                        DescriptionOfProject = buildingApplication.DescriptionOfProject,
                        isCombinedApplication = buildingApplication.isCombinedApplication,
                        NameOfCompany = buildingApplication.NameOfCompany,
                        RegNoOfCompany = buildingApplication.RegNoOfCompany,

                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Application By ApplicationID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetApplicationsByInternalUserID")]
        public async Task<object> GetApplicationsByInternalUserID([FromBody] BuildingApplicationBindingModel model)
        {
            try
            {
                var result = await (from buildingApplication in _context.BuildingApplications
                                    where buildingApplication.isActive == true && buildingApplication.ArchitectName == model.ArchitectName
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = buildingApplication.ApplicationID,
                                        LSNumber = buildingApplication.LSNumber,
                                        UserID = buildingApplication.UserID,
                                        FirstName = buildingApplication.FirstName,
                                        Surname = buildingApplication.Surname,
                                        EmailAddress = buildingApplication.EmailAddress,
                                        CellNumber = buildingApplication.CellNumber,
                                        AltEmail = buildingApplication.AltEmail,
                                        AltCellNumber = buildingApplication.AltCellNumber,
                                        IDNumber = buildingApplication.IDNumber,
                                        PropertyDescription = buildingApplication.PropertyDescription,
                                        PremisesName = buildingApplication.PremisesName,
                                        AddressType = buildingApplication.AddressType,
                                        ErfNumber = buildingApplication.ErfNumber,
                                        PortionNumber = buildingApplication.PortionNumber,
                                        NoOfUnits = buildingApplication.NoOfUnits,
                                        UnitNumber = buildingApplication.UnitNumber,
                                        PhysicalAddress = buildingApplication.PhysicalAddress,
                                        Latitude = buildingApplication.Latitude,
                                        Longitude = buildingApplication.Longitude,
                                        ArchitectName = buildingApplication.ArchitectName,
                                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                                        TotalArea = buildingApplication.TotalArea,
                                        OccupationClassification = buildingApplication.OccupationClassification,
                                        PlanFees = buildingApplication.PlanFees,
                                        PropertyValue = buildingApplication.PropertyValue,
                                        StreetAddress = buildingApplication.StreetAddress,
                                        Suburb = buildingApplication.Suburb,
                                        City = buildingApplication.City,
                                        PostalCode = buildingApplication.PostalCode,
                                        SGCode = buildingApplication.SGCode,
                                        DateCreated = buildingApplication.DateCreated,
                                        DateUpdated = buildingApplication.DateUpdated,
                                        OmnibusServitude = buildingApplication.OmnibusServitude,
                                        BPApplicationID = buildingApplication.BPApplicationID,


                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Application By Internal UserID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetApplicationsByExternalUserID")]
        public async Task<object> GetApplicationsByExternalUserID([FromBody] BuildingApplicationBindingModel model)
        {
            try
            {
                var result = await (from buildingApplication in _context.BuildingApplications
                                    where model.UserID == buildingApplication.UserID || model.UserID == buildingApplication.CreatedById
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = buildingApplication.ApplicationID,
                                        LSNumber = buildingApplication.LSNumber,
                                        UserID = buildingApplication.UserID,
                                        FirstName = buildingApplication.FirstName,
                                        Surname = buildingApplication.Surname,
                                        EmailAddress = buildingApplication.EmailAddress,
                                        CellNumber = buildingApplication.CellNumber,
                                        AltEmail = buildingApplication.AltEmail,
                                        AltCellNumber = buildingApplication.AltCellNumber,
                                        IDNumber = buildingApplication.IDNumber,
                                        PropertyDescription = buildingApplication.PropertyDescription,
                                        PremisesName = buildingApplication.PremisesName,
                                        AddressType = buildingApplication.AddressType,
                                        ErfNumber = buildingApplication.ErfNumber,
                                        PortionNumber = buildingApplication.PortionNumber,
                                        NoOfUnits = buildingApplication.NoOfUnits,
                                        UnitNumber = buildingApplication.UnitNumber,
                                        PhysicalAddress = buildingApplication.PhysicalAddress,
                                        Latitude = buildingApplication.Latitude,
                                        Longitude = buildingApplication.Longitude,
                                        ArchitectName = buildingApplication.ArchitectName,
                                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                                        TotalArea = buildingApplication.TotalArea,
                                        OccupationClassification = buildingApplication.OccupationClassification,
                                        PlanFees = buildingApplication.PlanFees,
                                        PropertyValue = buildingApplication.PropertyValue,
                                        StreetAddress = buildingApplication.StreetAddress,
                                        Suburb = buildingApplication.Suburb,
                                        City = buildingApplication.City,
                                        PostalCode = buildingApplication.PostalCode,
                                        SGCode = buildingApplication.SGCode,
                                        DateCreated = buildingApplication.DateCreated,
                                        DateUpdated = buildingApplication.DateUpdated,
                                        OmnibusServitude = buildingApplication.OmnibusServitude,
                                        Stage = buildingApplication.Stage,
                                        Status = buildingApplication.Status,
                                        BPApplicationID = buildingApplication.BPApplicationID,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Application By External UserID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteApplicationByApplicationID")]
        public async Task<object> DeleteApplicationByApplicationID([FromBody] BuildingApplicationBindingModel model)
        {
            try
            {
                var tempApplicationTable = await _context.BuildingApplications.FindAsync(model.ApplicationID);
                if (tempApplicationTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Application does not exist on database", false));
                }
                else
                {
                    tempApplicationTable.isActive = false;
                    _context.Update(tempApplicationTable);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Application Deleted successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("RemoveBuildingApplication")]
        public async Task<object> RemoveBuildingApplication([FromBody] BuildingApplicationBindingModel model)
        {
            try
            {
                if (model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

                else
                {
                    var tempBuildingApplication = _context.BuildingApplications.FirstOrDefault(x => x.ApplicationID == model.ApplicationID);

                    if (tempBuildingApplication == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not find application in database ", false));
                    }
                    else
                    {

                        _context.Remove(tempBuildingApplication);
                        _context.SaveChanges();
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Application Removed", true));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetBuildingApplicationByStageName")]
        public async Task<object> GetBuildingApplicationByStageName([FromBody] BuildingApplicationBindingModel model)
        {
            try
            {
                var result = await (from buildingApplication in _context.BuildingApplications
                                    where buildingApplication.Stage == model.Stage && buildingApplication.isActive == true
                                    select new BuildingApplicationDTO()
                                    {
                                        ApplicationID = buildingApplication.ApplicationID,
                                        LSNumber = buildingApplication.LSNumber,
                                        UserID = buildingApplication.UserID,
                                        FirstName = buildingApplication.FirstName,
                                        Surname = buildingApplication.Surname,
                                        EmailAddress = buildingApplication.EmailAddress,
                                        CellNumber = buildingApplication.CellNumber,
                                        AltEmail = buildingApplication.AltEmail,
                                        AltCellNumber = buildingApplication.AltCellNumber,
                                        IDNumber = buildingApplication.IDNumber,
                                        PropertyDescription = buildingApplication.PropertyDescription,
                                        PremisesName = buildingApplication.PremisesName,
                                        AddressType = buildingApplication.AddressType,
                                        ErfNumber = buildingApplication.ErfNumber,
                                        PortionNumber = buildingApplication.PortionNumber,
                                        NoOfUnits = buildingApplication.NoOfUnits,
                                        UnitNumber = buildingApplication.UnitNumber,
                                        PhysicalAddress = buildingApplication.PhysicalAddress,
                                        Latitude = buildingApplication.Latitude,
                                        Longitude = buildingApplication.Longitude,
                                        ArchitectName = buildingApplication.ArchitectName,
                                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                                        TotalArea = buildingApplication.TotalArea,
                                        OccupationClassification = buildingApplication.OccupationClassification,
                                        PlanFees = buildingApplication.PlanFees,
                                        PropertyValue = buildingApplication.PropertyValue,
                                        StreetAddress = buildingApplication.StreetAddress,
                                        Suburb = buildingApplication.Suburb,
                                        City = buildingApplication.City,
                                        PostalCode = buildingApplication.PostalCode,
                                        SGCode = buildingApplication.SGCode,
                                        DateCreated = buildingApplication.DateCreated,
                                        DateUpdated = buildingApplication.DateUpdated,
                                        OmnibusServitude = buildingApplication.OmnibusServitude,
                                        Stage = buildingApplication.Stage,
                                        BPApplicationID = buildingApplication.BPApplicationID,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications By Stage", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }


        [HttpGet("GetAllPreInvoiceScrutinyApplications")]
        public async Task<object> GetAllPreInvoiceScrutinyApplications()
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.isActive == true && buildingApplication.BPApplicationID == null
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,
                        BPApplicationID = buildingApplication.BPApplicationID,

                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Application By ApplicationID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpGet("GetAllLSApplications")]
        public async Task<object> GetAllLSApplications()
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.isActive == true && buildingApplication.BPApplicationType == "Land Survey" && buildingApplication.FirstName != null
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,
                        BPApplicationID = buildingApplication.BPApplicationID,
                        BPApplicationType = buildingApplication.BPApplicationType,
                    }
                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllTPApplications")]
        public async Task<object> GetAllTPApplications()
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.isActive == true && buildingApplication.BPApplicationType == "Town Planning" && buildingApplication.FirstName != null
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,
                        BPApplicationID = buildingApplication.BPApplicationID,
                        TitleRestrictions = buildingApplication.TitleRestrictions,
                        ExtentOfProperty = buildingApplication.ExtentOfProperty,
                        TitleDeedNo = buildingApplication.TitleDeedNo,
                        RegisteredDescription = buildingApplication.RegisteredDescription,
                        ApplicationType = buildingApplication.ApplicationType,
                        BPApplicationType = buildingApplication.BPApplicationType,
                        DescriptionOfProject = buildingApplication.DescriptionOfProject,
                        isCombinedApplication = buildingApplication.isCombinedApplication,
                        NameOfCompany = buildingApplication.NameOfCompany,
                        RegNoOfCompany = buildingApplication.RegNoOfCompany,
                        
                    }
                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }   
        
        [HttpGet("GetAllBuildingPlansApplications")]
        public async Task<object> GetAllBuildingPlansApplications()
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.isActive == true && buildingApplication.BPApplicationType == "Building Plans" && buildingApplication.FirstName != null
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,
                        BPApplicationID = buildingApplication.BPApplicationID,
                    }
                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Applications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllApplications")]
        public async Task<object> GetAllApplications()
        {
            try
            {
                var result = await (
                    from buildingApplication in _context.BuildingApplications
                    where buildingApplication.isActive == true && buildingApplication.FirstName != null
                    orderby buildingApplication.DateCreated descending
                    select new BuildingApplicationDTO()
                    {
                        ApplicationID = buildingApplication.ApplicationID,
                        LSNumber = buildingApplication.LSNumber,
                        UserID = buildingApplication.UserID,
                        FirstName = buildingApplication.FirstName,
                        Surname = buildingApplication.Surname,
                        EmailAddress = buildingApplication.EmailAddress,
                        CellNumber = buildingApplication.CellNumber,
                        AltEmail = buildingApplication.AltEmail,
                        AltCellNumber = buildingApplication.AltCellNumber,
                        IDNumber = buildingApplication.IDNumber,
                        PropertyDescription = buildingApplication.PropertyDescription,
                        PremisesName = buildingApplication.PremisesName,
                        AddressType = buildingApplication.AddressType,
                        ErfNumber = buildingApplication.ErfNumber,
                        PortionNumber = buildingApplication.PortionNumber,
                        NoOfUnits = buildingApplication.NoOfUnits,
                        UnitNumber = buildingApplication.UnitNumber,
                        PhysicalAddress = buildingApplication.PhysicalAddress,
                        Latitude = buildingApplication.Latitude,
                        Longitude = buildingApplication.Longitude,
                        ArchitectName = buildingApplication.ArchitectName,
                        BuildingPlanFor = buildingApplication.BuildingPlanFor,
                        TypeOfDevelopment = buildingApplication.TypeOfDevelopment,
                        TotalArea = buildingApplication.TotalArea,
                        OccupationClassification = buildingApplication.OccupationClassification,
                        PlanFees = buildingApplication.PlanFees,
                        PropertyValue = buildingApplication.PropertyValue,
                        StreetAddress = buildingApplication.StreetAddress,
                        Suburb = buildingApplication.Suburb,
                        City = buildingApplication.City,
                        PostalCode = buildingApplication.PostalCode,
                        SGCode = buildingApplication.SGCode,
                        DateCreated = buildingApplication.DateCreated,
                        DateUpdated = buildingApplication.DateUpdated,
                        OmnibusServitude = buildingApplication.OmnibusServitude,
                        Stage = buildingApplication.Stage,
                        Status = buildingApplication.Status,
                        StageNumber = buildingApplication.StageNumber,
                        CreatedById = buildingApplication.CreatedById,

                        BPApplicationID = buildingApplication.BPApplicationID,
                        TitleRestrictions = buildingApplication.TitleRestrictions,
                        ExtentOfProperty = buildingApplication.ExtentOfProperty,
                        TitleDeedNo = buildingApplication.TitleDeedNo,
                        RegisteredDescription = buildingApplication.RegisteredDescription,
                        ApplicationType = buildingApplication.ApplicationType,
                        BPApplicationType = buildingApplication.BPApplicationType,
                        DescriptionOfProject = buildingApplication.DescriptionOfProject,
                        isCombinedApplication = buildingApplication.isCombinedApplication,
                        NameOfCompany = buildingApplication.NameOfCompany,
                        RegNoOfCompany = buildingApplication.RegNoOfCompany,

                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Application By ApplicationID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        
    }
}
