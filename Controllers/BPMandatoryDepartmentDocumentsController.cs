using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Service;
using BuildingPlans.Models.DTO;
using BuildingPlans.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPMandatoryDepartmentDocumentsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPMandatoryDepartmentDocumentsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateMandatoryDepartmentDocument")]
        public async Task<object> AddUpdateMandatoryDepartmentDocument([FromBody] BPMandatoryDepartmentDocumentsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model.DocumentName == null || model.FunctionalArea == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else {
                    if(model.DocumentID == 0)
                    {
                        model.DocumentID = null;
                    }

                    var tempDepartmentDocument = _context.BPMandatoryDepartmentDocuments.FirstOrDefault(x => x.DocumentID == model.DocumentID);

                    if (tempDepartmentDocument == null)
                    {
                        tempDepartmentDocument = new BPMandatoryDepartmentDocuments()
                        {
                            DocumentName = model.DocumentName,
                            FunctionalArea = model.FunctionalArea,
                            DepartmentName = model.DepartmentName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.BPMandatoryDepartmentDocuments.AddAsync(tempDepartmentDocument);
                        await _context.SaveChangesAsync();

                        result = tempDepartmentDocument;
                    }

                    else
                    {
                        if (model.DocumentName != null)
                        {
                            tempDepartmentDocument.DocumentName = model.DocumentName;
                        }
                        if (model.FunctionalArea != null)
                        {
                            tempDepartmentDocument.FunctionalArea = model.FunctionalArea;
                        }
                        if (model.DepartmentName != null)
                        {
                            tempDepartmentDocument.DepartmentName = model.DepartmentName;
                        }

                        tempDepartmentDocument.DateUpdated = DateTime.Now;
                        tempDepartmentDocument.isActive = true;

                        _context.Update(tempDepartmentDocument);
                        await _context.SaveChangesAsync();

                        result = tempDepartmentDocument;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DocumentID > 0 ? "mandatory Department Document Updated Successfully" : "Mandatory Department Document Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllDocumentsForDepartment")]
        public async Task<object> GetAllDocumentsForDepartment([FromBody] BPMandatoryDepartmentDocumentsBindingModel model)
        {
            try
            {
                var result = await (from departmentDoc in _context.BPMandatoryDepartmentDocuments
                                    where
                                    departmentDoc.isActive == true && departmentDoc.DepartmentName == model.DepartmentName 
                                    && departmentDoc.FunctionalArea == model.FunctionalArea
                                    select new BPMandatoryDepartmentDocumentsDTO()
                                    {
                                        DocumentID = departmentDoc.DocumentID,
                                        DepartmentName = departmentDoc.DepartmentName,
                                        DocumentName = departmentDoc.DocumentName,
                                        FunctionalArea = departmentDoc.FunctionalArea,
                                        DateCreated = departmentDoc.DateCreated,
                                        DateUpdated = departmentDoc.DateUpdated,
                                        CreatedById = departmentDoc.CreatedById,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Mandatory Documents For Department", result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteDepartmentManDocByDocumentId")]
        public async Task<object> DeleteDepartmentManDocByDocumentId([FromBody] BPMandatoryDepartmentDocumentsBindingModel model)
        {
            try
            {
                var tempDepartmentManDoc = _context.BPMandatoryDepartmentDocuments.FirstOrDefault(x => x.DocumentID == model.DocumentID);

                if (tempDepartmentManDoc == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }

                else
                {
                    tempDepartmentManDoc.DateUpdated = DateTime.Now;
                    tempDepartmentManDoc.isActive = false;

                    _context.Update(tempDepartmentManDoc);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Mandatory Department Document Deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
