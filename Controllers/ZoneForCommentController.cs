using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Policy;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZoneForCommentController : ControllerBase
    {

        private readonly AppDBContext _context;

        public ZoneForCommentController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateZoneForComment")]
        public async Task<object> AddUpdateZoneForComment([FromBody] ZoneForCommentBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.ZoneID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.ZoneForCommentID == 0)
                    {
                        model.ZoneForCommentID = null;
                    }

                    var tempZoneForCommentTable = _context.ZoneForComment.FirstOrDefault(x => x.ZoneForCommentID == model.ZoneForCommentID);


                    if (tempZoneForCommentTable == null)
                    {
                        tempZoneForCommentTable = new ZoneForComment()
                        {
                            ZoneForCommentID = model.ZoneForCommentID,
                            ApplicationID = model.ApplicationID,
                            SubDepartmentID = model.SubDepartmentID,
                            ZoneID = model.ZoneID,
                            ZoneName = model.ZoneName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };

                        await _context.ZoneForComment.AddAsync(tempZoneForCommentTable);
                        await _context.SaveChangesAsync();

                        result = tempZoneForCommentTable;

                    }
                    else
                    {
                        tempZoneForCommentTable.ZoneForCommentID = model.ZoneForCommentID;
                        tempZoneForCommentTable.ApplicationID = model.ApplicationID;
                        tempZoneForCommentTable.SubDepartmentID = model.SubDepartmentID;
                        tempZoneForCommentTable.ZoneID = model.ZoneID;
                        tempZoneForCommentTable.DateUpdated = DateTime.Now;
                        tempZoneForCommentTable.isActive = true;
                        

                        _context.Update(tempZoneForCommentTable);
                        await _context.SaveChangesAsync();
                        result = tempZoneForCommentTable;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ZoneForCommentID > 0 ? "Zone Link Updated Successfully" : "Service Item Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteZoneForComment")]
        public async Task<object> DeleteZoneForComment([FromBody] int zoneForCommentID)
        {
            try
            {

                var tempZoneForCommentTable = _context.ZoneForComment.FirstOrDefault(x => x.ZoneForCommentID == zoneForCommentID);

                if (tempZoneForCommentTable == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                    }
                    else
                    {
                    tempZoneForCommentTable.DateUpdated = DateTime.Now;
                    tempZoneForCommentTable.isActive = false;
                        _context.Update(tempZoneForCommentTable);
                        await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetZonesForComment")]
        public async Task<object> GetZonesForComment([FromBody] ZoneForCommentBindingModel model)
        {
            try
            {
                if (model.SubDepartmentID != null)
                {
                    var result = await (
               from zoneForComment in _context.ZoneForComment
               where zoneForComment.isActive == true && zoneForComment.SubDepartmentID == model.SubDepartmentID && zoneForComment.ApplicationID == model.ApplicationID
               select new ZonesForCommentDTO()
               {
                   ZoneForCommentID = zoneForComment.ZoneForCommentID,
                   ApplicationID = zoneForComment.ApplicationID,
                   SubDepartmentID = zoneForComment.SubDepartmentID,
                   ZoneID = zoneForComment.ZoneID,
                   ZoneName = zoneForComment.ZoneName,
                   CreatedById = zoneForComment.CreatedById,
                   DateCreated = zoneForComment.DateCreated,
                   DateUpdated = zoneForComment.DateUpdated,
                   isActive = zoneForComment.isActive

               }
               ).ToListAsync();



                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));
                }

                else
                {
                    var result = await (
            from zoneForComment in _context.ZoneForComment
            join subDepartment in _context.SubDepartmentsTable
            on zoneForComment.SubDepartmentID equals subDepartment.SubDepartmentID
            where zoneForComment.isActive == true && zoneForComment.ApplicationID == model.ApplicationID
            select new ZonesForCommentDTO()
            {
                ZoneForCommentID = zoneForComment.ZoneForCommentID,
                ApplicationID = zoneForComment.ApplicationID,
                SubDepartmentID = zoneForComment.SubDepartmentID,
                SubDepartmentName = subDepartment.SubDepartmentName, 
                ZoneID = zoneForComment.ZoneID,
                ZoneName = zoneForComment.ZoneName,
                CreatedById = zoneForComment.CreatedById,
                DateCreated = zoneForComment.DateCreated,
                DateUpdated = zoneForComment.DateUpdated,
                isActive = zoneForComment.isActive
            }
        ).ToListAsync();



                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Linked Zones", result));
                }
               



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        

    }
}
