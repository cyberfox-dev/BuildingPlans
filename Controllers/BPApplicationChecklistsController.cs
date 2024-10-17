using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPApplicationChecklistsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPApplicationChecklistsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateApplicationChecklist")]
        public async Task<object> AddUpdateApplicationChecklist([FromBody] BPApplicationChecklistsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model.ApplicationID == null || model.StageName == null || model.FunctionalArea == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.ChecklistItemID == 0)
                    {
                        model.ChecklistItemID = null;
                    }

                    var tempApplicationChecklist = _context.BpApplicationChecklist.FirstOrDefault(x => x.ChecklistItemID == model.ChecklistItemID);

                    if (tempApplicationChecklist == null)
                    {
                        tempApplicationChecklist = new BPApplicationChecklists()
                        {
                            ApplicationID = model.ApplicationID,
                            ChecklistItem = model.ChecklistItem,
                            FunctionalArea = model.FunctionalArea,
                            StageName = model.StageName,
                            isChecked = model.isChecked,
                            CheckedBy = model.CheckedBy,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };

                        await _context.BpApplicationChecklist.AddAsync(tempApplicationChecklist);
                        await _context.SaveChangesAsync();
                        result = tempApplicationChecklist;
                    }
                    else
                    {
                        // Will Be used to Update 
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ChecklistItemID > 0 ? "Application checklist item updated successfully" : "Application checklist item created successfully"), result));
                }
            }

            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }


        }


        [HttpPost("GetChecklistForApplicationAndStage")]
        public async Task<object> GetChecklistForApplicationAndStage([FromBody] BPApplicationChecklistsBindingModel model)
        {
            try
            {
                if (model.ApplicationID == null || model.StageName == null || model.FunctionalArea == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from checklist in _context.BpApplicationChecklist
                                        where checklist.ApplicationID == model.ApplicationID && checklist.StageName == model.StageName && checklist.FunctionalArea == model.FunctionalArea && checklist.isActive == true
                                        select new BPApplicationChecklistsDTO()
                                        {
                                            ChecklistItemID = checklist.ChecklistItemID,
                                            ApplicationID = checklist.ApplicationID,
                                            ChecklistItem = checklist.ChecklistItem,
                                            FunctionalArea = checklist.FunctionalArea,
                                            StageName = checklist.StageName,
                                            isChecked = checklist.isChecked,
                                            CheckedBy = checklist.CheckedBy,
                                            CreatedById = checklist.CreatedById,
                                            DateCreated = checklist.DateCreated,
                                            DateUpdated = checklist.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got checklist for application and stage", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("ChangeIsCheckedStatus")]
        public async Task<object> ChangeIsCheckedStatus([FromBody] BPApplicationChecklistsBindingModel model)
        {
            try
            {
                

                if(model.ChecklistItemID == null || model.isChecked == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempChecklistItem = _context.BpApplicationChecklist.FirstOrDefault(x => x.ChecklistItemID == model.ChecklistItemID);

                    if (tempChecklistItem == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Error retrieving item from database",false));
                    }
                    else
                    {
                        tempChecklistItem.isChecked = model.isChecked;

                        _context.BpApplicationChecklist.Update(tempChecklistItem);
                        await _context.SaveChangesAsync();

                        

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Checklist item isChecked status updated successfully", true));
                    }
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
