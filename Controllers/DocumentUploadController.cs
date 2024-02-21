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
using System;
using System.IO;
using System.Diagnostics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System.Diagnostics;



namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentUploadController : ControllerBase
    {
        private readonly string ApplicationDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
         private static List<DocumentUpload> fileForDb = new List<DocumentUpload>();

        private readonly AppDBContext _context;
        private readonly ILogger<DocumentUploadController> _logger;

        private readonly IDocumentUploadService _documentUploadService;

        public DocumentUploadController(IDocumentUploadService documentUploadService, AppDBContext context, ILogger<DocumentUploadController> logger)
        {

            _documentUploadService = documentUploadService;
            _context = context;
            _logger = logger;
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
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    var contentType = file.ContentType.ToLower();

                    if (contentType.StartsWith("image/"))
                    {
                        CompressImage(file, fullPath);  // Assuming you have this method for images
                    }
                    else if (contentType == "application/pdf")
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }

                        // Create a temp path for compressed file
                        var compressedPath = Path.Combine(pathToSave, "compressed_" + fileName);
                        CompressPdfWithGhostscript(fullPath, compressedPath);

                        // Log original and compressed file sizes
                        var sizeBefore = new FileInfo(fullPath).Length;
                        var sizeAfter = new FileInfo(compressedPath).Length;

                        _logger.LogInformation($"PDF size before: {sizeBefore} bytes, after: {sizeAfter} bytes.");

                        // Overwrite the original file with compressed one and delete the compressed temp file
                        System.IO.File.Delete(fullPath);
                        System.IO.File.Move(compressedPath, fullPath);
                    }
                    else
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }






        private void CompressImage(Microsoft.AspNetCore.Http.IFormFile file, string outputPath)
        {
            using var image = Image.Load(file.OpenReadStream());
            var resizeOptions = new ResizeOptions
            {
                Size = new SixLabors.ImageSharp.Size(1000, 1000),
                Mode = ResizeMode.Max
            };
            image.Mutate(x => x.Resize(resizeOptions));
            var encoder = new JpegEncoder { Quality = 20 };  // Adjust the quality as required
            image.Save(outputPath, encoder);
        }

        public void CompressPdfWithGhostscript(string inputPath, string outputPath)
        {
            var quality = "-dPDFSETTINGS=/ebook";  // You can switch this to /screen for more compression, but the quality will be lower.

            var startInfo = new ProcessStartInfo
            {
                FileName = @"C:\Program Files\gs\gs10.01.2\bin\gswin64c.exe", // Ensure this path points to your Ghostscript installation
                Arguments = $"-sDEVICE=pdfwrite -dCompatibilityLevel=1.4 {quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=\"{outputPath}\" \"{inputPath}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = Process.Start(startInfo))
            {
                string standardOutput = process.StandardOutput.ReadToEnd();
                string standardError = process.StandardError.ReadToEnd();

                process.WaitForExit();

                if (process.ExitCode != 0)
                {
                    _logger.LogError($"Ghostscript standard output: {standardOutput}");
                    _logger.LogError($"Ghostscript error output: {standardError}");
                    throw new Exception($"Ghostscript process returned with exit code {process.ExitCode}.");
                }
            }
        }


        public void CompressPdf(string filePath)
    {
        // Open an existing document. Providing an unencrypted PDF file as input.
        PdfDocument inputDocument = PdfReader.Open(filePath, PdfDocumentOpenMode.Import);

        // Create new PDF document
        PdfDocument outputDocument = new PdfDocument();

        // Iterate pages of the input document
        foreach (PdfPage page in inputDocument.Pages)
        {
            // Add a page to the output document
            outputDocument.AddPage(page);
        }

        // Save the document back to the same path, effectively overwriting the original
        outputDocument.Save(filePath);
    }


    //public async Task<object> UploadDocument()
    //{
    //    try
    //    {


    //        var file = Request.Form.Files[0];

    //        var folderName = Path.Combine("Resources", "DocumentUpload");
    //        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

    //        if (file.Length > 0)
    //        {
    //            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
    //            var fullPath = Path.Combine(pathToSave,fileName);
    //            var dbPath = Path.Combine(folderName,fileName);

    //            using (var stream = new FileStream(fullPath, FileMode.Create))
    //            {
    //                file.CopyTo(stream);
    //            }

    //            return  Ok(new { dbPath });
    //        }
    //        else{
    //            return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
    //        }





    //    }
    //    catch (Exception ex)
    //    {


    //        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

    //    }
    //}


    [HttpPost("AddUpdateDocument"), DisableRequestSizeLimit]
        public async Task<object> AddUpdateDocument([FromBody] DocumentUploadBindingModel model)
        {
            try
            {


                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _documentUploadService.AddUpdateDocument(model.DocumentID, model.DocumentName, model.DocumentLocalPath, model.ApplicationID, model.AssignedUserID, model.CreatedById,model.DocumentGroupName,model.SubDepartmentID, model.SubDepartmentName,model.isPlanning,model.isRepository,model.Description);
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

        [HttpPost("GetAllDocumentsForApplicationForPlanning")]
        public async Task<object> GetAllDocumentsForApplicationForPlanning([FromBody] int applicationID)
        {
            try
            {

                if (applicationID < 1)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await _documentUploadService.GetAllDocumentsForApplicationForPlanning(applicationID);
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

        [HttpGet("GetAllDocumentsForRepository")]
        public async Task<object> GetAllDocumentsForRepository()
        {
            try
            {
               
                    var result = await _documentUploadService.GetAllDocumentsForRepository();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Repository Documents", result));
               

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }


        [HttpGet("GetDocument")]
        public IActionResult GetDocument(string filename)
        {
            var filePath = Path.Combine("Resources", "DocumentUpload", filename);

            if (System.IO.File.Exists(filePath))
            {
                var fileContent = System.IO.File.ReadAllBytes(filePath);

                string contentType;
                var fileExtension = Path.GetExtension(filename)?.ToLowerInvariant();
                switch (fileExtension)
                {
                    case ".pdf":
                        contentType = "application/pdf";
                        break;
                    case ".jpg":
                    case ".jpeg":
                        contentType = "image/jpeg";
                        break;
                    case ".png":
                        contentType = "image/png";
                        break;
                    case ".xlsx":
                        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        break;
                    case ".doc":
                        contentType = "application/msword";
                        break;
                    case ".docx":
                        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        break;
                    default:
                        contentType = "application/octet-stream";
                        break;
                }

                return File(fileContent, contentType, filename);
            }
            else
            {
                return NotFound();
            }
        }

     
    }
}
