using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using WayleaveManagementSystem.BindingModel;
using WayleaveManagementSystem.Data.Entities;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WayleaveManagementSystem.Data;
using SixLabors.ImageSharp;

namespace WayleaveManagementSystem.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly IConfigService _configService;

        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;


        public ConfigController(AppDBContext context, IConfigService configService, IConfiguration configuration)
        {
            _configService = configService;
            _context = context;
            _configuration = configuration;

        }

        [HttpPost("AddUpdateConfig")]
        public async Task<object> AddUpdateConfig([FromBody] ConfigBindingModel model)
        {
            try
            {

                if (model == null )
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _configService.AddUpdateConfig(model.ConfigID, model.ConfigName, model.ConfigDescription, model.UtilitySlot1, model.UtilitySlot2, model.UtilitySlot3, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ConfigID > 0 ? "Config Updated Successfully" : "Config Saved Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpGet("NEWTest")]
        public async Task<object> NEWTest()
        {
            try
            {

               
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
              

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteConfig")]
        public async Task<object> DeleteConfig([FromBody] int configID)
        {
            try
            {

                if (configID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _configService.DeleteConfig(configID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Config Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }



        [HttpPost("GetConfigsByConfigID")]
        public async Task<object> GetConfigsByConfigID([FromBody] ConfigBindingModel model)
        {
            try
            {

                if (model.ConfigID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _configService.GetConfigsByConfigID(model.ConfigID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Configs List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }

        }


        [HttpPost("GetConfigsByConfigName")]
        public async Task<object> GetConfigsByConfigName([FromBody] ConfigBindingModel model)
        {
            try
            {

                if (model.ConfigID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _configService.GetConfigsByConfigName(model.ConfigName);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Configs List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetConfigsByUserID")]
        public async Task<object> GetConfigsByUserID([FromBody] ZoneLinkByUserIDBindingModel model)
        {
            try
            {

                if (model.UserID.Length < 3)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _configService.GetConfigsByUserID(model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Configs List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllConfigs")]
        public async Task<object> GetAllConfigs()
        {
            try
            {
                List<ConfigDTO> configDTOs = new List<ConfigDTO>();
                var result = await _configService.GetAllConfigs();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Configuration data", result));


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

    }

}
