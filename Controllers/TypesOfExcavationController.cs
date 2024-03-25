using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypesOfExcavationController : ControllerBase
    {
        private readonly AppDBContext _context;


        public TypesOfExcavationController(AppDBContext context)
        {
            _context = context;

        }

        [HttpPost("AddUpdateTypesOfExcavation")]
        public async Task<object> AddUpdateTypesOfExcavation([FromBody] TypeOfExcavationBindingModel model)
        {
            try
            {
                var result = new object();

                if (model == null || model.TypeOfExcavationName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.TypeOfExcavationID == 0)
                    {
                        model.TypeOfExcavationID = null;
                    }

                    var tempTypesOfExcavation = _context.TypesOfExcavation.FirstOrDefault(x => x.TypeOfExcavationID == model.TypeOfExcavationID);

                    if (tempTypesOfExcavation == null)
                    {
                        tempTypesOfExcavation = new TypeOfExcavation()
                        {

                            TypeOfExcavationName = model.TypeOfExcavationName,
                            TypeOfExcavationDescription = model.TypeOfExcavationDescription,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };

                        await _context.TypesOfExcavation.AddAsync(tempTypesOfExcavation);
                        await _context.SaveChangesAsync();

                        result = tempTypesOfExcavation;
                    }
                    else
                    {
                        if (model.TypeOfExcavationName != null)
                        {
                            tempTypesOfExcavation.TypeOfExcavationName = model.TypeOfExcavationName;
                        }
                        if (model.TypeOfExcavationDescription != null)
                        {
                            tempTypesOfExcavation.TypeOfExcavationDescription = model.TypeOfExcavationDescription;
                        }


                        tempTypesOfExcavation.DateUpdated = DateTime.Now;

                        _context.Update(tempTypesOfExcavation);
                        await _context.SaveChangesAsync();
                        result = tempTypesOfExcavation;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.TypeOfExcavationID > 0 ? "Type of excavation updated successfully" : "Type of excavation created successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }



        [HttpPost("DeleteTypesOfExcavationByID")]
        public async Task<object> DeleteTypesOfExcavationByID([FromBody] int typeOfExcavationID)
        {
            try
            {

                var tempTypesOfExcavation = _context.TypesOfExcavation.FirstOrDefault(x => x.TypeOfExcavationID == typeOfExcavationID);

                if (tempTypesOfExcavation == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempTypesOfExcavation.DateUpdated = DateTime.Now;
                    tempTypesOfExcavation.isActive = false;
                    _context.Update(tempTypesOfExcavation);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Type of excavation Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpGet("GetAllTypesOfExcavation")]
        public async Task<object> GetAllTypesOfExcavation()
        {
            try
            {
                var result = await (
                from typeOfExcavation in _context.TypesOfExcavation
                where typeOfExcavation.isActive == true
                select new TypeOfExcavation()
                {
                    TypeOfExcavationID = typeOfExcavation.TypeOfExcavationID,
                    TypeOfExcavationDescription = typeOfExcavation.TypeOfExcavationDescription,
                    CreatedById = typeOfExcavation.CreatedById,
                    DateCreated = typeOfExcavation.DateCreated,
                    DateUpdated = typeOfExcavation.DateUpdated,
                    TypeOfExcavationName = typeOfExcavation.TypeOfExcavationName,
                    isActive = true,
                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Types of excavation", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }
}
