using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.Models.DTO;
using WayleaveManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsRepositoryConfigController : ControllerBase
    {
        private readonly AppDBContext _context;

        public DocumentsRepositoryConfigController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateDocumentsCategory")]
        public async Task<object> AddUpdateDocumentsCategory([FromBody] DocumentRepositoryBindingModel model)
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
                    if (model.DocumentsRepositoryID == 0)
                    {
                        model.DocumentsRepositoryID = null;
                    }

                    var tempDocumentsRepository = _context.DocumentsRepository.FirstOrDefault(x => x.DocumentsRepositoryID == model.DocumentsRepositoryID);

                    if (tempDocumentsRepository == null)
                    {
                        tempDocumentsRepository = new DocumentsRepository()
                        {
                            DocumentsRepositoryID = model.DocumentsRepositoryID,
                            DocumentsCategory = model.DocumentsCategory,
                            DepartmentID = model.DepartmentID,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true
                        };
                        await _context.DocumentsRepository.AddAsync(tempDocumentsRepository);
                        await _context.SaveChangesAsync();

                        result = tempDocumentsRepository;
                    }
                    else
                    {
                        tempDocumentsRepository = new DocumentsRepository()
                        {
                            DocumentsCategory = model.DocumentsCategory,
                            DateUpdated = model.DateUpdated,

                        };
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DocumentsRepositoryID > 0 ? "Document Repository list Updated Successfully" : "Category added Successfully to Document Repository List"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllCategoriesByDepartmentID")]
        public async Task<object> GetAllCategoriesByDepartmentID([FromBody] DocumentRepositoryBindingModel model)
        {
            try
            {
                var result = await (
                from DocumentsRepository in _context.DocumentsRepository
                where DocumentsRepository.DepartmentID == model.DepartmentID
                select new DocumentsRepository()
                {
                    DocumentsRepositoryID = model.DepartmentID,
                    DocumentsCategory = model.DocumentsCategory,
                    DepartmentID = model.DepartmentID,
                    DateCreated = model.DateCreated,
                    DateUpdated = model.DateUpdated,
                    CreatedById = model.CreatedById,
                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Document Categories By Department ID", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteDocumentCategoryByID")]
        public async Task<object> DeleteDocumentCategoryByID([FromBody] int documentRepositoryID)
        {
            try
            {

                var tempDocCategory = _context.DocumentsRepository.FirstOrDefault(x => x.DocumentsRepositoryID == documentRepositoryID);

                if (tempDocCategory == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempDocCategory.DateUpdated = DateTime.Now;
                    tempDocCategory.isActive = false;
                    _context.Update(tempDocCategory);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Document Category Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
