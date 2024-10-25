using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BuildingPlans.IServices;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models;
using BuildingPlans.Service;
using BuildingPlans.Models.DTO;
using BuildingPlans.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BuildingPlans.BindingModel;
using BuildingPlans.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BuildingPlans.Data;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Runtime.CompilerServices;

namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPTasksController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPTasksController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateTask")]
        public async Task<object> AddUpdateTask([FromBody] TasksBindingModel model)
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
                    if (model.TaskID == 0)
                    {
                        model.TaskID = null;
                    }
                    var tempTaskTable = _context.BPTasks.FirstOrDefault(x => x.TaskID == model.TaskID);

                    if (tempTaskTable == null)
                    {
                        tempTaskTable = new BPTasks()
                        {
                            TaskName = model.TaskName,
                            ApplicationID = model.ApplicationID,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            FunctionalArea = model.FunctionalArea,
                            TaskCreatedFor = model.TaskCreatedFor,
                            isActive = true
                        };
                        await _context.BPTasks.AddAsync(tempTaskTable);
                        await _context.SaveChangesAsync();
                        result = tempTaskTable;
                    }
                    else
                    {
                        if (model.TaskName != null)
                        {
                            tempTaskTable.TaskName = model.TaskName;
                        }

                        if (model.TaskCreatedFor != null)
                        {
                            tempTaskTable.TaskCreatedFor = model.TaskCreatedFor;
                        }

                        tempTaskTable.DateUpdated = DateTime.Now;
                        tempTaskTable.isActive = true;

                        _context.Update(tempTaskTable);
                        await _context.SaveChangesAsync();

                        result = tempTaskTable;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.TaskID > 0 ? " Task Updated Successfully" : "Task Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpGet("GetAllTasks")]
        public async Task<object> GetAllTasks()
        {
            try
            {
                var result = await (from task in _context.BPTasks
                                    where task.isActive == true
                                    select new TasksDTO()
                                    {
                                        TaskID = task.TaskID,
                                        TaskName= task.TaskName,
                                        ApplicationID = task.ApplicationID,
                                        CheckedBy = task.CheckedBy,
                                        isChecked = task.isChecked,
                                        TaskCreatedFor = task.TaskCreatedFor,
                                        DateCreated = task.DateCreated,
                                        DateUpdated = task.DateUpdated,
                                        isActive = task.isActive,
                                    }
                                    ).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Tasks", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteTask")]
        public async Task<object> DeleteTask([FromBody] int taskID)
        {
            try
            {
                var tempTaskTable = await _context.BPTasks.FindAsync(taskID);

                if (tempTaskTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Task does not exist on database", false));
                }
                else
                {
                    tempTaskTable.isActive = false;
                    tempTaskTable.DateUpdated = DateTime.Now;
                    _context.Update(tempTaskTable);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Task Deleted successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        } 
        
        
        
        [HttpPost("TaskCompleted")]
        public async Task<object> TaskCompleted([FromBody] TasksBindingModel model)
        {
            try
            {
                var tempTaskTable = await _context.BPTasks.FindAsync(model.TaskID);

                if (tempTaskTable == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Task does not exist on database", false));
                }
                else
                {
                    tempTaskTable.isChecked = true;
                    tempTaskTable.CheckedBy = model.CheckedBy;
                    tempTaskTable.DateUpdated = DateTime.Now;
                    _context.Update(tempTaskTable);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Task Updated successfully", true));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetTasksForApplication")]
        public async Task<object> GetTasksForApplication([FromBody] TasksBindingModel model)
        {
            try
            {



                var result = await (from task in _context.BPTasks
                                    where task.isActive == true && task.ApplicationID == model.ApplicationID
                                    select new TasksDTO()
                                    {
                                        TaskID = task.TaskID,
                                        TaskName = task.TaskName,
                                        TaskCreatedFor = task.TaskCreatedFor,
                                        DateCreated = task.DateCreated,
                                        DateUpdated = task.DateUpdated,
                                        FunctionalArea = task.FunctionalArea,
                                        CheckedBy = task.CheckedBy,
                                        isChecked = task.isChecked,
                                        isActive = task.isActive,


                                    }).ToListAsync();
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Tasks For Application", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
