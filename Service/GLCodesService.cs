﻿using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class GLCodeService : IGLCodeService
    {
        private readonly AppDBContext _context;

        public GLCodeService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<GLCode> AddUpdateGLCode(int? glCodeID, string glCodeName, string? createdByID, string? profitCenter)
        {

            if (glCodeID == 0)
            {
                glCodeID = null;
            }

            var tempGLCodeTable = _context.GLCode.FirstOrDefault(x => x.GLCodeID == glCodeID);


            if (tempGLCodeTable == null)
            {

                tempGLCodeTable = new GLCode()
                {
                    GLCodeName = glCodeName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdByID,
                    ProfitCenter = profitCenter,
                    isActive = true
                };


                await _context.GLCode.AddAsync(tempGLCodeTable);
                await _context.SaveChangesAsync();

                return tempGLCodeTable;

            }
            else
            {
                tempGLCodeTable.GLCodeName = glCodeName;
                tempGLCodeTable.ProfitCenter = profitCenter;

                tempGLCodeTable.DateUpdated = DateTime.Now;
                tempGLCodeTable.isActive = true;

                _context.Update(tempGLCodeTable);
                await _context.SaveChangesAsync();
                return tempGLCodeTable;
            }



        }

        public async Task<bool> DeleteGLCode(int glCodeID)
        {

            var tempGLCodeTable = _context.GLCode.FirstOrDefault(x => x.GLCodeID == glCodeID);

            if (tempGLCodeTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempGLCodeTable.DateUpdated = DateTime.Now;
                tempGLCodeTable.isActive = false;
                _context.Update(tempGLCodeTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }



        public async Task<List<GLCodeDTO>> GetGLCodeByID(int? glCodeID)
        {
            return await (
                from GLCode in _context.GLCode
                where GLCode.GLCodeID == glCodeID && GLCode.isActive == true
                select new GLCodeDTO()
                {
                    GLCodeID = GLCode.GLCodeID,
                    GLCodeName = GLCode.GLCodeName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = GLCode.CreatedById,
                    ProfitCenter = GLCode.ProfitCenter,
                    DepartmentID = GLCode.DepartmentID,
                    DepartmentName = GLCode.DepartmentName,
                    isActive = true
                }
                ).ToListAsync();
        }

        public async Task<List<GLCodeDTO>> GetAllGLCodes()
        {

            return await (
                 from GLCode in _context.GLCode
                 where GLCode.isActive == true
                 select new GLCodeDTO()
                 {
                     GLCodeID = GLCode.GLCodeID,
                     GLCodeName = GLCode.GLCodeName,
                     DateCreated = DateTime.Now,
                     DateUpdated = DateTime.Now,
                     ProfitCenter = GLCode.ProfitCenter,
                     CreatedById = GLCode.CreatedById,
                     isActive = true
                 }
                 ).ToListAsync();
        }

        public async Task<bool> SetLinkDepartmentToGLCode(int? glCodeID, int? departmentID, string? departmentName)
        {

            var tempGLCodeTable = _context.GLCode.FirstOrDefault(x => x.GLCodeID == glCodeID);

            if (tempGLCodeTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempGLCodeTable.DateUpdated = DateTime.Now;
                tempGLCodeTable.DepartmentID = departmentID;
                tempGLCodeTable.DepartmentName = departmentName;
                _context.Update(tempGLCodeTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }

    }
}