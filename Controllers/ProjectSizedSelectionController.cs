﻿using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;



namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectSizedSelectionController : ControllerBase
    {

        private readonly AppDBContext _context;


        public ProjectSizedSelectionController(AppDBContext context)
        {
            _context = context;

        }
        [HttpPost("AddUpdateProjectSizedSelection")]
        public async Task<object> AddUpdateProjectSizedSelection([FromBody] ProjectSizedSelectionsBindingModel model)
        {
            try
            {

                var result = new object();

                if (model == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.SelectionID == 0)
                    {
                        model.SelectionID = null;
                    }

                    var tempProjectSizedSelection = _context.ProjectSizedSelections.FirstOrDefault(x => x.SelectionID == model.SelectionID);

                    if (tempProjectSizedSelection == null)
                    {
                        tempProjectSizedSelection = new ProjectSizedSelections()
                        {
                            SelectionID = model.SelectionID,
                            ApplicationID = model.ApplicationID,
                            SelectedProject = model.SelectedProject,
                            ProjectDescription = model.ProjectDescription,
                            UserFullName = model.UserFullName,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                        };
                        await _context.ProjectSizedSelections.AddAsync(tempProjectSizedSelection);
                        await _context.SaveChangesAsync();

                        result = tempProjectSizedSelection;
                    }
                    else
                    {
                        tempProjectSizedSelection = new ProjectSizedSelections()
                        {
                            SelectedProject = model.SelectedProject,
                            ProjectDescription = model.ProjectDescription,
                            DateUpdated = DateTime.Now,
                        };
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.SelectionID > 0 ? "Project Size Selection Updated Successfully" : "Project Size Selection Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }


        [HttpPost("GetProjectSizedSelectionForApplication")]
        public async Task<object> GetProjectSizedSelectionForApplication([FromBody] ProjectSizedSelectionDTO model)
        {
            try
            {

                var result = await (
                   from ProjectSizedSelections in _context.ProjectSizedSelections
                   where ProjectSizedSelections.isActive == true && ProjectSizedSelections.ApplicationID == model.ApplicationID
                   select new ProjectSizedSelectionDTO()
                   {
                       ApplicationID = ProjectSizedSelections.ApplicationID,
                       SelectedProject = ProjectSizedSelections.SelectedProject,
                       ProjectDescription = ProjectSizedSelections.ProjectDescription,

                   }
               ).ToListAsync();


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got selected project selections", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }



    }
}
