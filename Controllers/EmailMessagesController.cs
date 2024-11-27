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
using System.Runtime.InteropServices;
namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailMessagesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public EmailMessagesController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateEmailMessage")]
        public async Task<object> AddUpdateEmailMessage([FromBody] EmailMessagesBindingModel model)
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
                    if(model.EmailMessageID == 0)
                    {
                        model.EmailMessageID = null;
                    }

                    var tempEmailMessage = _context.EmailMessages.FirstOrDefault(x => x.EmailMessageID == model.EmailMessageID);

                    if(tempEmailMessage == null)
                    {
                        tempEmailMessage = new EmailMessages()
                        {
                            EmailMessage = model.EmailMessage,
                            Category = model.Category,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.EmailMessages.AddAsync(tempEmailMessage);
                        await _context.SaveChangesAsync();

                        result = tempEmailMessage;
                    }
                    else
                    {
                        if(model.EmailMessage != null)
                        {
                            tempEmailMessage.EmailMessage = model.EmailMessage;
                        }

                        if(model.Category != null)
                        {
                            tempEmailMessage.Category = model.Category;
                        }
                        tempEmailMessage.DateUpdated = DateTime.Now;

                        _context.Update(tempEmailMessage);
                        await _context.SaveChangesAsync();

                        result = tempEmailMessage;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.EmailMessageID > 0 ? "Email Message Updated Successfully" : "Email Message Created Successfully"), result));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllEmailMessages")]
        public async Task<object> GetAllEmailMessages()
        {
            try
            {
                var result = await (from message in _context.EmailMessages
                                    where message.isActive == true && message.EmailMessage != null
                                    select new EmailMessagesDTO()
                                    {
                                        EmailMessageID = message.EmailMessageID,
                                        EmailMessage = message.EmailMessage,
                                        Category = message.Category,
                                        DateUpdated = message.DateUpdated,
                                        DateCreated = message.DateCreated,
                                        CreatedById = message.CreatedById

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Email Messages", result));
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
              
            }
        }


        [HttpPost("GetAllEmailMessagesForCategory")]
        public async Task<object> GetAllEmailMessagesForCategory([FromBody] EmailMessagesBindingModel model)
        {
            try
            {
                if(model.Category == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from message in _context.EmailMessages
                                        where message.Category == model.Category && message.EmailMessage != null && message.isActive == true
                                        select new EmailMessagesDTO()
                                        {
                                            EmailMessageID = message.EmailMessageID,
                                            EmailMessage = message.EmailMessage,
                                            Category = message.Category,
                                            DateUpdated = message.DateUpdated,
                                            DateCreated = message.DateCreated,
                                            CreatedById = message.CreatedById

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Email Messages For Category", result)); 
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteEmailMessageByEmailMessageID")]
        public async Task<object> DeleteEmailMessageByEmailMessageID([FromBody] EmailMessagesBindingModel model)
        {
            try
            {
                if(model.EmailMessageID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempEmailMessage = _context.EmailMessages.FirstOrDefault(x => x.EmailMessageID == model.EmailMessageID);

                    if(tempEmailMessage == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not find entry in database", false));

                    }
                    else
                    {
                        tempEmailMessage.isActive = false;
                        tempEmailMessage.DateUpdated = DateTime.Now;

                        _context.Update(tempEmailMessage);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Email Message Deleted Successfully", true));
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
