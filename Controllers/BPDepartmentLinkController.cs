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
    public class BPDepartmentLinkController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPDepartmentLinkController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateDepartmentLink")]
        public async Task<object> AddUpdateDepartmentLink([FromBody] BPDepartmentLinkBindingModel model)
        {
            try
            {
                if (model == null || model.DepartmentName == null || model.FunctionalArea == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = new object();
                    if (model.DepartmentLinkID == 0)
                    {
                        model.DepartmentLinkID = null;
                    }

                    var tempDepartmentLink = _context.BPDepartmentLinkTable.FirstOrDefault(x => x.DepartmentLinkID == model.DepartmentLinkID);

                    if (tempDepartmentLink == null)
                    {
                        tempDepartmentLink = new BPDepartmentLinkTable()
                        {
                            FunctionalArea = model.FunctionalArea,
                            DepartmentID = model.DepartmentID,
                            DepartmentName = model.DepartmentName,
                            AssignedUserID = model.AssignedUserID,
                            isAdmin = model.isAdmin,
                            AccessGroupName = model.AccessGroupName,
                            AccessGroupUserLinkID = model.AccessGroupUserLinkID,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.AddAsync(tempDepartmentLink);
                        await _context.SaveChangesAsync();

                        result = tempDepartmentLink;
                    }
                    else
                    {
                        if (model.FunctionalArea != null)
                        {
                            tempDepartmentLink.FunctionalArea = model.FunctionalArea;
                        }
                        if (model.DepartmentLinkID != null)
                        {
                            tempDepartmentLink.DepartmentID = model.DepartmentLinkID;
                        }
                        if (model.DepartmentName != null)
                        {
                            tempDepartmentLink.DepartmentName = model.DepartmentName;
                        }
                        if (model.AssignedUserID != null)
                        {
                            tempDepartmentLink.AssignedUserID = model.AssignedUserID;
                        }
                        if (model.isAdmin != null)
                        {
                            tempDepartmentLink.isAdmin = model.isAdmin;
                        }
                        if (model.AccessGroupName != null)
                        {
                            tempDepartmentLink.AccessGroupName = model.AccessGroupName;
                        }
                        if (model.AccessGroupUserLinkID != null)
                        {
                            tempDepartmentLink.AccessGroupUserLinkID = model.AccessGroupUserLinkID;
                        }
                        tempDepartmentLink.DateUpdated = DateTime.Now;

                        _context.Update(tempDepartmentLink);


                        await _context.SaveChangesAsync();

                        result = tempDepartmentLink;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DepartmentLinkID > 0 ? " Department User Link Updated Successfully" : "Deparment User Link Created Successfully"), result));
                }


            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllUsersForDepartment")]
        public async Task<object> GetAllUsersForDepartment([FromBody] BPDepartmentLinkBindingModel model)
        {
            try
            {
                var result = await (from users in _context.BPDepartmentLinkTable
                                    where users.FunctionalArea == model.FunctionalArea && users.DepartmentName == model.DepartmentName && users.isActive == true
                                    select new BPDepartmentLinkDTO()
                                    {
                                        DepartmentLinkID = users.DepartmentLinkID,
                                        DepartmentID = users.DepartmentID,
                                        DepartmentName = users.DepartmentName,
                                        FunctionalArea = users.FunctionalArea,
                                        AssignedUserID = users.AssignedUserID,
                                        AccessGroupName = users.AccessGroupName,
                                        AccessGroupUserLinkID = users.AccessGroupUserLinkID

                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Users for department", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteUserFromDepartment")]
        public async Task<object> DeleteUserFromDepartment([FromBody] BPDepartmentLinkBindingModel model)
        {
            try
            {
                var tempDepartmentLink = _context.BPDepartmentLinkTable.FirstOrDefault(x => x.DepartmentLinkID == model.DepartmentLinkID);

                if (tempDepartmentLink == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    tempDepartmentLink.isActive = false;
                    tempDepartmentLink.DateUpdated = DateTime.Now;

                    _context.Update(tempDepartmentLink);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User Successfully unlinked from department", false));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllDepartmentLinksForUser")]
        public async Task<object> GetAllDepartmentLinksForUser([FromBody] BPDepartmentLinkBindingModel model)
        {
            try
            {
                var result = await (from departments in _context.BPDepartmentLinkTable
                                    where departments.AssignedUserID == model.AssignedUserID && departments.isActive == true
                                    select new BPDepartmentLinkDTO()
                                    {
                                        DepartmentLinkID = departments.DepartmentLinkID,
                                        FunctionalArea = departments.FunctionalArea,
                                        DepartmentID = departments.DepartmentID,
                                        DepartmentName = departments.DepartmentName,
                                        DateCreated = departments.DateCreated,
                                        DateUpdated = departments.DateUpdated,
                                        CreatedById = departments.CreatedById,
                                        isActive = departments.isActive,
                                        isAdmin = departments.isAdmin,


                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All User Department Links", result));
            }

            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
