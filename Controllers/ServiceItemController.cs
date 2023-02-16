using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceItemController : Controller
    {

        private readonly AppDBContext _context;

        public ServiceItemController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateServiceItemCode")]
        public async Task<object> AddUpdateServiceItemCode([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.ServiceItemCode == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.ServiceItemID == 0)
                    {
                        model.ServiceItemID = null;
                    }

                    var tempServiceItemTable = _context.ServiceItem.FirstOrDefault(x => x.ServiceItemID == model.ServiceItemID);


                    if (tempServiceItemTable == null)
                    {
                        tempServiceItemTable = new ServiceItems()
                        {
                            ServiceItemCode = model.ServiceItemCode,
                            Description = model.Description,
                            Rate = model.Rate,
                            TotalVat = model.TotalVat,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };

                        await _context.ServiceItem.AddAsync(tempServiceItemTable);
                        await _context.SaveChangesAsync();

                        result = tempServiceItemTable;

                    }
                    else
                    {
                        tempServiceItemTable.ServiceItemCode = model.ServiceItemCode;
                        tempServiceItemTable.Description = model.Description;
                        tempServiceItemTable.Rate = model.Rate;
                        tempServiceItemTable.TotalVat = model.TotalVat;
                        tempServiceItemTable.DateUpdated = DateTime.Now;
                        tempServiceItemTable.isActive = true;
                        

                        _context.Update(tempServiceItemTable);
                        await _context.SaveChangesAsync();
                        result = tempServiceItemTable;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ServiceItemID > 0 ? "Zone Link Updated Successfully" : "User Linked Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

    //    [HttpPost("DeleteZoneLink")]
    //    public async Task<object> DeleteZoneLink([FromBody] int zoneID)
    //    {
    //        try
    //        {

    //            if (zoneID < 1)
    //            {
    //                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
    //            }
    //            else
    //            {
    //                var result = await _zonesLinkingServices.DeleteZoneLink(zoneID);
    //                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link Deleted Successfully", result));
    //            }

    //        }
    //        catch (Exception ex)
    //        {


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //        }
    //    }

    //    [HttpGet("GetZoneLinkList")]
    //    public async Task<object> GetAllZoneLinks()
    //    {
    //        try
    //        {
    //            var result = await _zonesLinkingServices.GetAllZoneLinks();
    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));



    //        }
    //        catch (Exception ex)
    //        {


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //        }
    //    }


    //    //[HttpGet("GetUsersNotLinkedByUserID")]
    //    //public async Task<object> GetUsersNotLinkedByUserID()
    //    //{
    //    //    try
    //    //    {
    //    //        var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
    //    //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Unlinked Users", result));

    //    //    }
    //    //    catch (Exception ex)
    //    //    {


    //    //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //    //    }
    //    //}

    //    [HttpPost("GetUsersNotLinkedByUserID")]
    //    public async Task<object> GetUsersNotLinkedByUserID([FromBody] int zoneID)
    //    {
    //        try
    //        {
    //            //var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
    //            var result = _context.UserSpDTOs.FromSqlRaw($"SP_GetUsersNotLinkedByUserID {zoneID}").AsEnumerable();


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Unlinked Users", result));

    //        }
    //        catch (Exception ex)
    //        {


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //        }
    //    }

    //    [HttpPost("GetAllRecordsByUserIdIfDeleted")]
    //    public async Task<object> GetAllRecordsByUserIdIfDeleted([FromBody] ZoneLinkByUserIDBindingModel model)
    //    {
    //        try
    //        {
    //            var result = await _zonesLinkingServices.GetAllRecordsByUserIdIfDeleted(model.UserID);
    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));

    //        }
    //        catch (Exception ex)
    //        {


    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //        }
    //    }


    }
}
