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
    public class DepositRequiredController : Controller
    {

        private readonly AppDBContext _context;

        public DepositRequiredController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateDepositRequired")]
        public async Task<object> AddUpdateDepositRequired([FromBody] DepositRequiredBindingModel model)
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
                    if (model.DepositRequiredID == 0)
                    {
                        model.DepositRequiredID = null;
                    }

                    var tempDepositRequired = _context.DepositRequired.FirstOrDefault(x => x.DepositRequiredID == model.DepositRequiredID);


                    if (tempDepositRequired == null)
                    {
                        tempDepositRequired = new DepositRequired()
                        {

                            SubDepartmentForCommentID = model.SubDepartmentForCommentID,
                            Rate = model.Rate,
                            Quantity = model.Quantity,
                            ApplicationID = model.ApplicationID,
                            SubDepartmentID = model.SubDepartmentID,
                            Desciption = model.Desciption,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                            SubDepartmentName = model.SubDepartmentName,
                            ServiceItemCode = model.ServiceItemCode,
                            ServiceItemCodeID = model.ServiceItemCodeID,
                            TotalAmount = model.TotalAmount,
                            Remarks = model.Remarks,
                            WBS = model.WBS
                        };

                        await _context.DepositRequired.AddAsync(tempDepositRequired);
                        await _context.SaveChangesAsync();

                        result = tempDepositRequired;

                    }
                    else
                    {
                        tempDepositRequired.Desciption = model.Desciption;
                        tempDepositRequired.DateUpdated = DateTime.Now;
                        tempDepositRequired.WBS = model.WBS;

                        _context.Update(tempDepositRequired);
                        await _context.SaveChangesAsync();
                        result = tempDepositRequired;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepositRequiredID > 0 ? "WBS Updated Successfully" : "Service Item Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteDepositRequiredByID")]
        public async Task<object> DeleteDepositRequiredByID([FromBody] int depositRequiredID)
        {
            try
            {

                var tempDepositRequired = _context.DepositRequired.FirstOrDefault(x => x.DepositRequiredID == depositRequiredID);

                if (tempDepositRequired == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempDepositRequired.DateUpdated = DateTime.Now;
                    tempDepositRequired.isActive = false;
                    _context.Update(tempDepositRequired);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Deposit Information Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAlltempDepositRequired")]
        public async Task<object> GetAllServiceItem()
        {
            try
            {
                var result = await (
                from depositRequired in _context.DepositRequired
                where depositRequired.isActive == true
                select new DepositRequiredDTO()
                {
                    DepositRequiredID = depositRequired.DepositRequiredID,
                    SubDepartmentForCommentID = depositRequired.SubDepartmentForCommentID,
                    Rate = depositRequired.Rate,
                    Quantity = depositRequired.Quantity,
                    ApplicationID = depositRequired.ApplicationID,
                    SubDepartmentID = depositRequired.SubDepartmentID,
                    Desciption = depositRequired.Desciption,
                    CreatedById = depositRequired.CreatedById,
                    DateCreated = depositRequired.DateCreated,
                    DateUpdated = depositRequired.DateUpdated,
                    isActive = depositRequired.isActive,
                    SubDepartmentName = depositRequired.SubDepartmentName,
                    ServiceItemCode = depositRequired.ServiceItemCode,
                    TotalAmount = depositRequired.TotalAmount,
                    ServiceItemCodeID = depositRequired.ServiceItemCodeID,
                    Remarks = depositRequired.Remarks,
                    WBS = depositRequired.WBS


                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




        [HttpPost("GetDepositRequiredByApplicationID")]
        public async Task<object> GetDepositRequiredByApplicationID([FromBody] int applicationID)
        {
            try
            {
                var result = await (
               from depositRequired in _context.DepositRequired
               where depositRequired.ApplicationID == applicationID 
               select new DepositRequiredDTO()
               {
                   DepositRequiredID = depositRequired.DepositRequiredID,
                   SubDepartmentForCommentID = depositRequired.SubDepartmentForCommentID,
                   Rate = depositRequired.Rate,
                   Quantity = depositRequired.Quantity,
                   ApplicationID = depositRequired.ApplicationID,
                   SubDepartmentID = depositRequired.SubDepartmentID,
                   Desciption = depositRequired.Desciption,
                   CreatedById = depositRequired.CreatedById,
                   DateCreated = depositRequired.DateCreated,
                   DateUpdated = depositRequired.DateUpdated,
                   isActive = depositRequired.isActive,
                   SubDepartmentName = depositRequired.SubDepartmentName,
                   /*ServiceItemCode = depositRequired.ServiceItemCode,*/
                   WBS = depositRequired.WBS,

               }
               ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Deposits By ID", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }


}
