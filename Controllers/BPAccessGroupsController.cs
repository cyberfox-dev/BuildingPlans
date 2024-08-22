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
using BuildingPlans.Data.Migrations;
using iText.Commons.Actions.Contexts;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPAccessGroupsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPAccessGroupsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateAccessGroup")]
        public async Task<object> AddUpdateAccessGroup([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.AccessGroupName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempAccessgroup = _context.BPAccessGroups.FirstOrDefault(x => x.AccessGroupID == model.AccessGroupID);

                    if (tempAccessgroup == null)
                    {
                        tempAccessgroup = new BPAccessGroups()
                        {
                            AccessGroupName = model.AccessGroupName,
                            AccessGroupDescription = model.AccessGroupDescription,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.BPAccessGroups.AddAsync(tempAccessgroup);
                        await _context.SaveChangesAsync();
                        result = tempAccessgroup;
                    }
                    else
                    {
                        if (model.AccessGroupName != null)
                        {
                            tempAccessgroup.AccessGroupName = model.AccessGroupName;
                        }

                        if (model.AccessGroupDescription != null)
                        {
                            tempAccessgroup.AccessGroupDescription = model.AccessGroupDescription;
                        }
                        tempAccessgroup.DateUpdated = DateTime.Now;

                        _context.Update(tempAccessgroup);
                        await _context.SaveChangesAsync();
                        result = tempAccessgroup;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AccessGroupID > 0 ? "Access Group Updated Successfully" : "Access Group Created Successfully"), result));

                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllAccessGroups")]
        public async Task<object> GetAllAccessGroups()
        {
            try
            {
                var result = await (from accessGroups in _context.BPAccessGroups
                                    where accessGroups.isActive == true
                                    select new BPAccessGroups()
                                    {
                                        AccessGroupID = accessGroups.AccessGroupID,
                                        AccessGroupName = accessGroups.AccessGroupName,
                                        AccessGroupDescription = accessGroups.AccessGroupDescription,
                                        CreatedById = accessGroups.CreatedById,
                                        DateCreated = accessGroups.DateCreated,
                                        DateUpdated = accessGroups.DateUpdated,
                                        isActive = true
                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Access Groups", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAccessGroupByAccessGroupID")]
        public async Task<object> GetAccessGroupByAccessGroupID([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from accessGroups in _context.BPAccessGroups
                                    where accessGroups.AccessGroupID == model.AccessGroupID
                                    select new BPAccessGroups()
                                    {
                                        AccessGroupID = accessGroups.AccessGroupID,
                                        AccessGroupName = accessGroups.AccessGroupName,
                                        AccessGroupDescription = accessGroups.AccessGroupDescription,
                                        CreatedById = accessGroups.CreatedById,
                                        DateCreated = accessGroups.DateCreated,
                                        DateUpdated = accessGroups.DateUpdated,
                                        isActive = true
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Access Group By Access Group ID", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteAccessGroupByAccessGroupID")]
        public async Task<object> DeleteAccessGroupByAccessGroupID([FromBody] AccessGroupsBindingModel model)
        {
            var tempAccessGroup = _context.BPAccessGroups.FirstOrDefault(x => x.AccessGroupID == model.AccessGroupID);

            if (tempAccessGroup == null)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
            }
            else
            {
                tempAccessGroup.DateUpdated = DateTime.Now;
                tempAccessGroup.isActive = false;
                _context.Update(tempAccessGroup);
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Access Group Deleted Successfully", true));
            }
        }

        [HttpPost("GetAllAccessGroupsAndUserLink")]
        public async Task<object> GetAllAccessGroupsAndUserLinks([FromBody] AccessGroupsBindingModel model)
        {
            try
            {
                var result = await (from ac in _context.BPAccessGroups
                                    join aul in _context.BPAccessGroupsUserLinks
                                        on ac.AccessGroupID equals aul.AccessGroupID into acAulJoin
                                    from aul in acAulJoin.DefaultIfEmpty()
                                    where ac.isActive
                                    select new
                                    {
                                        AccessGroup = ac,
                                        UserLink = aul
                                    })
                              .GroupBy(x => new
                              {
                                  x.AccessGroup.AccessGroupID,
                                  x.AccessGroup.AccessGroupName,
                                  x.AccessGroup.AccessGroupDescription,
                                  x.AccessGroup.DateCreated,
                                  x.AccessGroup.DateUpdated,
                                  x.AccessGroup.isActive
                              })
                              .Select(g => new AccessGroupsDTO
                              {
                                  AccessGroupID = g.Key.AccessGroupID,
                                  AccessGroupName = g.Key.AccessGroupName,
                                  AccessGroupDescription = g.Key.AccessGroupDescription,
                                  DateCreated = g.Key.DateCreated,
                                  DateUpdated = g.Key.DateUpdated,
                                  isActive = g.Any(y => y.UserLink.isActive),
                                  AccessGroupUserLinkID = g.Where(y => y.UserLink != null && y.UserLink.UserProfileID == model.UserProfileID && y.UserLink.FunctionalArea == model.FunctionalArea)
                                                            .Select(y => (int?)y.UserLink.AccessGroupUserLinkID)
                                                            .FirstOrDefault()
                              })
                              .ToListAsync();

                return Ok(new ResponseModel(Enums.ResponseCode.OK, "Got All Access Groups And User Links", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

       
    }
}
