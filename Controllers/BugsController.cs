using BuildingPlans.Data;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using iText.StyledXmlParser.Jsoup.Nodes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data.Entities;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BugsController : ControllerBase
    {
        private readonly AppDBContext _context; 

        public BugsController (AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateBug")]
        public async Task<object> AddUpdateBug([FromBody] BugsBindingModel model)
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
                    if(model.BugID == 0)
                    {
                        model.BugID = null;
                    }

                    var tempBug = _context.Bugs.FirstOrDefault(x => x.BugID == model.BugID);

                    if(tempBug == null)
                    {
                        tempBug = new Bugs()
                        {
                           Description = model.Description,
                           isFixed = model.isFixed,
                           FixedBy = model.FixedBy,
                           Component = model.Component,
                           Category = model.Category,
                           CreatedById = model.CreatedById,
                           DateCreated = DateTime.Now,
                           DateUpdated = DateTime.Now,
                           isActive = true,
                        };

                        await _context.Bugs.AddAsync(tempBug);
                        await _context.SaveChangesAsync();

                        result = tempBug; 
                    }
                    else
                    {
                        if(model.Description != null)
                        {
                            tempBug.Description = model.Description;   
                        }

                        if(model.isFixed != null)
                        {
                            tempBug.isFixed = model.isFixed;
                        }

                        if (model.FixedBy != null)
                        {
                            tempBug.FixedBy = model.FixedBy;
                        }
                        tempBug.DateUpdated = DateTime.Now;

                        _context.Update(tempBug);
                        await _context.SaveChangesAsync();
                        result = tempBug;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.BugID > 0 ? "Bug reports Updated Successfully" : "Bug reports Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllBugs")]
        public async Task<object> GetAllBugs()
        {
            try
            {
                var result = await( from bug in _context.Bugs
                                    where bug.isFixed == false && bug.isActive == true
                                    orderby bug.DateCreated descending
                                    select new BugsDTO()
                                    {
                                        BugID = bug.BugID,
                                        Description = bug.Description,
                                        isFixed = bug.isFixed,
                                        FixedBy = bug.FixedBy,
                                        Category = bug.Category,
                                        Component = bug.Component,
                                        DateCreated = bug.DateCreated,
                                        DateUpdated = bug.DateUpdated,
                                        CreatedById = bug.CreatedById,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Bugs reports", result));
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteBug")]
        public async Task<object> DeleteBug([FromBody] BugsBindingModel model)
        {
            try
            {
                if(model.BugID <= 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempBug = _context.Bugs.FirstOrDefault(x => x.BugID == model.BugID);

                    if(tempBug == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Entry not found in database", false));
                    }
                    else
                    {
                        tempBug.isActive = false;
                        _context.Update(tempBug);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Bug report successFully deleted", true));
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
