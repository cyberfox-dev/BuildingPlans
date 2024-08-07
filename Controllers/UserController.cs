﻿using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace BuildingPlans.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        //This is the sign the token
        private readonly JWTConfig _jWTConfig;


        //This is a service injection using the constructor 
        public UserController(ILogger<UserController> logger, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IOptions<JWTConfig> jwtConfig, RoleManager<IdentityRole> roleManager)
        {

            // dotnet core will then inject these service i created into the controller
            // dotnet core will then inject these service i created into the controller
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _jWTConfig = jwtConfig.Value;
            _roleManager = roleManager;
        }


        //FromBody = the infromation will be found in the reqest body(We will get the infomation form url)
        //this asyn method seves the propose of adding and updating
        [HttpPost("RegisterUser")]
        public async Task<object> RegisterUser([FromBody] AddUpdateRegisterUserBindingModel model)
        {
            try
            {
                var User = await _userManager.FindByEmailAsync(model.Email);

                if (User != null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Email already exists", null));
                }
                else
                {
                    var user = new AppUser()
                    {
                        UserName = model.Email,
                        FullName = model.FullName,
                        Email = model.Email,
                        DateCreated = DateTime.Now,
                        DateModified = DateTime.Now
                    };


                    //to register a user i and going to use userManager
                    var result = await _userManager.CreateAsync(user, model.Password);
                    var appUser = await _userManager.FindByEmailAsync(model.Email);
                    var userInfo = new UserDTO(appUser.FullName, appUser.Email, appUser.UserName, appUser.DateCreated, appUser.Id);

                    if (result.Succeeded)
                    {
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "You have been Registered!", userInfo));
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.
                    }
                    else
                    {
                        //covert errors to an array then return it by Description
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "", result.Errors.Select(x => x.Description).ToArray()));
                    }
                }

            }
            catch (Exception ex)
            {

#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.
            }

        }


        [HttpPost("EmailExists")]
        public async Task<bool> EmailExists([FromBody] AddUpdateRegisterUserBindingModel model)
        {
            try
            {
                var User = await _userManager.FindByEmailAsync(model.Email);
                if (User != null)
                {
                    return true; // Email exists
                }
                else
                {
                    return false; // Email doesn't exist
                }
            }
            catch (Exception)
            {
                return false; // Ideally, you might want to handle exceptions differently, maybe log them.
            }
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetAllUser")]
        public async Task<object> GetAllUser()
        {
            try
            {
                List<UserDTO> allUserDTO = new List<UserDTO>();
                var users = _userManager.Users.Select(x => new UserDTO(x.FullName, x.Email, x.UserName, x.DateCreated, x.Id));

                return await Task.FromResult(users);

                //foreach (var user in users)
                //{
                //    var roles = (await _userManager.GetRolesAsync(user)).ToList();

                //    allUserDTO.Add(new UserDTO(user.FullName, user.Email, user.UserName, user.DateCreated, roles));
                //}
                //return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", allUserDTO));
            }
            catch (Exception ex)
            {
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.

            }
        }

        //[HttpGet("GetUserList")]
        //public async Task<object> GetUserList()
        //{
        //    try
        //    {
        //        List<UserDTO> allUserDTO = new List<UserDTO>();
        //        var users = _userManager.Users.ToList();
        //        foreach (var user in users)
        //        {
        //            var role = (await _userManager.GetRolesAsync(user)).ToList();
        //            if (role.Any(x => x == "User"))
        //            {
        //                allUserDTO.Add(new UserDTO(user.FullName, user.Email, user.UserName, user.DateCreated, role));
        //            }
        //        }
        //        return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", allUserDTO));
        //    }
        //    catch (Exception ex)
        //    {
        //        return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
        //    }
        //}

        [HttpPost("Login")]
        public async Task<object> Login([FromBody] LoginBindingModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {



                    var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
                    if (result.Succeeded)
                    {
                        var appUser = await _userManager.FindByEmailAsync(model.Email);
                        var user = new UserDTO(appUser.FullName, appUser.Email, appUser.UserName, appUser.DateCreated, appUser.Id);
                        user.Token = GenerateToken(appUser);

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "", user));
                    }
                    else
                    {

#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Login Failed, Invalid Email or Password", null));
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.
                    }
                }
                else
                {
                    return await Task.FromResult("Parameters are missing");
                }



            }
            catch (Exception ex)
            {
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.
            }
        }

        private string GenerateToken(AppUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            //get token key to sign token
            var key = Encoding.ASCII.GetBytes(_jWTConfig.Key);
            //if there is a key mismatch token will not be valided im going to use the same key to genarate token and vaidate token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.NameId, user.Id),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                //Token will expire after 12h
                Expires = DateTime.Now.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _jWTConfig.Audience,
                Issuer = _jWTConfig.Issuer,
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);

        }

        [HttpPost("UpdatePassword")]
        public async Task<object> UpdatePassword([FromBody] LoginBindingModel model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "User not found", null));
                }

                // Generate a password reset token and reset the user's password
                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

                //var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetResult = await _userManager.ResetPasswordAsync(user, resetToken, model.Password);

                if (resetResult.Succeeded)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Password updated successfully", null));
                }
                else
                {
                    // Convert errors to an array then return them by Description
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Password update failed",
                        resetResult.Errors.Select(x => x.Description).ToArray()));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }






    }
}