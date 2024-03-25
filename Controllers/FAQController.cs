using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FAQController : Controller
    {

        private readonly AppDBContext _context;

        public FAQController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdateFAQ")]
        public async Task<object> AddUpdateFAQ([FromBody] FAQBindingModel model)
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
                    if (model.FAQID == 0)
                    {
                        model.FAQID = 0;
                    }

                    var tempFAQ = _context.FAQ.FirstOrDefault(x => x.FAQID == model.FAQID);


                    if (tempFAQ == null)
                    {
                        tempFAQ = new FAQ()
                        {
                            FAQID = model.FAQID,
                            Question = model.Question,
                            Answer = model.Answer,
                            CreatedById = model.CreatedByID,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };

                        await _context.FAQ.AddAsync(tempFAQ);
                        await _context.SaveChangesAsync();

                        result = tempFAQ;

                    }
                    else
                    {
                        tempFAQ.Question = model.Question;
                        tempFAQ.Answer = model.Answer;
                        tempFAQ.DateUpdated = DateTime.Now;

                        _context.Update(tempFAQ);
                        await _context.SaveChangesAsync();
                        result = tempFAQ;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.FAQID > 0 ? "FAQ Updated Successfully" : "FAQ Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteFAQ")]
        public async Task<object> DeleteFAQ([FromBody] int faqID)
        {
            try
            {

                var tempFAQ = _context.FAQ.FirstOrDefault(x => x.FAQID == faqID);

                if (tempFAQ == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempFAQ.DateUpdated = DateTime.Now;
                    tempFAQ.isActive = false;
                    _context.Update(tempFAQ);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "FAQ Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




        [HttpGet("GetAllFAQ")]
        public async Task<object> GetAllFAQ()
        {
            try
            {
                var result = await (
               from faq in _context.FAQ
               where faq.isActive == true
               select new FAQDTO()
               {
                   FAQID = faq.FAQID,
                   Question = faq.Question,
                   Answer = faq.Answer,
                   isActive = faq.isActive,
                   CreatedById = faq.CreatedById,
                   DateCreated = faq.DateCreated,
                   DateUpdated = faq.DateUpdated,

               }
               ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All FAQ's", result));

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }


}
