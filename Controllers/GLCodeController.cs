﻿using Microsoft.AspNetCore.Http;
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

namespace WayleaveManagementSystem.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class GLCodeController : ControllerBase
    {
        private readonly IGLCodeService _glCodeService;
    


        public GLCodeController(IGLCodeService glCodeService)
        {
            _glCodeService = glCodeService;
        
        }

        [HttpPost("AddUpdateGLCode")]
        public async Task<object> AddUpdateGLCode([FromBody] GLCodeBindingModel model)
        {
            try
            {

                if (model == null || model.GLCodeName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _glCodeService.AddUpdateGLCode(model.GLCodeID, model.GLCodeName, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.GLCodeID > 0 ? "GL Code Updated Successfully" : "GL Code Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteGLCode")]
        public async Task<object> DeleteGLCode([FromBody] int glCodeID)
        {
            try
            {

                if (glCodeID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _glCodeService.DeleteGLCode(glCodeID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "GL Code Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetGLCodeByDepartmentID")]
        public async Task<object> GetGLCodeByDepartmentID([FromBody] ZoneLinkByUserIDBindingModel model)
        {
            try
            {

                if (model.UserID.Length < 3)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _glCodeService.GetGLCodeByDepartmentID(model.UserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "GL Code List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
                 
            }
        }

    }

}