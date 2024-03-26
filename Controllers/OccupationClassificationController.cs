using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OccupationClassificationController : ControllerBase
    {
        private readonly AppDBContext _context;

        public OccupationClassificationController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateOccupationClassification")]
        public async Task<object> AddUpdateOccupationClassification([FromBody] OccupationClassificationTableBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.OccupationID == 0)
                    {
                        model.OccupationID = null;
                    }

                    var tempOccupationTable = _context.OccupationClassificationTable.FirstOrDefault(x => x.OccupationID == model.OccupationID);

                    if (tempOccupationTable == null)
                    {
                        tempOccupationTable = new OccupationClassificationTable()
                        {

                            OccupationName = model.OccupationName,
                            OccupationCode = model.OccupationCode,
                            Occupancy = model.Occupancy,
                            OccupancyDescription = model.OccupancyDescription,
                            FunctionalArea = model.FunctionalArea,
                            CreatedById = model.createdById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.OccupationClassificationTable.AddAsync(tempOccupationTable);
                        await _context.SaveChangesAsync();
                        result = tempOccupationTable;
                    }
                    else
                    {
                        if (model.OccupationName != null)
                        {
                            tempOccupationTable.OccupationName = model.OccupationName;
                        }

                        if (model.OccupationCode != null)
                        {
                            tempOccupationTable.OccupationCode = model.OccupationCode;
                        }

                        if (model.Occupancy != null)
                        {
                            tempOccupationTable.Occupancy = model.Occupancy;
                        }

                        if (model.OccupancyDescription != null)
                        {
                            tempOccupationTable.OccupancyDescription = model.OccupancyDescription;
                        }
                        if (model.FunctionalArea != null)
                        {
                            tempOccupationTable.FunctionalArea = model.FunctionalArea;
                        }
                        tempOccupationTable.DateUpdated = DateTime.Now;
                        tempOccupationTable.isActive = true;

                        _context.Update(tempOccupationTable);
                        await _context.SaveChangesAsync();
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.OccupationID > 0 ? " Occupation Classification Updated Successfully" : "Occupation Classification Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllOccupationClassifications")]
        public async Task<object> GetAllOccupationClassifications()
        {
            try
            {
                var result = await (from occupationClassifications in _context.OccupationClassificationTable
                                    where occupationClassifications.isActive == true
                                    select new OccupationClassificationTable()
                                    {
                                        OccupationID = occupationClassifications.OccupationID,
                                        OccupationName = occupationClassifications.OccupationName,
                                        OccupationCode = occupationClassifications.OccupationCode,
                                        Occupancy = occupationClassifications.Occupancy,
                                        OccupancyDescription = occupationClassifications.OccupancyDescription,
                                        FunctionalArea = occupationClassifications.FunctionalArea,
                                        CreatedById = occupationClassifications.CreatedById,
                                        DateCreated = occupationClassifications.DateCreated,
                                        DateUpdated = occupationClassifications.DateUpdated,
                                        isActive = occupationClassifications.isActive,
                                    }
                               ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Occupation Classifications", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteOccupationClassificationByOccupationID")]
        public async Task<object> DeleteOccupationClassifciationByOccupationID([FromBody] int? occupationID)
        {
            try
            {
                var tempOccupationTable = await _context.OccupationClassificationTable.FindAsync(occupationID);

                if(tempOccupationTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Occupation Classification does not exist on database", false));
                }
                else
                {
                    tempOccupationTable.isActive = false;
                    tempOccupationTable.DateUpdated = DateTime.Now;
                    _context.Update(tempOccupationTable);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "OccupationClassification Deleted successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

           

        }

        [HttpPost("GetClassificationByFunctionalArea")]
        public async Task<object> GetClassificationByFunctionalArea([FromBody] OccupationClassificationTableBindingModel model)
        {
            try
            {
                var result = await (from classification in _context.OccupationClassificationTable
                                    where classification.isActive == true && classification.FunctionalArea == model.FunctionalArea
                                    select new OccupationClassificationTableDTO()
                                    {
                                        OccupationID = classification.OccupationID,
                                        OccupationName = classification.OccupationName,
                                        OccupationCode = classification.OccupationCode,
                                        Occupancy = classification.Occupancy,
                                        OccupancyDescription = classification.OccupancyDescription,
                                        dateCreated = classification.DateCreated,
                                        dateUpdated = classification.DateUpdated,
                                        createdById = classification.CreatedById,
                                        FunctionalArea = classification.FunctionalArea,
                                        
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all classifications for functional Area", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
