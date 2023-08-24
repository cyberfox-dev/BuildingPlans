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
    public class ContactDetailsController : Controller
    {

        private readonly AppDBContext _context;

        public ContactDetailsController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateContactDetail")]
        public async Task<object> AddUpdateContactDetail([FromBody] ContactDetailsBindingModel model)
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
                    if (model.ContactDetailID == 0)
                    {
                        model.ContactDetailID = 0;
                    }

                    var tempContactDetails = _context.ContactDetails.FirstOrDefault(x => x.ContactDetailID == model.ContactDetailID);


                    if (tempContactDetails == null)
                    {
                        tempContactDetails = new ContactDetails()
                        {
                            ContactDetailID = model.ContactDetailID,
                            FullName = model.FullName,
                            CellNo = model.CellNo, 
                            Email = model.Email, 
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now, 
                            SubDepartmentID = model.SubDepartmentID,
                            SubDepartmentName = model.SubDepartmentName,
                            ZoneID = model.ZoneID,
                            ZoneName = model.ZoneName,
                            CreatedById = model.CreatedByID, 
                            isActive = true
                        };

                        await _context.ContactDetails.AddAsync(tempContactDetails);
                        await _context.SaveChangesAsync();

                        result = tempContactDetails;

                    }
                    else
                    {
                        tempContactDetails.FullName = model.FullName;
                        tempContactDetails.CellNo = model.CellNo;
                        tempContactDetails.Email = model.Email;
                        tempContactDetails.DateUpdated = DateTime.Now;
                        tempContactDetails.SubDepartmentID = model.SubDepartmentID;
                        tempContactDetails.SubDepartmentName = model.SubDepartmentName;
                        tempContactDetails.ZoneID = model.ZoneID;
                        tempContactDetails.ZoneName = model.ZoneName;
                        _context.Update(tempContactDetails);
                        await _context.SaveChangesAsync();
                        result = tempContactDetails;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ContactDetailID > 0 ? "Contact Details Updated Successfully" : "Contact Details Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteContactDetail")]
        public async Task<object> DeleteContactDetail([FromBody] int contactDetialID)
        {
            try
            {

                var tempContactDetails = _context.ContactDetails.FirstOrDefault(x => x.ContactDetailID == contactDetialID);

                if (tempContactDetails == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempContactDetails.DateUpdated = DateTime.Now;
                    tempContactDetails.isActive = false;
                    _context.Update(tempContactDetails);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Contact Detail Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




        [HttpGet("GetAllContactDetials")]
        public async Task<object> GetAllContactDetials()
        {
            try
            {
                var result = await (
               from contactDetials in _context.ContactDetails
               where contactDetials.isActive == true
               select new ContactDetailsDTO()
               {
                ContactDetailID = contactDetials.ContactDetailID,
                FullName = contactDetials.FullName,
                CellNo = contactDetials.CellNo,
                Email = contactDetials.Email,
                isActive = contactDetials.isActive,
                CreatedById = contactDetials.CreatedById,  
                DateCreated = contactDetials.DateCreated,
                DateUpdated = contactDetials.DateUpdated,
                SubDepartmentID = contactDetials.SubDepartmentID,
                SubDepartmentName = contactDetials.SubDepartmentName,
                ZoneID = contactDetials.ZoneID,
                ZoneName = contactDetials.ZoneName,

               }
               ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Contact Details", result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }

 
}
