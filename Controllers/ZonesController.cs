﻿using BuildingPlans.Data;
using BuildingPlans.IServices;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.BindingModel.ForGetByIDModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZonesController : Controller
    {
        private readonly IZonesServices _zonesServices;
        private readonly AppDBContext _context;
        public ZonesController(IZonesServices zonesService, AppDBContext context)
        {
            _zonesServices = zonesService;
            _context = context;
        }

        [HttpPost("AddUpdateZones")]
        public async Task<object> AddUpdateZones([FromBody] ZonesBindingModel model)
        {
            try
            {

                if (model == null || model.ZoneName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.AddUpdateZones(model.ZoneID, model.ZoneName, model.DepartmentID, model.SubDepartmentID, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ZoneID > 0 ? "Zone Updated Successfully" : "Zone Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteZone")]
        public async Task<object> DeleteZone([FromBody] int ZoneID)
        {
            try
            {

                if (ZoneID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.DeleteZone(ZoneID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetZonesList")]
        public async Task<object> GetZonesList()
        {
            try
            {
                var result = await _zonesServices.GetAllZones();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zones List Created", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetZoneBySubDepartmentID")]
        public async Task<object> GetZoneBySubDepartmentID([FromBody] ZoneSubDepartmentIDBindingModel model)
        {
            try
            {

                if (model.SubDepartmentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.GetZoneBySubDepartmentID(model.SubDepartmentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Zones for given Sub Departments", result));
                }





            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("GetUsersLinkedByZoneID")]
        public async Task<object> GetUsersLinkedByZoneID([FromBody] int zoneID)
        {
            try
            {
                //var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
                var result = _context.LinkedUserSpDTOs.FromSqlRaw($"SP_GetUsersLinkedByZoneID {zoneID}").AsEnumerable();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Linked Users", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetZoneByZoneID")]
        public async Task<object> GetZoneByZoneID([FromBody] int zoneID)
        {
            try
            {
                //var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
                if (zoneID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.GetZoneByZoneID(zoneID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Linked Users", result));
                }



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetZoneByMapObjectID")]
        public async Task<object> GetZoneByMapObjectID([FromBody] ZonesBindingModel model)
        {
            try
            {
                //var result = await _zonesLinkingServices.GetUsersNotLinkedByUserID();
                if (model == null || model.SubDepartmentID < -1)
                //if (mapObjectID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _zonesServices.GetZoneByMapObjectID(model.SubDepartmentID, model.MapObjectID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got assigned map object", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
