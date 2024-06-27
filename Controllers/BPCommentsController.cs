using BuildingPlans.Data;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPCommentsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPCommentsController(AppDBContext context)
        {
            _context = context;
        }

        //[HttpPost("AddUpdateComment")]
        //public async Task<object> AddUpdateComment([FromBody] CommentBindingModel model)
        //{
        //    try
        //    {
        //        var result = new object();

        //        if (model.FunctionalArea == null || model.Comment == null)
        //        {
        //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are miss", null));
        //        }
        //        else
        //        {
        //            var tempComment = _context.BPComments.FirstOrDefault(x => x.CommentID == model.CommentID);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
        //    }
        //}
    }
}
