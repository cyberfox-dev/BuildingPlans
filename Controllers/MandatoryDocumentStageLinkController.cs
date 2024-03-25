using BuildingPlans.Data;
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
    public class MandatoryDocumentStageLinkController : Controller
    {

        private readonly AppDBContext _context;

        public MandatoryDocumentStageLinkController(AppDBContext context)
        {

            _context = context;
        }
        [HttpPost("AddUpdateMandatoryDocumentStageLink")]
        public async Task<object> AddUpdateMandatoryDocumentStageLink([FromBody] MandatoryDocumentStageLinkBindingModel model)
        {
            try
            {
                var result = new object();
                if (model == null || model.MandatoryDocumentID < 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.MandatoryDocumentStageLinkID == 0)
                    {
                        model.MandatoryDocumentStageLinkID = null;
                    }

                    var tempMandatoryDocumentStageLinkTable = _context.MandatoryDocumentStageLink.FirstOrDefault(x => x.MandatoryDocumentStageLinkID == model.MandatoryDocumentStageLinkID);


                    if (tempMandatoryDocumentStageLinkTable == null)
                    {
                        tempMandatoryDocumentStageLinkTable = new MandatoryDocumentStageLink()
                        {
                            MandatoryDocumentID = model.MandatoryDocumentID,
                            StageID = model.StageID,
                            StageName = model.StageName,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,

                        };

                        await _context.MandatoryDocumentStageLink.AddAsync(tempMandatoryDocumentStageLinkTable);
                        await _context.SaveChangesAsync();

                        result = tempMandatoryDocumentStageLinkTable;

                    }
                    else
                    {
                        tempMandatoryDocumentStageLinkTable.MandatoryDocumentID = model.MandatoryDocumentID;
                        tempMandatoryDocumentStageLinkTable.StageID = model.StageID;
                        tempMandatoryDocumentStageLinkTable.StageName = model.StageName;
                        tempMandatoryDocumentStageLinkTable.DateUpdated = DateTime.Now;
                        tempMandatoryDocumentStageLinkTable.isActive = true;



                        _context.Update(tempMandatoryDocumentStageLinkTable);
                        await _context.SaveChangesAsync();
                        result = tempMandatoryDocumentStageLinkTable;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.MandatoryDocumentStageLinkID > 0 ? "Mandatory Document Link Updated Successfully" : "Mandatory Document Linked Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteMandatoryDocumentStageLink")]
        public async Task<object> DeleteMandatoryDocumentStageLink([FromBody] int MandatoryDocumentStageLinkID)
        {
            try
            {
                var tempMandatoryDocumentStageLinkTable = _context.MandatoryDocumentStageLink.FirstOrDefault(x => x.MandatoryDocumentStageLinkID == MandatoryDocumentStageLinkID);
                if (tempMandatoryDocumentStageLinkTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    tempMandatoryDocumentStageLinkTable.DateUpdated = DateTime.Now;
                    tempMandatoryDocumentStageLinkTable.isActive = false;
                    _context.Update(tempMandatoryDocumentStageLinkTable);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Mandatory Link Deleted Successfully", true));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllMandatoryDocumentStageLink")]
        public async Task<object> GetAllMandatoryDocumentStageLink()
        {
            try
            {

                var result = await (from MandatoryDocumentStageLink in _context.MandatoryDocumentStageLink
                                    where MandatoryDocumentStageLink.isActive == true
                                    select new MandatoryDocumentStageLinkDTO()
                                    {
                                        MandatoryDocumentStageLinkID = MandatoryDocumentStageLink.MandatoryDocumentStageLinkID,
                                        MandatoryDocumentID = MandatoryDocumentStageLink.MandatoryDocumentID,
                                        StageID = MandatoryDocumentStageLink.StageID,
                                        StageName = MandatoryDocumentStageLink.StageName,
                                        CreatedById = MandatoryDocumentStageLink.CreatedById,
                                        DateCreated = DateTime.Now,
                                        DateUpdated = DateTime.Now,
                                        isActive = MandatoryDocumentStageLink.isActive,



                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Mandatory Document Links ", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }


        }


        /*Getting by stage ID*/

        [HttpPost("GetAllMandatoryDocumentStageLinkByStageID")]
        public async Task<object> GetAllMandatoryDocumentStageLinkByStageID([FromBody] int mandatoryDocumentID)
        {
            try
            {

                var result = await (from MandatoryDocumentStageLink in _context.MandatoryDocumentStageLink
                                    where MandatoryDocumentStageLink.MandatoryDocumentID == mandatoryDocumentID && MandatoryDocumentStageLink.isActive == true
                                    select new MandatoryDocumentStageLinkDTO()
                                    {
                                        MandatoryDocumentStageLinkID = MandatoryDocumentStageLink.MandatoryDocumentStageLinkID,
                                        MandatoryDocumentID = MandatoryDocumentStageLink.MandatoryDocumentID,
                                        StageID = MandatoryDocumentStageLink.StageID,
                                        StageName = MandatoryDocumentStageLink.StageName,
                                        CreatedById = MandatoryDocumentStageLink.CreatedById,
                                        DateCreated = DateTime.Now,
                                        DateUpdated = DateTime.Now,
                                        isActive = MandatoryDocumentStageLink.isActive,



                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Mandatory Document Links By Stage ID ", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }


        }

        [HttpPost("GetAllMandatoryDocumentsByStageID")]
        public async Task<object> GetAllMandatoryDocumentsByStageID([FromBody] int stageID)
        {
            try
            {

                var result = await (from mdl in _context.MandatoryDocumentStageLink
                                    join md in _context.MandatoryDocumentUploads on mdl.MandatoryDocumentID equals md.MandatoryDocumentID
                                    where mdl.StageID == stageID && mdl.isActive == true
                                    select new MandatoryDocumentStageLinkDTO()
                                    {
                                        MandatoryDocumentStageLinkID = mdl.MandatoryDocumentStageLinkID,
                                        MandatoryDocumentID = mdl.MandatoryDocumentID,
                                        MandatoryDocumentName = md.MandatoryDocumentName,
                                        StageID = mdl.StageID,
                                        StageName = mdl.StageName,
                                        CreatedById = mdl.CreatedById,
                                        DateCreated = DateTime.Now,
                                        DateUpdated = DateTime.Now,
                                        isActive = mdl.isActive
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Mandatory Document Links By Stage ID ", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }


        }


    }
}
