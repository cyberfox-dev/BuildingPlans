using BuildingPlans.Data;
using Microsoft.AspNetCore.Mvc;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WayleavePermitExpirationController : ControllerBase
    {
        private readonly AppDBContext _context;

        public WayleavePermitExpirationController(AppDBContext context)
        {
            _context = context;
        }

        // Method for adding or updating Wayleave Permit Expiration data
        //[HttpPost("AddUpdateWayleavePermitExpiration")]
        //public async Task<object> AddUpdateWayleavePermitExpiration([FromBody] WayleavePermitExpirationBindingModel model)
        //{
        //    try
        //    {

        //        var result = new object();

        //        if (model == null)
        //        {
        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
        //        }
        //        else
        //        {
        //            if (model == null)
        //            {
        //                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
        //            }

        //            var expirationEntry = _context.WayleavePermitExpiration.FirstOrDefault(x => x.WayleavePermitExpirationID == model.WayleavePermitExpirationID);

        //            if (expirationEntry == null)
        //            {
        //                expirationEntry = new WayleavePermitExpiration()
        //                {
        //                    ApplicationID = model.ApplicationID,
        //                    SubdepartmentID = model.SubdepartmentID,
        //                    ZoneID = model.ZoneID,
        //                    OriginalDateWAPGenerated = model.OriginalDateWAPGenerated,
        //                    OriginalDatePermitGenerated = model.OriginalDatePermitGenerated,
        //                    NumberOfDaysWap = model.NumberOfDaysWap,
        //                    NumberOfDaysPermit = model.NumberOfDaysPermit
        //                };
        //                await _context.WayleavePermitExpiration.AddAsync(expirationEntry);
        //                await _context.SaveChangesAsync();

        //                result = expirationEntry;
        //            }
        //            else
        //            {

        //                if (model.SubdepartmentID != null)
        //                {
        //                    expirationEntry.SubdepartmentID = model.SubdepartmentID;
        //                }
        //                if (model.ZoneID != null)
        //                {
        //                    expirationEntry.ZoneID = model.ZoneID;
        //                }
        //                if (model.OriginalDateWAPGenerated != null)
        //                {
        //                    expirationEntry.OriginalDateWAPGenerated = model.OriginalDateWAPGenerated;
        //                }
        //                if (model.OriginalDatePermitGenerated != null)
        //                {
        //                    expirationEntry.OriginalDatePermitGenerated = model.OriginalDatePermitGenerated;
        //                }
        //                if (model.NumberOfDaysWap != null)
        //                {
        //                    expirationEntry.NumberOfDaysWap = model.NumberOfDaysWap;
        //                }
        //                if (model.NumberOfDaysPermit != null)
        //                {
        //                    expirationEntry.NumberOfDaysPermit = model.NumberOfDaysPermit;
        //                }

        //                _context.Update(expirationEntry);
        //                await _context.SaveChangesAsync();
        //                result = expirationEntry;


        //            }
        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.WayleavePermitExpirationID > 0 ? "Expiration Updated Successfully" : "Expiration Created Successfully"), result));
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
        //    }
        //}


    }
}
