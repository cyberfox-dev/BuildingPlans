using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using System.Security.Policy;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using System.Net.Http.Headers;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentUploadController : ControllerBase
    {
        private readonly string ApplicationDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
         private static List<DocumentUpload> fileForDb = new List<DocumentUpload>();

        private readonly AppDBContext _context;

        private readonly IDocumentUploadService _documentUploadService;

        public DocumentUploadController(IDocumentUploadService documentUploadService, AppDBContext context)
        {
            _documentUploadService = documentUploadService;
            _context = context;
        }

        [HttpPost("UploadDocument"),DisableRequestSizeLimit]
        public async Task<object> UploadDocument()
        {
            try
            {

                
                var file = Request.Form.Files[0];
         
                var folderName = Path.Combine("Resources", "DocumentUpload");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave,fileName);
                    var dbPath = Path.Combine(folderName,fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    // var result = await _documentUploadService.AddUpdateDocument(model.DocumentID, model.ApplicationID, model.DocumentName, model.DocumentType, model.DocumentPath, model.CreatedById, model.CreatedDate, model.ModifiedById, model.ModifiedDate);
                    return  Ok(new { dbPath });
                }
                else{
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }



                //if (model == null || model.DocumentName.Length < 1)
                //{
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                //}
                //else
                //{
                //    var result = await _documentUploadService.AddUpdateDocument(model.DocumentID, model.DocumentName, model.DocumentData, model.ApplicationID, model.AssignedUserID, model.CreatedById);
                //    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DocumentID > 0 ? "Professional Updated Successfully" : "Professional Added Successfully"), result));
                //}

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpPost("AddUpdateDocument"), DisableRequestSizeLimit]
        public async Task<object> AddUpdateDocument([FromBody] DocumentUploadBindingModel model)
        {
            try
            {


                if (model == null || model.DocumentName.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _documentUploadService.AddUpdateDocument(model.DocumentID, model.DocumentName, model.DocumentLocalPath, model.ApplicationID, model.AssignedUserID, model.CreatedById);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.DocumentID > 0 ? "Professional Updated Successfully" : "Professional Added Successfully"), result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeleteDocument")]
        public async Task<object> DeleteDocument([FromBody] int documentID)
        {
            try
            {

                if (documentID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _documentUploadService.DeleteDocument(documentID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professional Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllDocuments")]
        public async Task<object> GetAllDocuments()
        {
            try
            {

                    var result = await _documentUploadService.GetAllDocuments();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professionals List Created", result));


            }
            catch (Exception ex)
            {
                

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }



        [HttpPost("GetAllDocumentsForApplication")]
        public async Task<object> GetAllDocumentsForApplication([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _documentUploadService.GetAllDocumentsForApplication(applicationID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Department For Comment Deleted Successfully", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetAllDocumentsForUser")]
        public async Task<object> GetAllDocumentsForUser([FromBody] DocumentUploadBindingModel model)
        {
            try
            {

                if (model.AssignedUserID.Length < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _documentUploadService.GetAllDocumentsForUser(model.AssignedUserID);
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Professionals List Created", result));
                }

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


    }
}
