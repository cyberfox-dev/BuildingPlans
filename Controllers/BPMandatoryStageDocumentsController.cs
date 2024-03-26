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
    public class BPMandatoryStageDocumentsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPMandatoryStageDocumentsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateMandatoryStageDocument")]
        public async Task<object> AddUpdateMandatoryStageDocument([FromBody] BPMandatoryStageDocumentsBindingModel model)
        {
            try
            {
                var result = new object();

                if(model == null || model.StageName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

                var tempStageDocument = _context.BPMandatoryStageDocuments.FirstOrDefault(x => x.DocumentID == model.DocumentID);

                if(tempStageDocument == null)
                {
                    tempStageDocument = new BPMandatoryStageDocuments()
                    {
                        DocumentName = model.DocumentName,
                        StageName = model.StageName,
                        FunctionalArea = model.FunctionalArea,
                        CreatedById = model.CreatedById,
                        DateCreated = DateTime.Now,
                        DateUpdated = DateTime.Now,
                        isActive = true
                    };
                    await _context.BPMandatoryStageDocuments.AddRangeAsync(tempStageDocument);
                    await _context.SaveChangesAsync();

                    result = tempStageDocument;
                }
                else
                {
                    if(model.DocumentName != null)
                    {
                        tempStageDocument.DocumentName = model.DocumentName;
                    }

                    if(model.StageName != null)
                    {
                        tempStageDocument.StageName = model.StageName;
                    }

                    if (model.FunctionalArea != null)
                    {
                        tempStageDocument.FunctionalArea = model.FunctionalArea;
                    }

                    tempStageDocument.DateUpdated = DateTime.Now;
                    tempStageDocument.isActive = true;

                    _context.Update(tempStageDocument);
                    await _context.SaveChangesAsync();

                    result = tempStageDocument;
                }
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DocumentID > 0 ? " Mandatory Stage Document Updated Successfully" : "Mandatory Stage Document Created Successfully"), result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPost("GetAllDocumentsForStage")]
        public async Task<object> GetAllDocumentsForStage([FromBody] BPMandatoryStageDocuments model)
        {
            try
            {
                var result = await (from stageDocuments in _context.BPMandatoryStageDocuments
                                    where stageDocuments.isActive == true && stageDocuments.FunctionalArea == model.FunctionalArea
                                    && stageDocuments.StageName == model.StageName
                                    select new BPMandatoryStageDocumentsDTO()
                                    {
                                        DocumentID = stageDocuments.DocumentID,
                                        DocumentName = stageDocuments.DocumentName,
                                        FunctionalArea =stageDocuments.FunctionalArea,
                                        StageName = stageDocuments.StageName,
                                        DateCreated = stageDocuments.DateCreated,
                                        DateUpdated = stageDocuments.DateUpdated,
                                        CreatedById = stageDocuments.CreatedById,
                                        isActive = true
                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all documents for stage", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteMandatoryStageDocByDocumentID")]
        public async Task<object> DeleteMandatoryStageDocbyDocumentID( [FromBody]BPMandatoryStageDocumentsBindingModel model)
        {
            try
            {
                var tempStageDocument = _context.BPMandatoryStageDocuments.FirstOrDefault(x => x.DocumentID == model.DocumentID);
                
                if(tempStageDocument == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    tempStageDocument.DateUpdated = DateTime.Now;
                    tempStageDocument.isActive = false;

                    _context.Update(tempStageDocument);
                   await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Mandatory Stage Document Deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
