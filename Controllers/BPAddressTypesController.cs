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
    public class BPAddressTypesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPAddressTypesController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateAddressType")]
        public async Task<object> AddUpdateAddressType([FromBody] BPAddressTypesBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.TypeName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.AddresTypeID == 0)
                    {
                        model.AddresTypeID = null;
                    }
                    var tempAddressType = _context.BPAddressTypes.FirstOrDefault(x => x.AddresTypeID == model.AddresTypeID);

                    if (tempAddressType == null)
                    {
                        tempAddressType = new BPAddressType()
                        {
                            TypeName = model.TypeName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.BPAddressTypes.AddAsync(tempAddressType);
                        await _context.SaveChangesAsync();

                        result = tempAddressType;
                    }
                    else
                    {
                        if (model.TypeName != null)
                        {
                            tempAddressType.TypeName = model.TypeName;
                        }

                        tempAddressType.DateUpdated = DateTime.Now;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.AddresTypeID > 0 ? "Address Type Updated Successfully" : "Address Type Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllAddressTypes")]
        public async Task<object>GetAllAddressTypes()
        {
            try
            {
                var result = await (from Address in _context.BPAddressTypes
                                    where Address.isActive == true
                                    select new BPAddressTypesDTO()
                                    {
                                        AddresTypeID = Address.AddresTypeID,
                                        TypeName = Address.TypeName,
                                        DateCreated = Address.DateCreated,
                                        DateUpdated = Address.DateUpdated,
                                        CreatedById = Address.CreatedById,
                                        isActive = true
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All AddressTypes", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }

}
