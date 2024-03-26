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
    public class StagesChecklistsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public StagesChecklistsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateChecklistItem")]
        public async Task<object> AddUpdateChecklistItem([FromBody] StagesChecklistsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.ChecklistItem == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

                var tempChecklistItem = _context.bpStagesCheckLists.FirstOrDefault(x => x.CheckListItemID == model.CheckListItemID);

                if (tempChecklistItem == null)
                {
                    tempChecklistItem = new BPStagesCheckLists()
                    {
                        ChecklistItem = model.ChecklistItem,
                        StageName = model.StageName,
                        FunctionalArea = model.FunctionalArea,
                        DateCreated = DateTime.Now,
                        DateUpdated = DateTime.Now,
                        CreatedById = model.CreatedById,
                        isActive = true
                    };

                    await _context.bpStagesCheckLists.AddRangeAsync(tempChecklistItem);
                    await _context.SaveChangesAsync();

                    result = tempChecklistItem;
                }
                else
                {
                    tempChecklistItem.FunctionalArea = model.FunctionalArea;
                    tempChecklistItem.ChecklistItem = model.ChecklistItem;
                    tempChecklistItem.StageName = model.StageName;
                    tempChecklistItem.isActive = true;
                    tempChecklistItem.DateUpdated = DateTime.Now;

                    _context.Update(tempChecklistItem);
                    await _context.SaveChangesAsync();
                    result = tempChecklistItem;
                }

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.CheckListItemID > 0 ? "Checklist Item Updated Successfully" : "Checklist Item Created Successfully"), result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllChecklistItemsForStage")]
        public async Task<object> GetAllChecklistItemsForStage([FromBody] StagesChecklistsBindingModel model)
        {
            try
            {
                var result = await (from stages in _context.bpStagesCheckLists
                                    where stages.FunctionalArea == model.FunctionalArea && stages.StageName == model.StageName
                                    && stages.isActive == true select new StagesChecklistsDTO()
                                    {
                                        CheckListItemID = stages.CheckListItemID,
                                        ChecklistItem = stages.ChecklistItem,
                                        FunctionalArea = stages.FunctionalArea,
                                        StageName = stages.StageName,
                                        CreatedById = stages.CreatedById,
                                        DateCreated = stages.DateCreated,
                                        DateUpdated = stages.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Checklist Items For Functional Area Stage", result));
            }

            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteChecklistItemByChecklistItemId")]
        public async Task<object> DeleteChecklistitemByChecklistItemId([FromBody] StagesChecklistsBindingModel model)
        {
            try
            {
                var tempChecklistItem = _context.bpStagesCheckLists.FirstOrDefault(x => x.CheckListItemID == model.CheckListItemID);

                if(tempChecklistItem == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    tempChecklistItem.DateUpdated = DateTime.Now;
                    tempChecklistItem.isActive = false;

                    _context.Update(tempChecklistItem);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Mandatory Stage Checklist Item Deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
