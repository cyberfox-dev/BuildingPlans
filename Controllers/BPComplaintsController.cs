using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPComplaintsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPComplaintsController(AppDBContext context)
        {
            _context = context;
        }


        [HttpPost("AddUpdateComplaint")]
        public async Task<object> AddUpdateComplaint([FromBody] BPComplaintsBindingModel model)
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
                    if (model.ComplaintID == 0)
                    {
                        model.ComplaintID = null;
                    }

                    var tempComplaint = _context.BPComplaints.FirstOrDefault(x => x.ComplaintID == model.ComplaintID);

                    if (tempComplaint == null)
                    {
                        tempComplaint = new BPComplaints()
                        {
                            IDNumber = model.IDNumber,
                            FullName = model.FullName,
                            EmailAddress = model.EmailAddress,
                            CellNumber = model.CellNumber,
                            TelephoneNumber = model.TelephoneNumber,
                            Address = model.Address,
                            CadastralDescription = model.CadastralDescription,
                            LotNumber = model.LotNumber,
                            Portion = model.Portion,
                            Township = model.Township,
                            Details = model.Details,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.BPComplaints.AddAsync(tempComplaint);
                        await _context.SaveChangesAsync();

                        result = tempComplaint;
                    }
                    else
                    {
                        if (model.IDNumber != null)
                        {
                            tempComplaint.IDNumber = model.IDNumber;
                        }
                        if (model.FullName != null)
                        {
                            tempComplaint.FullName = model.FullName;
                        }
                        if (model.EmailAddress != null)
                        {
                            tempComplaint.EmailAddress = model.EmailAddress;
                        }
                        if (model.CellNumber != null)
                        {
                            tempComplaint.CellNumber = model.CellNumber;
                        }
                        if (model.TelephoneNumber != null)
                        {
                            tempComplaint.TelephoneNumber = model.TelephoneNumber;
                        }
                        if (model.Address != null)
                        {
                            tempComplaint.Address = model.Address;
                        }
                        if (model.CadastralDescription != null)
                        {
                            tempComplaint.CadastralDescription = model.CadastralDescription;
                        }
                        if (model.LotNumber != null)
                        {
                            tempComplaint.LotNumber = model.LotNumber;
                        }
                        if (model.Portion != null)
                        {
                            tempComplaint.Portion = model.Portion;
                        }
                        if (model.Township != null)
                        {
                            tempComplaint.Township = model.Township;
                        }
                        if (model.Details != null)
                        {
                            tempComplaint.Details = model.Details;
                        }
                        tempComplaint.DateUpdated = DateTime.Now;

                        _context.Update(tempComplaint);
                        await _context.SaveChangesAsync();
                        result = tempComplaint;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ComplaintID > 0 ? "Complaint Updated Successfully" : "Complaint Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllComplaints")]
        public async Task<object> GetAllComplaints()
        {
            try
            {
                var result = await (from complaints in _context.BPComplaints
                                    where complaints.isActive == true
                                    select new BPComplaintsDTO()
                                    {
                                        ComplaintID = complaints.ComplaintID,
                                        IDNumber = complaints.IDNumber,
                                        FullName = complaints.FullName,
                                        EmailAddress = complaints.EmailAddress,
                                        CellNumber = complaints.CellNumber,
                                        TelephoneNumber = complaints.TelephoneNumber,
                                        Address = complaints.Address,
                                        CadastralDescription = complaints.CadastralDescription,
                                        LotNumber = complaints.LotNumber,
                                        Portion = complaints.Portion,
                                        Township = complaints.Township,
                                        Details = complaints.Details,
                                        CreatedById = complaints.CreatedById,
                                        DateCreated = complaints.DateCreated,
                                        DateUpdated = complaints.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Complaints", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetComplaintByComplaintID")]
        public async Task<object> GetComplaintByComplaintID([FromBody] BPComplaintsBindingModel model)
        {
            try
            {
                if(model.ComplaintID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from complaints in _context.BPComplaints
                                        where complaints.ComplaintID == model.ComplaintID && complaints.isActive == true
                                        select new BPComplaintsDTO()
                                        {
                                            ComplaintID = complaints.ComplaintID,
                                            IDNumber = complaints.IDNumber,
                                            FullName = complaints.FullName,
                                            EmailAddress = complaints.EmailAddress,
                                            CellNumber = complaints.CellNumber,
                                            TelephoneNumber = complaints.TelephoneNumber,
                                            Address = complaints.Address,
                                            CadastralDescription = complaints.CadastralDescription,
                                            LotNumber = complaints.LotNumber,
                                            Portion = complaints.Portion,
                                            Township = complaints.Township,
                                            Details = complaints.Details,
                                            CreatedById = complaints.CreatedById,
                                            DateCreated = complaints.DateCreated,
                                            DateUpdated = complaints.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Complaint By ComplaintID", result));
                        
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetComplaintByUserId")]
        public async Task<object> GetComplaintByUserID([FromBody] BPComplaintsBindingModel model)
        {
            try
            {
                if(model.CreatedById == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from complaints in _context.BPComplaints
                                        where complaints.CreatedById == model.CreatedById && complaints.isActive == true
                                        select new BPComplaintsDTO()
                                        {
                                            ComplaintID = complaints.ComplaintID,
                                            IDNumber = complaints.IDNumber,
                                            FullName = complaints.FullName,
                                            EmailAddress = complaints.EmailAddress,
                                            CellNumber = complaints.CellNumber,
                                            TelephoneNumber = complaints.TelephoneNumber,
                                            Address = complaints.Address,
                                            CadastralDescription = complaints.CadastralDescription,
                                            LotNumber = complaints.LotNumber,
                                            Portion = complaints.Portion,
                                            Township = complaints.Township,
                                            Details = complaints.Details,
                                            CreatedById = complaints.CreatedById,
                                            DateCreated = complaints.DateCreated,
                                            DateUpdated = complaints.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Complaints For User",result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteComplaintByComplaintID")]
        public async Task<object> DeleteComplaintByComplaintID([FromBody] BPComplaintsBindingModel model)
        {
            try
            {
                if(model.ComplaintID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempComplaint = _context.BPComplaints.FirstOrDefault(x => x.ComplaintID == model.ComplaintID);

                    if(tempComplaint == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could Not Find Entry in Database", false));
                    }
                    else
                    {
                        tempComplaint.isActive = false;
                        tempComplaint.DateUpdated = DateTime.Now;

                        _context.Update(tempComplaint);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Complaint Deleted Successfull", true));
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
