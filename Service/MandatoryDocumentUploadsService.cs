using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Service
{
    public class MandatoryDocumentUploadsService : IMandatoryDocumentUploadsService
    {
        private readonly AppDBContext _context;

        public MandatoryDocumentUploadsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<MandatoryDocumentUpload> AddUpdateMandatoryDocument(int? mandatoryDocumentID, string mandatoryDocumentName, string? createdByID)
        {

            if (mandatoryDocumentID == 0)
            {
                mandatoryDocumentID = null;
            }
            //this checks is the record exists in the db
            var tempMandatoryDocumentTable = _context.MandatoryDocumentUploads.FirstOrDefault(x => x.MandatoryDocumentID == mandatoryDocumentID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempMandatoryDocumentTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempMandatoryDocumentTable = new MandatoryDocumentUpload()
                {
                    MandatoryDocumentName = mandatoryDocumentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdByID,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.MandatoryDocumentUploads.AddAsync(tempMandatoryDocumentTable);
                await _context.SaveChangesAsync();

                return tempMandatoryDocumentTable;

            }
            else //if it is not null then user is doing an update 
            {
                tempMandatoryDocumentTable.MandatoryDocumentName = mandatoryDocumentName;


                tempMandatoryDocumentTable.DateUpdated = DateTime.Now;
                tempMandatoryDocumentTable.isActive = true;

                _context.Update(tempMandatoryDocumentTable);
                await _context.SaveChangesAsync();
                return tempMandatoryDocumentTable;
            }



        }

        public async Task<bool> DeleteMandatoryDocument(int mandatoryDocumentID)
        {
            //this checks is the record exists in the db
            var tempMandatoryDocumentTable = _context.MandatoryDocumentUploads.FirstOrDefault(x => x.MandatoryDocumentID == mandatoryDocumentID);

            if (tempMandatoryDocumentTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempMandatoryDocumentTable.DateUpdated = DateTime.Now;
                tempMandatoryDocumentTable.isActive = false;
                _context.Update(tempMandatoryDocumentTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }



        public async Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocumentsByID(int? mandatoryDocumentID)
        {
            return await (
                from MandatoryDocumentUpload in _context.MandatoryDocumentUploads
                where MandatoryDocumentUpload.MandatoryDocumentID == mandatoryDocumentID && MandatoryDocumentUpload.isActive == true
                select new MandatoryDocumentUploadDTO()
                {
                    MandatoryDocumentName = MandatoryDocumentUpload.MandatoryDocumentName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = MandatoryDocumentUpload.CreatedById,
                    isActive = true

                }
                ).ToListAsync();
        }

        public async Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocuments()
        {

            return await (
                 from mandatoryDocumentUpload in _context.MandatoryDocumentUploads
                 where mandatoryDocumentUpload.isActive == true
                 select new MandatoryDocumentUploadDTO()
                 {
                     MandatoryDocumentName = mandatoryDocumentUpload.MandatoryDocumentName,
                     DateCreated = DateTime.Now,
                     DateUpdated = DateTime.Now,
                     CreatedById = mandatoryDocumentUpload.CreatedById,
                     isActive = true


                 }
                 ).ToListAsync();
        }

    }
}