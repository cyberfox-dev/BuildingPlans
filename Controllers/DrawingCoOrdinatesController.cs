using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrawingCoOrdinatesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public DrawingCoOrdinatesController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateCoOrdinates")]
        public async Task<object> AddUpdateCoOrdinates([FromBody] CoOrdinatesBindingModel model)
        {
            try
            {
                var result = new object();

                if (model.ApplicationID == null || model.DrawingType == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.CoOrdinateID == 0)
                    {
                        model.CoOrdinateID = null;
                    }
                    var tempCoOrdinate = _context.DrawingCoOrdinates.FirstOrDefault(x => x.CoOrdinateID == model.CoOrdinateID);

                    if (tempCoOrdinate == null)
                    {
                        tempCoOrdinate = new DrawingCoOrdinates()
                        {
                            ApplicationID = model.ApplicationID,
                            DrawingType = model.DrawingType,
                            Latitude = model.Latitude,
                            Longitude = model.Longitude,
                            Radius = model.Radius,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.AddAsync(tempCoOrdinate);
                        await _context.SaveChangesAsync();

                        result = tempCoOrdinate;
                    }
                    else
                    {
                        //For Future Updating Entries
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.CoOrdinateID > 0 ? "CoOrdinate updated successfully " : "CoOrdinate created successfully"), result));
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetCoOrdinatesForDrawing")]
        public async Task<object> GetCoOrdinateForDrawing([FromBody] CoOrdinatesBindingModel model)
        {
            try
            {
                if (model.ApplicationID == null || model.DrawingType == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from drawing in _context.DrawingCoOrdinates
                                        where drawing.ApplicationID == model.ApplicationID && drawing.DrawingType == model.DrawingType && drawing.isActive == true
                                        select new CoOrdinatesDTO()
                                        {
                                            CoOrdinateID = drawing.CoOrdinateID,
                                            DrawingType = drawing.DrawingType,
                                            ApplicationID = drawing.ApplicationID,
                                            Latitude = drawing.Latitude,
                                            Longitude = drawing.Longitude,
                                            Radius = drawing.Radius,
                                            CreatedById = drawing.CreatedById,
                                            DateCreated = drawing.DateCreated,
                                            DateUpdated = drawing.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all Co-ordinates for drawing", result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteAllCoOrdinatesForDrawing")]
        public async Task<object> DeleteAllCoOrdinatesForDrawing([FromBody] CoOrdinatesBindingModel model)
        {
            try
            {
                if (model.ApplicationID == null || model.DrawingType == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var  tempCoOrdinates = _context.DrawingCoOrdinates.Where(x =>x.ApplicationID == model.ApplicationID && x.DrawingType == model.DrawingType).ToList();
                    if(tempCoOrdinates == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "No Entries Found", false));
                    }
                    else
                    {
                        foreach (var coordinate in tempCoOrdinates)
                        {
                            coordinate.isActive = false;
                            _context.Update(coordinate);
                        }
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Drawing Deleted Successfully", true));
                    }
                    
                }

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
