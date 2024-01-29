using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using System.Data;
using WayleaveManagementSystem.Models;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditTrailController : ControllerBase
    {
         //Audit Trail Kyle 
        private readonly AppDBContext _context;

        public AuditTrailController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateAuditTrailItem")]
        public async Task<object> AddUpdateAuditTrailItem([FromBody] AuditTrailBindingModel model)
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
                    if(model.AuditTrailID == 0)
                    {
                        model.AuditTrailID = null;
                    }

                    var tempAuditTrailItem = _context.AuditTrail.FirstOrDefault(x => x.AuditTrailID == model.AuditTrailID);

                    if(tempAuditTrailItem == null)
                    {
                        tempAuditTrailItem = new AuditTrail()
                        {
                            ApplicationID = model.ApplicationID,
                            Description = model.Description,
                            IsInternal = model.IsInternal,
                            SubDepartmentName = model.SubDepartmentName,
                            ZoneName = model.ZoneName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };
                        await _context.AuditTrail.AddAsync(tempAuditTrailItem);
                        await _context.SaveChangesAsync();

                        result = tempAuditTrailItem;
                    }
                    else
                    {
                        if(model.Description != null)
                        {
                            tempAuditTrailItem.Description = model.Description;
                        }

                        if(model.IsInternal != null)
                        {
                            tempAuditTrailItem.IsInternal = model.IsInternal;
                        }
                        if(model.SubDepartmentName != null)
                        {
                            tempAuditTrailItem.SubDepartmentName = model.SubDepartmentName;
                        }
                        if(model.ZoneName != null)
                        {
                            tempAuditTrailItem.ZoneName = model.ZoneName;
                        }
                        tempAuditTrailItem.DateUpdated = DateTime.Now;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AuditTrailID > 0 ? "Audit trail item updated successfully " : "Audit trial item created successfully"), result));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

           
        }

        [HttpPost("GetAllAuditTrailItemsForApplication")]
        public async Task<object> GetAllAuditTrailItemsForApplication([FromBody] AuditTrailBindingModel model)
        {
            try 
            {
                var result = await (
                    from AuditTrail in _context.AuditTrail
                    where AuditTrail.ApplicationID == model.ApplicationID && AuditTrail.isActive == true 
                    orderby AuditTrail.DateCreated 
                    ascending
                    select new AuditTrialDTO()
                    {
                        AuditTrailID = AuditTrail.AuditTrailID,
                        ApplicationID = AuditTrail.ApplicationID,
                        Description = AuditTrail.Description,
                        IsInternal = AuditTrail.IsInternal,
                        SubDepartmentName = AuditTrail.SubDepartmentName,
                        ZoneName = AuditTrail.ZoneName,
                        CreatedById = AuditTrail.CreatedById,
                        DateCreated = AuditTrail.DateCreated,
                        DateUpdated = AuditTrail.DateUpdated,
                        isActive = AuditTrail.isActive
                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all audit trail items for application", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPost("DeleteAuditTrialItemByAuditTrailID")]
        public async Task<object> DeleteAuditTrailItemByAuditTrailID([FromBody]AuditTrailBindingModel model)
        {
            try
            {
                if(model.AuditTrailID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempAuditTrailItem = _context.AuditTrail.FirstOrDefault(x => x.AuditTrailID == model.AuditTrailID);

                    if(tempAuditTrailItem == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Item does not exist on database", false));
                    }
                    else
                    {
                        tempAuditTrailItem.isActive = false;
                        tempAuditTrailItem.DateUpdated = DateTime.Now;

                        _context.Update(tempAuditTrailItem);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Audit trail item deleted successfully", true));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllAuditTrailItems")]
        public async Task<object> GetAllAuditTrailItems()
        {
            try
            {
                var result = await (
                    from AuditTrail in _context.AuditTrail
                    where AuditTrail.isActive == true
                    orderby AuditTrail.DateCreated
                    ascending
                    select new AuditTrialDTO()
                    {
                        AuditTrailID = AuditTrail.AuditTrailID,
                        ApplicationID = AuditTrail.ApplicationID,
                        Description = AuditTrail.Description,
                        IsInternal = AuditTrail.IsInternal,
                        SubDepartmentName = AuditTrail.SubDepartmentName,
                        ZoneName = AuditTrail.ZoneName,
                        CreatedById = AuditTrail.CreatedById,
                        DateCreated = AuditTrail.DateCreated,
                        DateUpdated = AuditTrail.DateUpdated,
                        isActive = AuditTrail.isActive
                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Audit Trail Items", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllAuditTrailItemsForSubDepartmentAndZone")]
        public async Task<object> GetAllAuditTrailItemsForSubDepartmentAndZone([FromBody] AuditTrailBindingModel model)
        {
            try
            {
                var result = await (
                    from AuditTrail in _context.AuditTrail
                    where AuditTrail.SubDepartmentName == model.SubDepartmentName && AuditTrail.ZoneName == model.ZoneName && AuditTrail.isActive == true
                    select new AuditTrialDTO()
                    {
                        AuditTrailID = AuditTrail.AuditTrailID,
                        ApplicationID = AuditTrail.ApplicationID,
                        Description = AuditTrail.Description,
                        IsInternal = AuditTrail.IsInternal,
                        SubDepartmentName = AuditTrail.SubDepartmentName,
                        ZoneName = AuditTrail.ZoneName,
                        CreatedById = AuditTrail.CreatedById,
                        DateCreated = AuditTrail.DateCreated,
                        DateUpdated = AuditTrail.DateUpdated,
                        isActive = AuditTrail.isActive
                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Audit Trail Items for Sub Department And Zone ", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllAuditTrailItemsForInternalUser")]
        public async Task<object> GetAllAuditTrailItemsForInternalUser([FromBody] AuditTrailBindingModel model)
        {
            try
            {
                var result = await (
                    from AuditTrail in _context.AuditTrail
                    where AuditTrail.CreatedById == model.CreatedById && AuditTrail.isActive == true
                    orderby AuditTrail.DateCreated
                    ascending
                    select new AuditTrialDTO()
                    {
                        AuditTrailID = AuditTrail.AuditTrailID,
                        ApplicationID = AuditTrail.ApplicationID,
                        Description = AuditTrail.Description,
                        IsInternal = AuditTrail.IsInternal,
                        SubDepartmentName = AuditTrail.SubDepartmentName,
                        ZoneName = AuditTrail.ZoneName,
                        CreatedById = AuditTrail.CreatedById,
                        DateCreated = AuditTrail.DateCreated,
                        DateUpdated = AuditTrail.DateUpdated,
                        isActive = AuditTrail.isActive

                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Audit Trail Items for Internal User", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
    //Audit Trail Kyle 
}
