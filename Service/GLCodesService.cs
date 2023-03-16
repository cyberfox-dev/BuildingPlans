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
                    GLCodeName = GLCode.GLCodeName,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = GLCode.CreatedById,
                    ProfitCenter = GLCode.ProfitCenter,
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

        public async Task<bool> LinkDepartmentToGLCode(int glCodeID, int departmentID)
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
                _context.Update(tempGLCodeTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }

    }
}