using BuildingPlans.Data;
using BuildingPlans.Models;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Models.BindingModel;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPFunctionalAreasController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPFunctionalAreasController(AppDBContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllFuntionalAreas")]
        public async Task<object> GetAllFUnctionalAreas()
        {
            try
            {
                var result = await (from functionalAreas in _context.BPFunctionalAreas
                                    where functionalAreas.isActive == true
                                    select new BPFunctionalAreasDTO()
                                    {
                                        FunctionalAreaID = functionalAreas.FunctionalAreaID,
                                        FAName = functionalAreas.FAName,
                                        FAItemCode = functionalAreas.FAItemCode,
                                        DateCreated = functionalAreas.DateCreated,
                                        DateUpdated = functionalAreas.DateUpdated,
                                        CreatedById = functionalAreas.CreatedById,
                                        isActive = true

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Functional Areas", result));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetFunctionalAreaByFunctionalAreaID")]
        public async Task<object>GetFunctionalAreaByFunctionalAreaID([FromBody ] int functionalAreaId)
        {
            try
            {
                if(functionalAreaId == null || functionalAreaId == 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

                else
                {
                    var result = await (from FunctionalAreas in _context.BPFunctionalAreas
                                        where FunctionalAreas.isActive == true && FunctionalAreas.FunctionalAreaID == functionalAreaId
                                        select new BPFunctionalAreasDTO()
                                        {
                                            FunctionalAreaID = FunctionalAreas.FunctionalAreaID,
                                            FAName = FunctionalAreas.FAName,
                                            FAItemCode = FunctionalAreas.FAItemCode,
                                            DateCreated = FunctionalAreas.DateCreated,
                                            DateUpdated = FunctionalAreas.DateUpdated,
                                            CreatedById = FunctionalAreas.CreatedById,
                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Functional Area", result));
                }
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
        
    }
}
