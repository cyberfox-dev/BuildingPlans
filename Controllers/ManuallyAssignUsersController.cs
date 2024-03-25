using BuildingPlans.Data;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
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
