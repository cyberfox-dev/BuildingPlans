using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPFinancialController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPFinancialController (AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateFinancial")]
        public async Task<object> AddUpdateFinancial([FromBody] FinancialBindingModel model)
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

                    var tempFinancial = _context.BPFinancial.FirstOrDefault(x => x.FinancialID == model.FinancialID);


                    if (tempFinancial == null)
                    {
                        tempFinancial = new BPFinancial()
                        {
                            // FinancialID = model.FinancialID
                            FinancialName = model.FinancialName,
                            FinancialType = model.FinancialType,
                            DocumentName = model.FinancialDocumentName,
                            DocumentLocalPath = model.FinancialDocumentLocalPath,
                            ApplicationID = model.ApplicationID,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true,
                        };

                        await _context.BPFinancial.AddAsync(tempFinancial);
                        await _context.SaveChangesAsync();

                        result = tempFinancial;

                    }
                    else
                    {
                        if (model.FinancialName != null)
                        {
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

        [HttpPost("DeleteFinancial")]
        public async Task<object> DeleteFinancial([FromBody] int financialID)
        {
            try
            {
                var tempFinancial = _context.BPFinancial.FirstOrDefault(x => x.FinancialID == financialID);

                if (tempFinancial == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    var dbPath = tempFinancial.DocumentLocalPath;

                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), dbPath);
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);
                    }


                    tempFinancial.DateUpdated = DateTime.Now;
                    tempFinancial.isActive = false;
                    _context.Remove(tempFinancial);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Financial Deleted Successfully", true));
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




        [HttpPost("GetFinancialByApplicationID")]
        public async Task<object> GetFinancialByApplicationID([FromBody] int applicationID)
        {
            try
            {
                var result = await (
               from financial in _context.BPFinancial
               where financial.ApplicationID == applicationID && financial.isActive == true
               select new FinancialDTO()
               {
                   FinancialID = financial.FinancialID,
                   FinancialName = financial.FinancialName,
                   FinancialType = financial.FinancialType,
                   DocumentName = financial.DocumentName,
                   ApplicationID = financial.ApplicationID,
                   DocumentLocalPath = financial.DocumentLocalPath,
                   CreatedById = financial.CreatedById,
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
