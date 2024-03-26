using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Service;
using BuildingPlans.Models.DTO;
using BuildingPlans.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPDocumentsCategoryTableController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPDocumentsCategoryTableController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateDocumentCategory")]
        public async Task<object> AddUpdateDocumentCategory([FromBody]BPDocumentCategoryTableBindingModel model)
        {
            try
            {
                var result = new object();

                if(model == null || model.CategoryName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }

                else
                {
                    if(model.CategoryId == 0)
                    {
                        model.CategoryId = null;
                    }

                    var tempCategoryTable = _context.BPDocumentCategoryTable.FirstOrDefault(x => x.CategoryId == model.CategoryId);

                    if(tempCategoryTable == null)
                    {
                        tempCategoryTable = new BPDocumentCategoryTable()
                        {
                            CategoryId = model.CategoryId,
                            CategoryName = model.CategoryName,
                            FunctionalArea = model.FunctionalArea,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true,
                        };
                        await _context.BPDocumentCategoryTable.AddRangeAsync(tempCategoryTable);
                        await _context.SaveChangesAsync();
                        result = tempCategoryTable;
                    }
                    else
                    {
                        if(model.CategoryName != null)
                        {
                            tempCategoryTable.CategoryName = model.CategoryName;
                        }

                        if(model.FunctionalArea != null)
                        {
                            tempCategoryTable.FunctionalArea = model.FunctionalArea;
                        }
                        tempCategoryTable.DateUpdated = DateTime.Now;
                        tempCategoryTable.isActive = true;

                        _context.Update(tempCategoryTable);
                        await _context.SaveChangesAsync();
                        result = tempCategoryTable;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.CategoryId > 0 ? "Document Category Updated Successfully" : "Document Category Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllDocumentCategories")]
        public async Task<object> GetAllDocumentCategories()
        {
            try
            {
                var result = await (from documentCategory in _context.BPDocumentCategoryTable
                                    where documentCategory.isActive == true
                                    select new BPDocumentCategoryTable()
                                    {
                                        CategoryId = documentCategory.CategoryId,
                                        CategoryName = documentCategory.CategoryName,
                                        FunctionalArea = documentCategory.FunctionalArea,
                                        DateCreated = documentCategory.DateCreated,
                                        DateUpdated = documentCategory.DateUpdated,
                                        CreatedById = documentCategory.CreatedById,
                                        isActive = true
                                        
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Document Categories", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteDocumentCategoryByCategoryId")]
        public async Task<object> DeleteDocumentCategoryByCategoryId([FromBody] int categoryId)
        {
            try
            {
                var tempCategoryTable = _context.BPDocumentCategoryTable.FirstOrDefault(x => x.CategoryId == categoryId);

                if (tempCategoryTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));
                }
                else
                {
                    tempCategoryTable.DateUpdated = DateTime.Now;
                    tempCategoryTable.isActive = false;
                    _context.Update(tempCategoryTable);
                    await _context.SaveChangesAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Document Category Deleted Successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetDocumentCategoryByFunctionArea")]
        public async Task<object> GetDocumentCategoryByFunctionalArea([FromBody] BPDocumentCategoryTableBindingModel model)
        {
            try
            {
                var result = await (from documentCategory in _context.BPDocumentCategoryTable
                                    where documentCategory.FunctionalArea == model.FunctionalArea && documentCategory.isActive == true
                                    select new BPDocumentCategoryTableDTO()
                                    {
                                        CategoryId = documentCategory.CategoryId,
                                        CategoryName = documentCategory.CategoryName,
                                        FunctionalArea = documentCategory.FunctionalArea,
                                        DateCreated = documentCategory.DateCreated,
                                        DateUpdated = documentCategory.DateUpdated,
                                        CreatedById = documentCategory.CreatedById,
                                        isActive = true

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Document Categories by functional area", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPost("GetDocumentCategoryByCategoryID")]
        public async Task<object> GetDocumentCategoryByCategoryID([FromBody] int categoryId) 
        {
            try
            {
                var result = await (from documentCategory in _context.BPDocumentCategoryTable
                                    where documentCategory.CategoryId == categoryId && documentCategory.isActive == true
                                    select new BPDocumentCategoryTableDTO()
                                    {
                                        CategoryId = documentCategory.CategoryId,
                                        CategoryName = documentCategory.CategoryName,
                                        FunctionalArea = documentCategory.FunctionalArea,
                                        DateCreated = documentCategory.DateCreated,
                                        DateUpdated = documentCategory.DateUpdated,
                                        CreatedById = documentCategory.CreatedById,
                                        isActive = true
                                    }
                                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Document Category by category ID ", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
