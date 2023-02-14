using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.IServices;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System;

namespace WayleaveManagementSystem.Service
{
    //public class MandatoryDocumentUploadsService : IMandatoryDocumentUploadsService
    //{
    //    private readonly AppDBContext _context;

    //    public MandatoryDocumentUploadsService(AppDBContext context)
    //    {
    //        _context = context;
    //    }

        public async Task<MandatoryDocumentUpload> AddUpdateMandatoryDocument(int? MandatoryDocumentID, string MandatoryDocumentName, int? StageID)
        {

            if (MandatoryDocumentID == 0)
            {
                MandatoryDocumentID = null;
            }
            //this checks is the record exists in the db
            var tempMandatoryDocumentTable = _context.MandatoryDocumentUpload.FirstOrDefault(x => x.MandatoryDocumentID == MandatoryDocumentID);

            //if the object is null assume that the user is tying to add a new Professional
            if (tempMandatoryDocumentTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempMandatoryDocumentTable = new MandatoryDocumentUpload()
                {
                    MandatoryDocumentName = mandatoryDocumentName,
                    StageID = stageID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    isActive = true
                };

                //After the inizlization add to the db
                await _context.MandatoryDocumentUpload.AddAsync(tempMandatoryDocumentTable);
                await _context.SaveChangesAsync();

    //            return tempMandatoryDocumentTable;

    //        }
    //        else //if it is not null then user is doing an update 
    //        {
    //            tempMandatoryDocumentTable.MandatoryDocumentName = mandatoryDocumentName;
    //            tempMandatoryDocumentTable.StageID = stageID;

    //            tempMandatoryDocumentTable.DateUpdated = DateTime.Now;
    //            tempMandatoryDocumentTable.isActive = true;

    //            _context.Update(tempMandatoryDocumentTable);
    //            await _context.SaveChangesAsync();
    //            return tempMandatoryDocumentTable;
    //        }



    //    }

        public async Task<bool> DeleteMandatoryDocument(int mandatoryDocumentID)
        {
            //this checks is the record exists in the db
            var tempMandatoryDocumentTable = _context.MandatoryDocumentUpload.FirstOrDefault(x => x.MandatoryDocumentID == mandatoryDocumentID);

    //        if (tempMandatoryDocumentTable == null)
    //        {
    //            return await Task.FromResult(false);
                
    //        }
    //        else
    //        {
    //            tempMandatoryDocumentTable.DateUpdated = DateTime.Now;
    //            tempMandatoryDocumentTable.isActive = false;
    //            _context.Update(tempMandatoryDocumentTable);
    //            await _context.SaveChangesAsync();
    //            return true;
    //        }


    //    }



        public async Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocumentsByStageID(int? stageID)
        {
            return await (
                from comment in _context.MandatoryDocumentUpload
                where comment.ApplicationID == stageID && comment.isActive == true
                select new CommentDTO()
                {
                    MandatoryDocumentName = mandatoryDocumentName,
                    StageID = stageID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    isActive = true

    //            }
    //            ).ToListAsync();
    //    }

        public async Task<List<MandatoryDocumentUploadDTO>> GetAllMandatoryDocuments()
        {
            var tempMandatoryDocumentUpload = await _context.MandatoryDocumentUpload.Where(x => x.isActive == true).ToListAsync();

            var mandatoryDocumentUploadDTO = new List<MandatoryDocumentUploadDTO>();

            foreach (var item in tempMandatoryDocumentUpload)
            {
                mandatoryDocumentUploadDTO.Add(new MandatoryDocumentUploadDTO()
                {
                    MandatoryDocumentName = mandatoryDocumentName,
                    StageID = stageID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = creadtedByID,
                    isActive = true
                });
            }

            return mandatoryDocumentUploadDTO;
        }

    //}
}
