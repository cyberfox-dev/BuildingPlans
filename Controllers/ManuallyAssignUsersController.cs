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
using WayleaveManagementSystem.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManuallyAssignUsersController : ControllerBase
    {
        private readonly AppDBContext _context;
        public ManuallyAssignUsersController(AppDBContext context)
        {
            _context = context;

        }

        //        [HttpPost("AddManuallyAssignedUser")]
        //        public async Task<object> AddManuallyAssignedUser([FromBody]ManuallyAssignUsersBindingModel model)
        //        {
        //            try
        //            {

        //                var result = new object();

        //                if (model == null || model.AssignedToUserId ==null)
        //                {
        //                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
        //                }
        //                else
        //                {
        //                    if (model.ReferalID == 0)
        //                    {
        //                        model.ReferalID = null;
        //                    }

        //                    var tempManuallyAssignUsers = _context.ManuallyAssignUsers.FirstOrDefault(x => x.ReferalID == model.ReferalID);

        //                    if (tempManuallyAssignUsers == null)
        //                    {
        //                        tempManuallyAssignUsers = new ManuallyAssignUsers()
        //                        {
        //                            ReferalID = model.ReferalID,
        //                            ApplicationID = model.ApplicationID,
        //                            ProjectNumber = model.ProjectNumber,
        //                            AssignedToUserId = model.AssignedToUserId,
        //                            Description = model.Description,
        //                            CreatedById = model.CreatedById,
        //                            DateCreated = DateTime.Now,
        //                            DateUpdated = DateTime.Now,
        //                            isActive = true,
        //                        };
        //                        await _context.ManuallyAssignUsers.AddAsync(tempManuallyAssignUsers);
        //                        await _context.SaveChangesAsync();

        //                        result = tempManuallyAssignUsers;
        //                    }

        //                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "User Successfully Assigned to project ", result));
        //                }
        //            }
        //            catch (Exception ex)
        //            {
        //                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
        //            }
        //        }
    }
}
