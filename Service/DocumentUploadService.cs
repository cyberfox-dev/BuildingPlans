using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Data.Migrations;

namespace WayleaveManagementSystem.Service
{
    public class DocumentUploadService : IDocumentUploadService
    {

        private readonly AppDBContext _context;

        public DocumentUploadService(AppDBContext context)
        {
            _context = context;
        }
        //Implementing the interface Methods
        public async Task<DocumentUpload> AddUpdateDocument(int? documentID, string documentName, string? DocumentLocalPath, int? applicationID, string? assignedUserID, string createdById, string? groupName, int? subDepID, string? subDepName, bool? isPlanning, bool? isRepository, string? description)
        {

            if (documentID == 0)
            {
                documentID = null;
            }
            //this checks is the record exists in the db
            var tempDocumentUpload = _context.DocumentUpload.FirstOrDefault(x => x.DocumentID == documentID);

            //if the object is null assume that the user is tying to add a new Document
            if (tempDocumentUpload == null)
            {
                //create a new object of DocumentUpload entity class then initialize the object with given infomation
                tempDocumentUpload = new DocumentUpload()
                {
                    DocumentName = documentName,
                    DocumentLocalPath = DocumentLocalPath,
                    ApplicationID = applicationID,
                    AssignedUserID = assignedUserID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdById,
                    isActive = true,
                    DocumentGroupName = groupName,
                    SubDepartmentID = subDepID,
                    SubDepartmentName = subDepName,
                    isPlanning = isPlanning,
                    isRepository = isRepository,
                    DescriptionForRepoDoc = description,
                };

                //After the inizlization add to the db
                await _context.DocumentUpload.AddAsync(tempDocumentUpload);
                await _context.SaveChangesAsync();

                return tempDocumentUpload;

            }
            else //if it is not null then user is doing an update 
            {



                tempDocumentUpload.DocumentGroupName = groupName;
                tempDocumentUpload.SubDepartmentID = subDepID;
                tempDocumentUpload.SubDepartmentName = subDepName;
                tempDocumentUpload.DateUpdated = DateTime.Now;

                _context.Update(tempDocumentUpload);
                await _context.SaveChangesAsync();
                return tempDocumentUpload;
            }

        }


        public async Task<bool> DeleteDocument(int documentID)
        {
            var tempDocumentUpload = _context.DocumentUpload.FirstOrDefault(x => x.DocumentID == documentID);

            if (tempDocumentUpload == null)
            {
                return false;  // No need to wrap false in Task.FromResult, you can just return false directly in an async method.
            }
            else
            {
                var dbPath = tempDocumentUpload.DocumentLocalPath;

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), dbPath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }



                // Update the database record
                tempDocumentUpload.DateUpdated = DateTime.Now;
                tempDocumentUpload.isActive = false;
                _context.Remove(tempDocumentUpload);
                //_context.Update(tempDocumentUpload);
                await _context.SaveChangesAsync();

                return true;
            }


        }


        public async Task<List<DocumentUploadDTO>> GetAllDocuments()
        {
            var tempDocumentUpload = await _context.DocumentUpload.Where(x => x.isActive == true).ToListAsync();

            var documentUploadDTO = new List<DocumentUploadDTO>();

            foreach (var item in tempDocumentUpload)
            {
                documentUploadDTO.Add(new DocumentUploadDTO()
                {
                    DocumentID = item.DocumentID,
                    DocumentName = item.DocumentName,
                    DocumentLocalPath = item.DocumentLocalPath,
                    ApplicationID = item.ApplicationID,
                    AssignedUserID = item.AssignedUserID,
                    DateCreated = item.DateCreated,
                    DateUpdated = item.DateUpdated,
                    CreatedById = item.CreatedById,
                    isActive = item.isActive,
                    Description = item.DescriptionForRepoDoc
                });
            }

            return documentUploadDTO;
        }



        public async Task<List<DocumentUploadDTO>> GetAllDocumentsForApplication(int? applicationID)
        {


            return await (
              from documentUpload in _context.DocumentUpload
              where documentUpload.ApplicationID == applicationID && documentUpload.isActive == true
              select new DocumentUploadDTO()
              {
                  DocumentID = documentUpload.DocumentID,
                  DocumentName = documentUpload.DocumentName,
                  DocumentLocalPath = documentUpload.DocumentLocalPath,
                  ApplicationID = documentUpload.ApplicationID,
                  AssignedUserID = documentUpload.AssignedUserID,
                  DateCreated = documentUpload.DateCreated,
                  DateUpdated = documentUpload.DateUpdated,
                  CreatedById = documentUpload.CreatedById,
                  GroupName = documentUpload.DocumentGroupName,
                  isActive = documentUpload.isActive,
                  Description = documentUpload.DescriptionForRepoDoc

              }
              ).ToListAsync();

        }



        public async Task<List<DocumentUploadDTO>> GetAllDocumentsForApplicationForPlanning(int? applicationID)
        {


            return await (
              from documentUpload in _context.DocumentUpload
              where documentUpload.ApplicationID == applicationID && documentUpload.isActive == true && documentUpload.isPlanning == true
              select new DocumentUploadDTO()
              {
                  DocumentID = documentUpload.DocumentID,
                  DocumentName = documentUpload.DocumentName,
                  DocumentLocalPath = documentUpload.DocumentLocalPath,
                  ApplicationID = documentUpload.ApplicationID,
                  AssignedUserID = documentUpload.AssignedUserID,
                  DateCreated = documentUpload.DateCreated,
                  DateUpdated = documentUpload.DateUpdated,
                  CreatedById = documentUpload.CreatedById,
                  isActive = documentUpload.isActive,
                  SubDepartmentID = documentUpload.SubDepartmentID,
                  SubDepartmentName = documentUpload.SubDepartmentName,
                  Description = documentUpload.DescriptionForRepoDoc
              }
              ).ToListAsync();

        }

        public async Task<List<DocumentUploadDTO>> GetAllDocumentsForRepository()
        {


            return await (
              from documentUpload in _context.DocumentUpload
              where documentUpload.isRepository == true && documentUpload.isActive == true
              select new DocumentUploadDTO()
              {
                  DocumentID = documentUpload.DocumentID,
                  DocumentName = documentUpload.DocumentName,
                  DocumentLocalPath = documentUpload.DocumentLocalPath,
                  ApplicationID = documentUpload.ApplicationID,
                  AssignedUserID = documentUpload.AssignedUserID,
                  DateCreated = documentUpload.DateCreated,
                  DateUpdated = documentUpload.DateUpdated,
                  CreatedById = documentUpload.CreatedById,
                  isActive = documentUpload.isActive,
                  GroupName = documentUpload.DocumentGroupName,
                  SubDepartmentID = documentUpload.SubDepartmentID,
                  Description = documentUpload.DescriptionForRepoDoc
              }
              ).ToListAsync();

        }

        public async Task<List<DocumentUploadDTO>> GetAllDocumentsForUser(string assignedUserID)
        {
            var tempDocumentUpload = await _context.DocumentUpload.Where(x => x.isActive == true && x.AssignedUserID == assignedUserID).ToListAsync();

            var documentUploadDTO = new List<DocumentUploadDTO>();

            foreach (var item in tempDocumentUpload)
            {
                documentUploadDTO.Add(new DocumentUploadDTO()
                {
                    DocumentID = item.DocumentID,
                    DocumentName = item.DocumentName,
                    DocumentLocalPath = item.DocumentLocalPath,
                    ApplicationID = item.ApplicationID,
                    AssignedUserID = item.AssignedUserID,
                    DateCreated = item.DateCreated,
                    DateUpdated = item.DateUpdated,
                    CreatedById = item.CreatedById,
                    isActive = item.isActive,
                    Description = item.DescriptionForRepoDoc
                });
            }
            return documentUploadDTO;
        }

       
    }

}
