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
    public class UserLinkToArchitectController : ControllerBase
    {
        private readonly AppDBContext _context;

        public UserLinkToArchitectController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateLinkedUser")]
        public async Task<object> AddUpdateLinkedUser([FromBody] UserLinkToArchitectBindingModelcs model)
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
                    if (model.UserLinkID == 0)
                    {
                        model.UserLinkID = null;
                    }
                    var tempLinkedUser = _context.UserLinkToArchitects.FirstOrDefault(x => x.UserLinkID == model.UserLinkID);

                    if (tempLinkedUser == null)
                    {
                        tempLinkedUser = new UserLinkToArchitect()
                        {
                            ArchitectUserID = model.ArchitectUserID,
                            ClientUserId = model.ClientUserId,
                            ArchitectName = model.ArchitectName,
                            CLientFullName = model.CLientFullName,
                            CreatedById = model.CreatedById,
                            Address = model.Address,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };
                        await _context.UserLinkToArchitects.AddAsync(tempLinkedUser);
                        await _context.SaveChangesAsync();

                        result = tempLinkedUser;
                    }
                    else
                    {
                        //check how update is to be done
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User Linked To Architect SuccessFully", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllClientsForArchitect")]
        public async Task<object> GetAllClientsForArchitect([FromBody] UserLinkToArchitectBindingModelcs model)
        {
            try
            {
                var result = await (from users in _context.UserLinkToArchitects
                                    where users.isActive == true && users.ArchitectUserID == model.ArchitectUserID
                                    select new UserLinkToArchitectDTO()
                                    {
                                        UserLinkID = users.UserLinkID,
                                        ArchitectUserID = users.ArchitectUserID,
                                        ArchitectName = users.ArchitectName,
                                        ClientUserId = users.ClientUserId,
                                        CLientFullName = users.CLientFullName,
                                        Address = users.Address,
                                        DateCreated = users.DateCreated,
                                        DateUpdated = users.DateUpdated,
                                        CreatedById = users.CreatedById,

                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Clients For Architect", result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteUserLinkToArchitect")]
        public async Task<object> DeleteUserlinkToArchitect([FromBody] UserLinkToArchitectBindingModelcs model)
        {
            try
            {
                var tempUserLink = _context.UserLinkToArchitects.FirstOrDefault(x => x.UserLinkID == model.UserLinkID);

                if (tempUserLink == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }

                else
                {
                    tempUserLink.isActive = false;
                    tempUserLink.DateUpdated = DateTime.Now;
                    _context.Update(tempUserLink);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User link to architect deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetArchitectForUser")]
        public async Task<object> GetArchitectForUser([FromBody] UserLinkToArchitectBindingModelcs model)
        {
            try
            {
                var result = await (from users in _context.UserLinkToArchitects
                                    where users.ClientUserId == model.ClientUserId && users.isActive == true
                                    select new UserLinkToArchitectDTO()
                                    {
                                        UserLinkID = users.UserLinkID,
                                        ArchitectUserID = users.ArchitectUserID,
                                        ArchitectName = users.ArchitectName,
                                        ClientUserId = users.ClientUserId,
                                        CLientFullName = users.ClientUserId,
                                        Address = users.Address,
                                        DateCreated = users.DateCreated,
                                        DateUpdated = users.DateUpdated,
                                        CreatedById = users.CreatedById,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Architects For User", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}


