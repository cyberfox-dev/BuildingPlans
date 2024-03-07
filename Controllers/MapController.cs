// Add the necessary using statement
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private readonly IMapService _mapService;
        private readonly AppDBContext _context;

        public MapController(IMapService mapService, AppDBContext context)
        {
            _mapService = mapService;
            _context = context;
        }

        [HttpPost("ProcessGeometry")]
        public async Task<object> ProcessGeometry([FromBody] MapBindingModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    // Use the map service to process the polygon
                    var result = await _mapService.ProcessGeometryAsync(model.Geometry, model.CreatedByID, model.ApplicationID, model.BufferedGeometry, model.IsInternal);

                    // Return the result
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ApplicationID.Count() > 0 ? "Transaction completed Successfully" : "Transaction completed Successfully"), result));

                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        // ... (Existing actions remain unchanged)
    }
}
