using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Policy;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.BindingModel.ForGetByIDModels;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Service;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MFTController : Controller
    {

        private readonly AppDBContext _context;

        public MFTController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateMFT")]
        public async Task<object> AddUpdateMFT([FromBody] MFTBindingModel model)
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
                    if (model.MFTID == 0)
                    {
                        model.MFTID = 0;
                    }

                    var tempMFT = _context.MFT.FirstOrDefault(x => x.MFTID == model.MFTID);


                    if (tempMFT == null)
                    {
                        tempMFT = new MFT()
                        {
                            MFTID = model.MFTID, 
                            MFTNote = model.MFTNote,
                            ApplicationID = model.ApplicationID,
                            CreatedById = model.CreatedById,  
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now, 
                            DocumentLocalPath = model.DocumentLocalPath,    
                            DocumentName = model.DocumentName,  
                            isActive = true
                        };

                        await _context.MFT.AddAsync(tempMFT);
                        await _context.SaveChangesAsync();

                        result = tempMFT;

                    }
                    else
                    {
                        tempMFT.MFTNote = model.MFTNote;
                        tempMFT.DateUpdated = DateTime.Now;
                        tempMFT.DocumentLocalPath = model.DocumentLocalPath;
                        tempMFT.DocumentName = model.DocumentName;

                        _context.Update(tempMFT);
                        await _context.SaveChangesAsync();
                        result = tempMFT;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.MFTID > 0 ? "MFT Updated Successfully" : "MFT Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteMFT")]
        public async Task<object> DeleteMFT([FromBody] int mftID)
        {
            try
            {

                var tempMFT = _context.MFT.FirstOrDefault(x => x.MFTID == mftID);

                if (tempMFT == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempMFT.DateUpdated = DateTime.Now;
                    tempMFT.isActive = false;
                    _context.Update(tempMFT);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "MFT Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




        [HttpPost("GetMFTByApplicationID")]
        public async Task<object> GetMFTByApplicationID([FromBody] int applicationID)
        {
            try
            {
                var result = await (
               from mft in _context.MFT
               where mft.ApplicationID == applicationID && mft.isActive == true
               select new MFTDTO()
               {

                MFTID = mft.MFTID,
                MFTNote = mft.MFTNote,
                DocumentName = mft.DocumentName,
                isActive = mft.isActive,
                DocumentLocalPath = mft.DocumentLocalPath,
                ApplicationID = mft.ApplicationID,
                CreatedById = mft.CreatedById,  
                DateCreated = mft.DateCreated,
                DateUpdated = mft.DateUpdated,
               }
               ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Notes For Application", result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }

 
}
