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
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZoneLinkingController : ControllerBase
    {
        private readonly IZoneLinkServices _zonesLinkingServices;
        private readonly AppDBContext _context;

        public ZoneLinkingController(IZoneLinkServices zoneLinkService, AppDBContext context)
        {
            _zonesLinkingServices = zoneLinkService;
            _context = context;
        }
        [HttpPost("AddUpdateZoneLink")]
        public async Task<object> AddUpdateZoneLink([FromBody] ZoneLinkBindingModel model)
        {
            try
            {

                if (model == null || model.ZoneLinkID < 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesLinkingServices.AddUpdateZoneLink(model.ZoneLinkID,model.ZoneID , model.ZoneName , model.DepartmentID, model.SubDepartmentID, model.SubDepartmentName , model.AssignedUserID, model.UserType,model.CreatedById, model.isDepartmentAdmin, model.isZoneAdmin);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ZoneLinkID > 0 ? "Zone Link Updated Successfully" : "User Linked Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteZoneLink")]
        public async Task<object> DeleteZoneLink([FromBody] int zoneID)
        {
            try
            {

                if (zoneID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesLinkingServices.DeleteZoneLink(zoneID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetZoneLinkList")]
        public async Task<object> GetAllZoneLinks()
        {
            try
            {
                var result = await _zonesLinkingServices.GetAllZoneLinks();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }   
        
        [HttpPost("GetAllUserLinks")]
        public async Task<object> GetAllUserLinks([FromBody] ZoneLinkBindingModel model)
        {
            try
            {
                var result = await _zonesLinkingServices.GetAllUserLinks(model.AssignedUserID);
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }  
        
        [HttpPost("GetBySubAndUserID")]
        public async Task<object> GetBySubAndUserID([FromBody] ZoneLinkBindingModel model)
        {
            try
            {
                if (model == null || model.ZoneLinkID < 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesLinkingServices.GetBySubAndUserID((int)model.SubDepartmentID, model.AssignedUserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));
                }
                



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("FindME")]
        public async Task<object> FindME()
        {
            try
            {
                //if (model == null || model.ZoneLinkID < 0)
                //{
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                //}
                //else
                //{
                //    var result = await _zonesLinkingServices.GetBySubAndUserID((int)model.SubDepartmentID, model.AssignedUserID);
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));
                //}

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        //[HttpGet("GetUsersNotLinkedByUserID")]
        //public async Task<object> GetUsersNotLinkedByUserID()
        //{
        //    try
        //    {
        //        var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Unlinked Users", result));

        //    }
        //    catch (Exception ex)
        //    {


        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

        //    }
        //}

        [HttpPost("GetUsersNotLinkedByUserID")]
        public async Task<object> GetUsersNotLinkedByUserID([FromBody] int zoneID)
        {
            try
            {
                //var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
                var result = _context.UserSpDTOs.FromSqlRaw($"SP_GetUsersNotLinkedByUserID {zoneID}").AsEnumerable();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Unlinked Users", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllRecordsByUserIdIfDeleted")]
        public async Task<object> GetAllRecordsByUserIdIfDeleted([FromBody] ZoneLinkByUserIDBindingModel model)
        {
            try
            {
                var result = await _zonesLinkingServices.GetAllRecordsByUserIdIfDeleted(model.UserID);
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link List Created", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }
}
