using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Policy;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
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
    public class FinancialController : Controller
    {

        private readonly AppDBContext _context;

        public FinancialController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateDepositRequired")]
        public async Task<object> AddUpdateDepositRequired([FromBody] FinancialBindingModel model)
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
                    if (model.FinancialID == 0)
                    {
                        model.FinancialID = null;
                    }

                    var tempFinancial = _context.Financial.FirstOrDefault(x => x.FinancialID == model.FinancialID);


                    if (tempFinancial == null)
                    {
                        tempFinancial = new Financial()
                        {
                            // FinancialID = model.FinancialID
                            FinancialName = model.FinancialName,
                            FinancialType = model.FinancialType,
                            DocumentName = model.FinancialDocumentName,
                            DocumentLocalPath = model.FinancialDocumentLocalPath,
                            ApplicationID = model.ApplicationID,

                        };

                        await _context.DepositRequired.AddAsync(tempFinancial);
                        await _context.SaveChangesAsync();

                        result = tempFinancial;

                    }
                    else
                    {
                        if (model.FinancialName != null) {
                            tempFinancial.FinancialName = model.FinancialName;
                        }
                        if (model.FinancialType != null)
                        {
                            tempFinancial.FinancialType = model.FinancialType;
                        }
                        if (model.FinancialDocumentName != null)
                        {
                            tempFinancial.DocumentName = model.FinancialDocumentName;
                        }
                        if (model.FinancialDocumentLocalPath != null)
                        {
                            tempFinancial.DocumentLocalPath = model.FinancialDocumentLocalPath;
                        }
      

                        _context.Update(tempFinancial);
                        await _context.SaveChangesAsync();
                        result = tempFinancial;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.FinancialID > 0 ? "Financial Updated Successfully" : "Financial Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteServiceItemID")]
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
               where depositRequired.ApplicationID == applicationID && depositRequired.isActive == true
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
                   WBS = depositRequired.WBS

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
