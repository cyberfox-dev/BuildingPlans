using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;

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
        public async Task<DocumentUpload> AddUpdateDocument(int? documentID, string documentName, string? DocumentLocalPath, int? applicationID, string? assignedUserID, string createdById,string? groupName, int?subDepID)
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
                };

                //After the inizlization add to the db
                await _context.DocumentUpload.AddAsync(tempDocumentUpload);
                await _context.SaveChangesAsync();

                return tempDocumentUpload;

            }
            else //if it is not null then user is doing an update 
            {


                tempDocumentUpload.DocumentName = documentName;
             //   tempDocumentUpload.DocumentData = documentData;
                tempDocumentUpload.DateUpdated = DateTime.Now;

                _context.Update(tempDocumentUpload);
                await _context.SaveChangesAsync();
                return tempDocumentUpload;
            }

        }


        public async Task<bool> DeleteDocument(int documentID)
        {
            //this checks is the record exists in the db
            var tempDocumentUpload = _context.DocumentUpload.FirstOrDefault(x => x.DocumentID == documentID);

            if (tempDocumentUpload == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempDocumentUpload.DateUpdated = DateTime.Now;
                tempDocumentUpload.isActive = false;
                _context.Update(tempDocumentUpload);
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
                    isActive = item.isActive
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
                  isActive = documentUpload.isActive


              }
              ).ToListAsync();

        }

        public async Task<List<DocumentUploadDTO>> GetAllDocumentsForRepository()
        {


            return await (
              from documentUpload in _context.DocumentUpload
              where documentUpload.ApplicationID == null && documentUpload.isActive == true
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
                    isActive = item.isActive
                });
            }
            return documentUploadDTO;
        }
    }

    }
