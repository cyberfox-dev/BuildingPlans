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

                if (model.DocumentsCategory == null || model.DepartmentID == null)
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
                            DateUpdated = DateTime.Now,

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

        [HttpGet("GetAllDocumentCategories")]
        public async Task<object> GetAllDocumentCategories()
        {
            try
            {
                var result = await (
                from documentsRepository in _context.DocumentsRepository
                where documentsRepository.isActive == true
                select new DocumentRepositoryDTO()
                {
                    DocumentsRepositoryID = documentsRepository.DocumentsRepositoryID,
                    DocumentsCategory = documentsRepository.DocumentsCategory,
                    DepartmentID = documentsRepository.DepartmentID,
                    DateCreated = documentsRepository.DateCreated,
                    DateUpdated = documentsRepository.DateUpdated,
                    isActive = documentsRepository.isActive,

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
        [HttpPost("GetDocumentCategoryByDepartmentID")]
        public async Task<object> GetDocumentCategoryByDepartmentID([FromBody] int departmentID)
        {
            try
            {

                var result = await (from documentRepository in _context.DocumentsRepository
                                    where documentRepository.isActive == true && documentRepository.DepartmentID == departmentID
                                    select new DocumentsRepository()
                                    {
                                        DocumentsCategory = documentRepository.DocumentsCategory,
                                        DepartmentID = documentRepository.DepartmentID,
                                        DocumentsRepositoryID = documentRepository.DocumentsRepositoryID,
                                        DateCreated = documentRepository.DateCreated,
                                        DateUpdated = documentRepository.DateUpdated,
                                        isActive = documentRepository.isActive,
                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all document categories for department", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }
    }
}
