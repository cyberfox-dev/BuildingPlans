using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models.DTO;

using System.Linq;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Models.BindingModel;
using System;

namespace WayleaveManagementSystem.Service
{
    public class SubDepartmentsService : ISubDepartmentService
    {
        private readonly AppDBContext _context;

        public SubDepartmentsService(AppDBContext context)
        {
            _context = context;
        }  

        public async Task<SubDepartments> AddUpdateSubDepartments(int? subDepartmentID, string? subDepartmentName, int? DepartmentID, string? createdByID) 
        {
            if(subDepartmentID == 0) 
            { 
                subDepartmentID = null; 
            }

            var tempSubDepartmentsTable = _context.SubDepartmentsTable.FirstOrDefault(x => x.SubDepartmentID == subDepartmentID);

            if(tempSubDepartmentsTable == null) 
            {
                tempSubDepartmentsTable = new SubDepartments()
                {
                    SubDepartmentName = subDepartmentName,
                    DepartmentID = DepartmentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    CreatedById = createdByID,
                    isActive = true

                };

                await _context.SubDepartmentsTable.AddAsync(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();

                return tempSubDepartmentsTable;

            }
            else
            {
                tempSubDepartmentsTable.SubDepartmentName = subDepartmentName;
                tempSubDepartmentsTable.DepartmentID = DepartmentID;
                tempSubDepartmentsTable.DateUpdated = DateTime.Now;
                tempSubDepartmentsTable.isActive = true;

                _context.Update(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();
                return tempSubDepartmentsTable;

            }

        }


        public async Task<SubDepartments> AddSubDepartmentAdmin(int? subDepartmentID, string? departmentAdminUserID)
        {
 

            var tempSubDepartmentsTable = _context.SubDepartmentsTable.FirstOrDefault(x => x.SubDepartmentID == subDepartmentID);

          
      
                tempSubDepartmentsTable.SubDepartmentAdminUserID = departmentAdminUserID;
                tempSubDepartmentsTable.DateUpdated = DateTime.Now;

                _context.Update(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();
                return tempSubDepartmentsTable;

            

        }


        public async Task<bool> DeleteSubDepartments(int subDepartmentID)
        {
            var tempSubDepartmentsTable = _context.SubDepartmentsTable.FirstOrDefault(x => x.SubDepartmentID == subDepartmentID);

            if (tempSubDepartmentsTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempSubDepartmentsTable.DateUpdated = DateTime.Now;
                tempSubDepartmentsTable.isActive = false;
                _context.Update(tempSubDepartmentsTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<SubDepartmentsDTO>> GetAllSubDepartments()
        {
            return await (
                from SubDepartments in _context.SubDepartmentsTable 
                where SubDepartments.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = SubDepartments.SubDepartmentID,
                    SubDepartmentName = SubDepartments.SubDepartmentName,
                    DepartmentID = SubDepartments.DepartmentID,
                    MapLayerID = SubDepartments.MapLayerID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true


                }
                ).ToListAsync();
        }



        public async Task<List<SubDepartmentsDTO>> GetAllNotLinkedSubDepartmentsForComment(int applicationID)
        {
            var subDepartmentIDs = await (
                 from subDepartmentForComment in _context.SubDepartmentForComment
                 where subDepartmentForComment.ApplicationID == applicationID
                 select subDepartmentForComment.SubDepartmentID
             ).ToListAsync();

            return await (
                from subDepartment in _context.SubDepartmentsTable
                where subDepartment.isActive == true && subDepartment.SubDepartmentName != "EMB" && !subDepartmentIDs.Contains(subDepartment.SubDepartmentID)
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = subDepartment.SubDepartmentID,
                    SubDepartmentName = subDepartment.SubDepartmentName,
                    DepartmentID = subDepartment.DepartmentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                }
            ).ToListAsync();
        }

        public async Task<List<SubDepartmentsDTO>> GetAllLinkedSubDepartmentsForComment(int applicationID)
        {
            return await (
                from subDepartment in _context.SubDepartmentsTable
                join subDepartmentForComment in _context.SubDepartmentForComment
                    on subDepartment.SubDepartmentID equals subDepartmentForComment.SubDepartmentID
                where subDepartment.isActive == true && subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = subDepartment.SubDepartmentID,
                    SubDepartmentName = subDepartment.SubDepartmentName,
                    DepartmentID = subDepartment.DepartmentID,
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                }
            ).ToListAsync();
        }


        public async Task<List<SubDepartmentsDTO>> wGetAllSubDepartmentsBydepartmentID(int subDepartmentID)
        {
            return await (
                from subDepartmentForComment in _context.SubDepartmentForComment
                where subDepartmentID == subDepartmentForComment.SubDepartmentID && subDepartmentForComment.FinalApproval == true
                select new SubDepartmentsDTO()
                {
                  
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true
                }
            ).ToListAsync();
        }


        public async Task<List<SubDepartmentsDTO>> GetAllSubDepartmentsBydepartmentID(int departmentID)
        {
            return await(
                from SubDepartments in _context.SubDepartmentsTable
                where departmentID == SubDepartments.DepartmentID && SubDepartments.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = SubDepartments.SubDepartmentID,
                    SubDepartmentName = SubDepartments.SubDepartmentName,
                 
                    DepartmentID = SubDepartments.DepartmentID,
                    DateCreated = SubDepartments.DateCreated,
                    DateUpdated = SubDepartments.DateUpdated,
                    isActive = true


                }
                ).ToListAsync();
        }

        public async Task<List<SubDepartmentsDTO>> GetSubDepartmentBySubDepartmentID(int? subDepID)
        {
            return await (
                from SubDepartments in _context.SubDepartmentsTable
                where subDepID == SubDepartments.SubDepartmentID && SubDepartments.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = SubDepartments.SubDepartmentID,
                    SubDepartmentName = SubDepartments.SubDepartmentName,
                    DepartmentID = SubDepartments.DepartmentID,
                    DateCreated = SubDepartments.DateCreated,
                    DateUpdated = SubDepartments.DateUpdated,
                    isActive = true
                }
                ).ToListAsync();
        }



        public async Task<List<SubDepartmentsDTO>> GetAllSubDepartmentsForAutoDistribution()
        {
            return await (
                from SubDepartments in _context.SubDepartmentsTable
                where SubDepartments.isSetForAutomaticDistribution == true && SubDepartments.isActive == true
                select new SubDepartmentsDTO()
                {
                    SubDepartmentID = SubDepartments.SubDepartmentID,
                    SubDepartmentName = SubDepartments.SubDepartmentName,

                    DepartmentID = SubDepartments.DepartmentID,
                    DateCreated = SubDepartments.DateCreated,
                    DateUpdated = SubDepartments.DateUpdated,
                    isActive = true


                }
                ).ToListAsync();
        }
    }
}
