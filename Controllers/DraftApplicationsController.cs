using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;


namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DraftApplicationsController : ControllerBase
    {
        private readonly AppDBContext _context;


        public DraftApplicationsController(AppDBContext context)
        {
            _context = context;

        }
        [HttpPost("AddUpdateDraftApplication")]
        public async Task<object> AddUpdateDraftApplication([FromBody] DraftedProjectsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null )
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.DraftID== 0)
                    {
                        model.DraftID = null;
                    }


                    //this checks is the record exists in the db
                    var tempDraftApplicationTable = _context.DraftedProjectsTable.FirstOrDefault(x => x.DraftID == model.DraftID);


                    if (tempDraftApplicationTable == null)
                    {

                        tempDraftApplicationTable = new DraftedProjects()
                        {

                            ApplicationID = model.ApplicationID,
                            UserID = model.UserID,
                            FullName = model.FullName,
                            Email = model.Email,
                            PhoneNumber = model.PhoneNumber,
                            PhyscialAddress = model.PhyscialAddress,
                            ReferenceNumber = model.ReferenceNumber,
                            CompanyRegNo = model.CompanyRegNo,
                            TypeOfApplication = model.TypeOfApplication,
                            NotificationNumber = model.NotificationNumber,
                            WBSNumber = model.WBSNumber,
                            PhysicalAddressOfProject = model.PhysicalAddressOfProject,
                            DescriptionOfProject = model.DescriptionOfProject,
                            NatureOfWork = model.NatureOfWork,
                            ExcavationType = model.ExcavationType,
                            ExpectedStartDate = model.ExpectedStartDate,
                            ExpectedEndDate = model.ExpectedEndDate,
                            Location = model.Location,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true,
                            ProjectNumber = model.ProjectNumber,
                            Contractor = model.Contractor,
                            DraftID = model.DraftID,
                            Engineer = model.Engineer,



                        };

                        //After the inizlization add to the db
                        await _context.DraftedProjectsTable.AddAsync(tempDraftApplicationTable);
                        await _context.SaveChangesAsync();

                        result = tempDraftApplicationTable;

                    }
                    else //if it is not null then user is doing an update 
                    {
                        if ( model.ApplicationID != null)
                        {
                            tempDraftApplicationTable.ApplicationID = model.ApplicationID;
                        }
                        if (model.UserID != null)
                        {
                            tempDraftApplicationTable.UserID = model.UserID;
                        }

                        if (model.FullName != null)
                        {
                            tempDraftApplicationTable.FullName = model.FullName;
                        }

                        if (model.Email != null)
                        {
                            tempDraftApplicationTable.Email = model.Email;
                        }

                        if (model.PhoneNumber != null)
                        {
                            tempDraftApplicationTable.PhoneNumber = model.PhoneNumber;
                        }

                        if (model.PhyscialAddress != null)
                        {
                            tempDraftApplicationTable.PhyscialAddress = model.PhyscialAddress;
                        }

                        if (model.ReferenceNumber != null)
                        {
                            tempDraftApplicationTable.ReferenceNumber = model.ReferenceNumber;
                        }

                        if (model.CompanyRegNo != null)
                        {
                            tempDraftApplicationTable.CompanyRegNo = model.CompanyRegNo;
                        }

                        if (model.TypeOfApplication != null)
                        {
                            tempDraftApplicationTable.TypeOfApplication = model.TypeOfApplication;
                        }

                        if (model.NotificationNumber != null)
                        {
                            tempDraftApplicationTable.NotificationNumber = model.NotificationNumber;
                        }

                        if (model.WBSNumber != null)
                        {
                            tempDraftApplicationTable.WBSNumber = model.WBSNumber;
                        }

                        if (model.PhysicalAddressOfProject != null)
                        {
                            tempDraftApplicationTable.PhysicalAddressOfProject = model.PhysicalAddressOfProject;
                        }

                        if (model.DescriptionOfProject != null)
                        {
                            tempDraftApplicationTable.DescriptionOfProject = model.DescriptionOfProject;
                        }

                        if (model.NatureOfWork != null)
                        {
                            tempDraftApplicationTable.NatureOfWork = model.NatureOfWork;
                        }

                        if (model.ExcavationType != null)
                        {
                            tempDraftApplicationTable.ExcavationType = model.ExcavationType;
                        }

                        if (model.ExpectedStartDate != null)
                        {
                            tempDraftApplicationTable.ExpectedStartDate = model.ExpectedStartDate;
                        }

                        if (model.ExpectedEndDate != null)
                        {
                            tempDraftApplicationTable.ExpectedEndDate = model.ExpectedEndDate;
                        }

                        if (model.Location != null)
                        {
                            tempDraftApplicationTable.Location = model.Location;
                        }


                        if (model.ProjectNumber != null)
                        {
                            tempDraftApplicationTable.ProjectNumber = model.ProjectNumber;
                        }

                        if (model.CreatedById != null)
                        {
                            tempDraftApplicationTable.CreatedById = model.CreatedById;
                        }
                        if( model.Engineer != null)
                        {
                            tempDraftApplicationTable.Engineer = model.Engineer;
                        }
                        if (model.Contractor != null)
                        {
                            tempDraftApplicationTable.Contractor = model.Contractor;
                        }


                        _context.DraftedProjectsTable.Update(tempDraftApplicationTable);
                        await _context.SaveChangesAsync();
                        result = tempDraftApplicationTable;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID > 0 ? "Application Drafted Updated Successful" : "Draft Application Saved Successfully"), result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }
        [HttpPost("GetDraftedApplicationsList")]
        public async Task<object> GetDraftedApplicationsList([FromBody] DraftedProjectsBindingModel model)
        {
            try
            {
                var result = await (
               from DraftedProjects in _context.DraftedProjectsTable
               where DraftedProjects.isActive == true && DraftedProjects.CreatedById == model.UserID || DraftedProjects.UserID == model.UserID
               select new DraftedProjectsDTO()
               {
                   DraftID = DraftedProjects.DraftID,
                   ApplicationID = DraftedProjects.ApplicationID,
                   UserID = DraftedProjects.UserID,
                   FullName = DraftedProjects.FullName,
                   Email = DraftedProjects.Email,
                   PhoneNumber = DraftedProjects.PhoneNumber,
                   PhyscialAddress = DraftedProjects.PhyscialAddress,
                   ReferenceNumber = DraftedProjects.ReferenceNumber,
                   CompanyRegNo = DraftedProjects.CompanyRegNo,
                   TypeOfApplication = DraftedProjects.TypeOfApplication,
                   NotificationNumber = DraftedProjects.NotificationNumber,
                   WBSNumber = DraftedProjects.WBSNumber,
                   PhysicalAddressOfProject = DraftedProjects.PhysicalAddressOfProject,
                   DescriptionOfProject = DraftedProjects.DescriptionOfProject,
                   NatureOfWork = DraftedProjects.NatureOfWork,
                   ExcavationType = DraftedProjects.ExcavationType,
                   ExpectedStartDate = DraftedProjects.ExpectedStartDate,
                   ExpectedEndDate = DraftedProjects.ExpectedEndDate,
                   Location = DraftedProjects.Location,
                   DateCreated = DraftedProjects.DateCreated,
                   DateUpdated = DraftedProjects.DateUpdated,
                   CreatedById = DraftedProjects.CreatedById,
                   Engineer = DraftedProjects.Engineer,
                   Contractor = DraftedProjects.Contractor,

               }
               ).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Draft Applications for User", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }






        }
        [HttpGet("GetAllDraftApplications")]
        public async Task<object> GetAllDraftApplications(bool? isInternal)
        {
            try
            {
                if (isInternal == true)
                {
                    var result = await (
                        from DraftedProjects in _context.DraftedProjectsTable
                        where DraftedProjects.isActive == true
                        orderby DraftedProjects.DateCreated
                        descending
                        select new DraftedProjectsDTO()
                        {
                            DraftID = DraftedProjects.DraftID,
                            ApplicationID = DraftedProjects.ApplicationID,
                            UserID = DraftedProjects.UserID,
                            FullName = DraftedProjects.FullName,
                            Email = DraftedProjects.Email,
                            PhoneNumber = DraftedProjects.PhoneNumber,
                            PhyscialAddress = DraftedProjects.PhyscialAddress,
                            ReferenceNumber = DraftedProjects.ReferenceNumber,
                            CompanyRegNo = DraftedProjects.CompanyRegNo,
                            TypeOfApplication = DraftedProjects.TypeOfApplication,
                            NotificationNumber = DraftedProjects.NotificationNumber,
                            WBSNumber = DraftedProjects.WBSNumber,
                            PhysicalAddressOfProject = DraftedProjects.PhysicalAddressOfProject,
                            DescriptionOfProject = DraftedProjects.DescriptionOfProject,
                            NatureOfWork = DraftedProjects.NatureOfWork,
                            ExcavationType = DraftedProjects.ExcavationType,
                            ExpectedStartDate = DraftedProjects.ExpectedStartDate,
                            ExpectedEndDate = DraftedProjects.ExpectedEndDate,
                            Location = DraftedProjects.Location,
                            DateCreated = DraftedProjects.DateCreated,
                            DateUpdated = DraftedProjects.DateUpdated,
                            CreatedById = DraftedProjects.CreatedById,
                            isActive = DraftedProjects.isActive,
                            Engineer = DraftedProjects.Engineer,
                            Contractor = DraftedProjects.Contractor,
                            ProjectNumber = DraftedProjects.ProjectNumber,
                        }).ToListAsync();
 

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Draft Applications", result));
                }
                else
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User cannot View all Drafts",null));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPost("DeleteDraftedApplication")]
        public async Task<object> DeleteDraftedApplication([FromBody] int draftID)
        {
            try
            {
                // Check if the record exists in the db
                var result = await _context.DraftedProjectsTable.FindAsync(draftID);

                if (result == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Unable to Delete Draft", false));
                }
                else
                {
                    _context.DraftedProjectsTable.Remove(result);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Draft Deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetDraftedApplicationsByDraftID")]
        public async Task<object> GetDraftedApplicationsByDraftID([FromBody] DraftedProjectsBindingModel model)
        {

            try
            {
                if(model.DraftID == 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (
               from DraftedProjects in _context.DraftedProjectsTable
               where DraftedProjects.ApplicationID == model.ApplicationID && DraftedProjects.isActive == true
               select new DraftedProjectsDTO()
               {
                   DraftID = DraftedProjects.DraftID,
                   ProjectNumber = DraftedProjects.ProjectNumber,
                   ApplicationID = DraftedProjects.ApplicationID,
                   UserID = DraftedProjects.UserID,
                   FullName = DraftedProjects.FullName,
                   Email = DraftedProjects.Email,
                   PhoneNumber = DraftedProjects.PhoneNumber,
                   PhyscialAddress = DraftedProjects.PhyscialAddress,
                   ReferenceNumber = DraftedProjects.ReferenceNumber,
                   CompanyRegNo = DraftedProjects.CompanyRegNo,
                   TypeOfApplication = DraftedProjects.TypeOfApplication,
                   NotificationNumber = DraftedProjects.NotificationNumber,
                   WBSNumber = DraftedProjects.WBSNumber,
                   PhysicalAddressOfProject = DraftedProjects.PhysicalAddressOfProject,
                   DescriptionOfProject = DraftedProjects.DescriptionOfProject,
                   NatureOfWork = DraftedProjects.NatureOfWork,
                   ExcavationType = DraftedProjects.ExcavationType,
                   ExpectedStartDate = DraftedProjects.ExpectedStartDate,
                   ExpectedEndDate = DraftedProjects.ExpectedEndDate,
                   Location = DraftedProjects.Location,
                   DateCreated = DraftedProjects.DateCreated,
                   DateUpdated = DraftedProjects.DateUpdated,
                   CreatedById = DraftedProjects.CreatedById,
                   isActive = DraftedProjects.isActive,
                   Engineer = DraftedProjects.Engineer,
                   Contractor = DraftedProjects.Contractor,

               }
               ).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Selected Draft by ApplicationID", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetDraftedApplicationsListForExternal")]
        public async Task<object> GetDraftedApplicationsListForExternal([FromBody] DraftedProjectsBindingModel model)
        {
            try
            {
                var result = await (
               from DraftedProjects in _context.DraftedProjectsTable
               where DraftedProjects.isActive == true && DraftedProjects.UserID == model.UserID
               select new DraftedProjectsDTO()
               {
                   DraftID = DraftedProjects.DraftID,
                   ApplicationID = DraftedProjects.ApplicationID,
                   UserID = DraftedProjects.UserID,
                   FullName = DraftedProjects.FullName,
                   Email = DraftedProjects.Email,
                   PhoneNumber = DraftedProjects.PhoneNumber,
                   PhyscialAddress = DraftedProjects.PhyscialAddress,
                   ReferenceNumber = DraftedProjects.ReferenceNumber,
                   CompanyRegNo = DraftedProjects.CompanyRegNo,
                   TypeOfApplication = DraftedProjects.TypeOfApplication,
                   NotificationNumber = DraftedProjects.NotificationNumber,
                   WBSNumber = DraftedProjects.WBSNumber,
                   PhysicalAddressOfProject = DraftedProjects.PhysicalAddressOfProject,
                   DescriptionOfProject = DraftedProjects.DescriptionOfProject,
                   NatureOfWork = DraftedProjects.NatureOfWork,
                   ExcavationType = DraftedProjects.ExcavationType,
                   ExpectedStartDate = DraftedProjects.ExpectedStartDate,
                   ExpectedEndDate = DraftedProjects.ExpectedEndDate,
                   Location = DraftedProjects.Location,
                   DateCreated = DraftedProjects.DateCreated,
                   DateUpdated = DraftedProjects.DateUpdated,
                   CreatedById = DraftedProjects.CreatedById,
                   Engineer = DraftedProjects.Engineer,
                   Contractor = DraftedProjects.Contractor,

               }
               ).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Draft Applications for User", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }






        }
    }
}
