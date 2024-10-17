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
using Microsoft.Data.SqlClient;
using System.Runtime.CompilerServices;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPStagesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPStagesController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateStage")]
        public async Task<object> AddUpdateStage([FromBody] StagesTableBPBindingModel model)
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
                    if (model.StageID == 0)
                    {
                        model.StageID = null;
                    }
                    var tempStageTable = _context.StagesTableBP.FirstOrDefault(x => x.StageID == model.StageID);

                    if (tempStageTable == null)
                    {
                        tempStageTable = new StagesTableBP()
                        {
                            StageName = model.StageName,
                            StageOrder = model.StageOrder,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            FunctionalArea = model.FunctionalArea,
                            isActive = true
                        };
                        await _context.StagesTableBP.AddAsync(tempStageTable);
                        await _context.SaveChangesAsync();
                        result = tempStageTable;
                    }
                    else
                    {
                        if (model.StageName != null)
                        {
                            tempStageTable.StageName = model.StageName;
                        }

                        if (model.StageOrder != null)
                        {
                            tempStageTable.StageOrder = model.StageOrder;
                        }

                        tempStageTable.DateUpdated = DateTime.Now;
                        tempStageTable.isActive = true;

                        _context.Update(tempStageTable);
                        await _context.SaveChangesAsync();

                        result = tempStageTable;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.StageID > 0 ? " Stage Updated Successfully" : "Stage Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpGet("GetAllStages")]
        public async Task<object> GetAllStages()
        {
            try
            {
                var result = await (from stage in _context.StagesTableBP
                                    where stage.isActive == true
                                    select new StagesTableBPDTO()
                                    {
                                        StageID = stage.StageID,
                                        StageName = stage.StageName,
                                        StageOrder = stage.StageOrder,
                                        DateCreated = stage.DateCreated,
                                        DateUpdated = stage.DateUpdated,
                                        isActive = stage.isActive,


                                    }
                                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Stages", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteStageByStageID")]
        public async Task<object> DeleteStageByStageID([FromBody] int stageID)
        {
            try
            {
                var tempStageTable = await _context.StagesTableBP.FindAsync(stageID);

                if (tempStageTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Stage does not exist on database", false));
                }
                else
                {
                    tempStageTable.isActive = false;
                    tempStageTable.DateUpdated = DateTime.Now;
                    _context.Update(tempStageTable);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Stage Deleted successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetStageByFunctionalArea")]
        public async Task<object> GetStageByFunctionalArea([FromBody] StagesTableBPBindingModel model)
        {
            try
            {



                var result = await (from stageTable in _context.StagesTableBP
                                    where stageTable.isActive == true && stageTable.FunctionalArea == model.FunctionalArea
                                    select new StagesTableBPDTO()
                                    {
                                        StageID = stageTable.StageID,
                                        StageName = stageTable.StageName,
                                        StageOrder = stageTable.StageOrder,
                                        DateCreated = stageTable.DateCreated,
                                        DateUpdated = stageTable.DateUpdated,
                                        FunctionalArea = stageTable.FunctionalArea,
                                        SkipTrigger = stageTable.SkipTrigger,
                                        isActive = stageTable.isActive,


                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Stages For Functional Area", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
