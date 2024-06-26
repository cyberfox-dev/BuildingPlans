﻿using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class MandatoryDocumentUploadsService : IMandatoryDocumentUploadsService
    {
        private readonly AppDBContext _context;

        public MandatoryDocumentUploadsService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<MandatoryDocumentUpload> AddUpdateMandatoryDocument(int? mandatoryDocumentID, string mandatoryDocumentName, string? createdByID, string? mandatoryDocumentCategory)
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
                    MandatoryDocumentCategory = mandatoryDocumentCategory,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.MandatoryDocumentUploads.AddAsync(tempMandatoryDocumentTable);
                await _context.SaveChangesAsync();

                return tempMandatoryDocumentTable;

            }
            else //if it is not null then user is doing an update 
            {

                if (mandatoryDocumentName != null)
                {
                    tempMandatoryDocumentTable.MandatoryDocumentName = mandatoryDocumentName;
                }
                if (mandatoryDocumentCategory != null)
                {
                    tempMandatoryDocumentTable.MandatoryDocumentCategory = mandatoryDocumentCategory;
                }

                tempMandatoryDocumentTable.DateUpdated = DateTime.Now;


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
                    MandatoryDocumentCategory = MandatoryDocumentUpload.MandatoryDocumentCategory,
                    //This should be the date that was stored no?
                    /*DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,*/

                    DateCreated = MandatoryDocumentUpload.DateCreated,
                    DateUpdated = MandatoryDocumentUpload.DateUpdated,

                    CreatedById = MandatoryDocumentUpload.CreatedById,
                    isActive = true

                }
                ).ToListAsync();
        }

        public async Task<List<MandatoryDocumentUploadDTO>> GetAllByMandatoryDocumentCategory(string? mandatoryDocumentCategory)
        {
            return await (
                from MandatoryDocumentUpload in _context.MandatoryDocumentUploads
                where MandatoryDocumentUpload.MandatoryDocumentCategory == mandatoryDocumentCategory && MandatoryDocumentUpload.isActive == true
                select new MandatoryDocumentUploadDTO()
                {
                    MandatoryDocumentName = MandatoryDocumentUpload.MandatoryDocumentName,
                    /*DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,*/

                    DateCreated = MandatoryDocumentUpload.DateCreated,
                    DateUpdated = MandatoryDocumentUpload.DateUpdated,
                    MandatoryDocumentCategory = MandatoryDocumentUpload.MandatoryDocumentCategory,
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
                     MandatoryDocumentID = mandatoryDocumentUpload.MandatoryDocumentID,
                     MandatoryDocumentName = mandatoryDocumentUpload.MandatoryDocumentName,
                     /*DateCreated = DateTime.Now,
                     DateUpdated = DateTime.Now,*/

                     DateCreated = mandatoryDocumentUpload.DateCreated,
                     DateUpdated = mandatoryDocumentUpload.DateUpdated,
                     MandatoryDocumentCategory = mandatoryDocumentUpload.MandatoryDocumentCategory,
                     CreatedById = mandatoryDocumentUpload.CreatedById,
                     isActive = true


                 }
                 ).ToListAsync();
        }

        public async Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocumentsLinkedToStage(string? stageName)
        {
            var doc = await (
                from document in _context.MandatoryDocumentStageLink
                where document.StageName == stageName && document.isActive == true
                select document.MandatoryDocumentID).ToListAsync();

            var result = await (
                from manDoc in _context.MandatoryDocumentUploads
                where manDoc.isActive == true && doc.Contains(manDoc.MandatoryDocumentID)
                select new MandatoryDocumentUploadDTO()
                {
                    MandatoryDocumentID = manDoc.MandatoryDocumentID,
                    MandatoryDocumentName = manDoc.MandatoryDocumentName,
                    /*DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,*/

                    DateCreated = manDoc.DateCreated,
                    DateUpdated = manDoc.DateUpdated,
                    MandatoryDocumentCategory = manDoc.MandatoryDocumentCategory,
                    CreatedById = manDoc.CreatedById,
                    isActive = true
                }).ToListAsync();

            return result;
        }

    }
}