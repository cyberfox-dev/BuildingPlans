using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Models.DTO;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPServiceItemsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPServiceItemsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateServiceItem")]
        public async Task<object> AddUpdateServiceItem([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                var result = new object();

                if(model.Rate == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.ServiceItemID == 0)
                    {
                        model.ServiceItemID = null;
                    }

                    var tempServiceItem = _context.BPServiceItems.FirstOrDefault(x => x.ServiceItemID == model.ServiceItemID);


                    if(tempServiceItem == null)
                    {
                        tempServiceItem = new BPServiceItems()
                        {
                            ServiceItemCode = model.ServiceItemCode,
                            Description = model.Description,
                            Rate = model.Rate,
                            TotalVat = model.TotalVat,
                            Category = model.Category,
                            FunctionalArea = model.FunctionalArea,
                            VAtApplicable = model.VatApplicable,
                            Remarks = model.Remarks,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,

                        };
                        await _context.BPServiceItems.AddAsync(tempServiceItem);
                        await _context.SaveChangesAsync();
                        result = tempServiceItem;
                    }
                    else
                    {
                        if(model.Description != null)
                        {
                            tempServiceItem.Description = model.Description;
                        }
                        if(model.Rate != null)
                        {
                            tempServiceItem.Rate = model.Rate;
                        }
                        if(model.Category != null)
                        {
                            tempServiceItem.Category = model.Category;
                        }
                        if(model.FunctionalArea != null)
                        {
                            tempServiceItem.FunctionalArea = model.FunctionalArea;
                        }
                        if(model.Remarks != null)
                        {
                            tempServiceItem.Remarks = model.Remarks;
                        }
                        if(model.TotalVat != null)
                        {
                            tempServiceItem.TotalVat = model.TotalVat;
                        }
                        if(model.VatApplicable != null)
                        {
                            tempServiceItem.VAtApplicable = model.VatApplicable;
                        }
                        tempServiceItem.DateUpdated = DateTime.Now;
                        _context.Update(tempServiceItem);
                        await _context.SaveChangesAsync();

                        result = tempServiceItem;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ServiceItemID > 0 ? "Service Item Updated Successfully " : "Service Item Created Successfully"), result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllServiceItems")]
        public async Task<object> GetAllServiceItems()
        {
            try
            {
                var result = await (from service in _context.BPServiceItems
                                    where service.isActive == true
                                    select new ServiceItemDTO()
                                    {
                                        ServiceItemID = service.ServiceItemID,
                                        ServiceItemCode  = service.ServiceItemCode,
                                        Description = service.Description,
                                        Rate = service.Rate,
                                        TotalVat = service.TotalVat,
                                        Category = service.Category,
                                        FunctionalArea = service.FunctionalArea,
                                        VatApplicable = service.VAtApplicable,
                                        Remarks = service.Remarks,
                                        DateCreated = service.DateCreated,
                                        DateUpdated = service.DateUpdated,


                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetServiceItemByCategory")]
        public async Task<object> GetServiceItemByCategory([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                var result = await (from service in _context.BPServiceItems
                                    where service.Category == model.Category && service.isActive == true
                                    select new ServiceItemDTO()
                                    {
                                        ServiceItemID = service.ServiceItemID,
                                        ServiceItemCode = service.ServiceItemCode,
                                        Description = service.Description,
                                        Rate = service.Rate,
                                        TotalVat = service.TotalVat,
                                        Category = service.Category,
                                        FunctionalArea = service.FunctionalArea,
                                        VatApplicable = service.VAtApplicable,
                                        Remarks = service.Remarks,
                                        DateCreated = service.DateCreated,
                                        DateUpdated = service.DateUpdated,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all service items for category", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpPost("GetServiceItemByServiceItemID")]
        public async Task<object> GetServiceItemByServiceItemID([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                var result = await (from service in _context.BPServiceItems
                                    where service.ServiceItemID == model.ServiceItemID && service.isActive == true
                                    select new ServiceItemDTO()
                                    {
                                        ServiceItemID = service.ServiceItemID,
                                        ServiceItemCode = service.ServiceItemCode,
                                        Description = service.Description,
                                        Rate = service.Rate,
                                        TotalVat = service.TotalVat,
                                        Category = service.Category,
                                        FunctionalArea = service.FunctionalArea,
                                        VatApplicable = service.VAtApplicable,
                                        Remarks = service.Remarks,
                                        DateCreated = service.DateCreated,
                                        DateUpdated = service.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Service Item By ServiceItemID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteServiceItemByServiceItemID")]
        public async Task<object> DeleteServiceItemByServiceItemID([FromBody] ServiceItemBindingModel model)
        {
            try
            {
                if(model.ServiceItemID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempServiceItem = _context.BPServiceItems.FirstOrDefault(x => x.ServiceItemID == model.ServiceItemID);

                    if(tempServiceItem == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not find service item in database", false));
                    }
                    else
                    {
                        tempServiceItem.isActive = false;
                        tempServiceItem.DateUpdated = DateTime.Now;
                        _context.Update(tempServiceItem);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Service Item Deleted Successfully", true)); 
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
