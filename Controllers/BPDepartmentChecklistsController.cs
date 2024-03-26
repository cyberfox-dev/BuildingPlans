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
    public class BPDepartmentChecklistsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPDepartmentChecklistsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateChecklistItem")]
        public async Task<object> AddUpdateChecklistItem([FromBody] BPDepartmentChecklistsBindingModel model)
        {
            try
            {
                var result = new object();

                if(model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.ChecklistItemID == 0)
                    {
                        model.ChecklistItemID = null;
                    }

                    var tempChecklistItem = _context.BPDepartmentChecklists.FirstOrDefault(x => x.ChecklistItemID == model.ChecklistItemID);

                    if(tempChecklistItem == null)
                    {
                        tempChecklistItem = new BPDepartmentChecklists()
                        {
                            ChecklistItem = model.ChecklistItem,
                            FunctionalArea = model.FunctionalArea,
                            DepartmentName = model.DepartmentName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.BPDepartmentChecklists.AddAsync(tempChecklistItem);
                        await _context.SaveChangesAsync();

                        result = tempChecklistItem;
                    }
                    else
                    {
                        if(model.ChecklistItem != null)
                        {
                            tempChecklistItem.ChecklistItem = model.ChecklistItem;
                        }
                        if(model.FunctionalArea != null)
                        {
                            tempChecklistItem.FunctionalArea = model.FunctionalArea;
                        }
                        if(model.DepartmentName != null)
                        {
                            tempChecklistItem.DepartmentName = model.DepartmentName;
                        }
                        
                        tempChecklistItem.DateUpdated = DateTime.Now;
                        tempChecklistItem.isActive = true;

                        _context.Update(tempChecklistItem);
                        await _context.SaveChangesAsync();

                        result = tempChecklistItem;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ChecklistItemID > 0 ? "Checklist Item Updated Successfully" : "Checklist Item Created Successfully"), result));
                }
            
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllChecklistItemsForDepartment")]
        public async Task<object> GetAllChecklistItemsForDepartments([FromBody]BPDepartmentChecklistsBindingModel model)
        {
            try
            {
                var result = await (from Departments in _context.BPDepartmentChecklists
                                    where Departments.isActive == true && Departments.FunctionalArea == model.FunctionalArea
                                    && Departments.DepartmentName == model.DepartmentName
                                    select new BPDepartmentChecklistsDTO()
                                    {
                                       ChecklistItemID = Departments.ChecklistItemID,
                                       ChecklistItem = Departments.ChecklistItem,
                                       FunctionalArea = Departments.FunctionalArea,
                                       DepartmentName = Departments.DepartmentName,
                                       CreatedById = Departments.CreatedById,
                                       DateCreated =Departments.DateCreated,
                                       DateUpdated = Departments.DateUpdated

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Checklist Items For Department", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteDepartmentChecklistItemByChecklistItemId")]
        public async Task<object> DeleteDepartmentChecklistItemByChecklistItemId([FromBody] BPDepartmentChecklistsBindingModel model)
        {
            try
            {
                var tempChecklistItem = _context.BPDepartmentChecklists.FirstOrDefault(x => x.ChecklistItemID == model.ChecklistItemID);

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

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department Checklist Item Deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
