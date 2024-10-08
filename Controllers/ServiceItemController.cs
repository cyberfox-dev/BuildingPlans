﻿using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Controllers
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
                            Category = model.Category,
                            DepartmentID = model.DepartmentID,
                            VatApplicable = model.VatApplicable,
                            Remarks = model.Remarks,
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

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ServiceItemID > 0 ? "Service Item Updated Successfully" : "Service Item Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteServiceItemID")]
        public async Task<object> DeleteServiceItemID([FromBody] int serviceItemID)
        {
            try
            {

                var tempServiceItemTable = _context.ServiceItem.FirstOrDefault(x => x.ServiceItemID == serviceItemID);

                if (tempServiceItemTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempServiceItemTable.DateUpdated = DateTime.Now;
                    tempServiceItemTable.isActive = false;
                    _context.Update(tempServiceItemTable);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Zone Link Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllServiceItem")]
        public async Task<object> GetAllServiceItem()
        {
            try
            {
                var result = await (
                from serviceItem in _context.ServiceItem
                where serviceItem.isActive == true
                select new ServiceItemDTO()
                {
                    ServiceItemID = serviceItem.ServiceItemID,
                    ServiceItemCode = serviceItem.ServiceItemCode,
                    Description = serviceItem.Description,
                    Rate = serviceItem.Rate,
                    TotalVat = serviceItem.TotalVat,
                    DateCreated = serviceItem.DateCreated,
                    DateUpdated = serviceItem.DateUpdated,
                    isActive = serviceItem.isActive,
                    DepartmentID = serviceItem.DepartmentID,
                    VatApplicable = serviceItem.VatApplicable,
                    Category = serviceItem.Category,
                    Remarks = serviceItem.Remarks,
                }
                ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }




        [HttpPost("GetServiceItemByServiceItemID")]
        public async Task<object> GetServiceItemByServiceItemID([FromBody] int serviceItemID)
        {
            try
            {
                var result = await (
               from serviceItem in _context.ServiceItem
               where serviceItem.ServiceItemID == serviceItemID && serviceItem.isActive == true
               select new ServiceItemDTO()
               {
                   ServiceItemID = serviceItem.ServiceItemID,
                   ServiceItemCode = serviceItem.ServiceItemCode,
                   Description = serviceItem.Description,
                   Rate = serviceItem.Rate,
                   TotalVat = serviceItem.TotalVat,
                   DateCreated = serviceItem.DateCreated,
                   DateUpdated = serviceItem.DateUpdated,
                   isActive = serviceItem.isActive,
                   DepartmentID = serviceItem.DepartmentID,
                   VatApplicable = serviceItem.VatApplicable,
                   Category = serviceItem.Category,
                   Remarks = serviceItem.Remarks,
               }
               ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items By ID", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }

        }


        [HttpPost("GetServiceItemByServiceItemCode")]
        public async Task<object> GetServiceItemByServiceItemCode([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                var result = await (
               from serviceItem in _context.ServiceItem
               where serviceItem.ServiceItemCode == model.ServiceItemCode && serviceItem.isActive == true
               select new ServiceItemDTO()
               {
                   ServiceItemID = serviceItem.ServiceItemID,
                   ServiceItemCode = serviceItem.ServiceItemCode,
                   Description = serviceItem.Description,
                   Rate = serviceItem.Rate,
                   TotalVat = serviceItem.TotalVat,
                   DateCreated = serviceItem.DateCreated,
                   DateUpdated = serviceItem.DateUpdated,
                   isActive = serviceItem.isActive,
                   Remarks = serviceItem.Remarks,

               }
               ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items By ID", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetServiceItemByDepID")]
        public async Task<object> GetServiceItemByDepID([FromBody] int depID)
        {
            try
            {
                var result = await (
               from serviceItem in _context.ServiceItem
               where serviceItem.DepartmentID == depID && serviceItem.isActive == true
               select new ServiceItemDTO()
               {
                   ServiceItemID = serviceItem.ServiceItemID,
                   ServiceItemCode = serviceItem.ServiceItemCode,
                   Description = serviceItem.Description,
                   Rate = serviceItem.Rate,
                   TotalVat = serviceItem.TotalVat,
                   DateCreated = serviceItem.DateCreated,
                   DateUpdated = serviceItem.DateUpdated,
                   isActive = serviceItem.isActive,
                   DepartmentID = serviceItem.DepartmentID,
                   VatApplicable = serviceItem.VatApplicable,
                   Category = serviceItem.Category,
                   Remarks = serviceItem.Remarks,
               }
               ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items For Sub Department", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        //Permit Kyle 13-02 - 24
        [HttpPost("GetAllServiceItemsByCategory")]
        public async Task<object> GetAllServiceItemsByCategory([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                var result = await (
                    from serviceItem in _context.ServiceItem
                    where serviceItem.Category == model.Category && serviceItem.isActive == true
                    select new ServiceItemDTO()
                    {
                        ServiceItemID = serviceItem.ServiceItemID,
                        ServiceItemCode = serviceItem.ServiceItemCode,
                        Description = serviceItem.Description,
                        Rate = serviceItem.Rate,
                        TotalVat = serviceItem.TotalVat,
                        DateCreated = serviceItem.DateCreated,
                        DateUpdated = serviceItem.DateUpdated,
                        isActive = serviceItem.isActive,
                        DepartmentID = serviceItem.DepartmentID,
                        VatApplicable = serviceItem.VatApplicable,
                        Category = serviceItem.Category,
                        Remarks = serviceItem.Remarks,

                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items By Category", result));
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
        //Permit Kyle 13-02 - 24
    }
}
