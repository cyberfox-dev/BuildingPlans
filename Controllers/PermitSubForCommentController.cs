using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.DTO;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Models.BindingModel;
using WayleaveManagementSystem.Models.DTO;

namespace WayleaveManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermitSubForCommentController : Controller
    {

        private readonly AppDBContext _context;

        public PermitSubForCommentController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("AddUpdatePermitSubForComment")]
        public async Task<object> AddUpdatePermitSubForComment([FromBody] PermitSubForCommentBindingModel model)
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
                    if (model.PermitSubForCommentID == 0)
                    {
                        model.PermitSubForCommentID = null;
                    }

                    var tempPermitSubForComment = _context.PermitSubForComment.FirstOrDefault(x => x.PermitSubForCommentID == model.PermitSubForCommentID);


                    if (tempPermitSubForComment == null)
                    {
                        tempPermitSubForComment = new PermitSubForComment()
                        {
                            ApplicationID = model.ApplicationID,
                            SubDepartmentID = model.SubDepartmentID,
                            SubDepartmentName = model.SubDepartmentName,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true,
                            UserAssaignedToComment = model.UserAssaignedToComment,
                            CreatedById = model.CreatedById,
                            PermitComment = model.PermitComment,
                            PermitCommentStatus = model.PermitCommentStatus,
                            ZoneID = model.ZoneID,
                            ZoneName = model.ZoneName,

                            #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
                            DocumentLocalPath =  model.DocumentLocalPath,
                            PermitDocName = model.PermitDocName,
                            #endregion

                        };

                        await _context.PermitSubForComment.AddAsync(tempPermitSubForComment);
                        await _context.SaveChangesAsync();

                        result = tempPermitSubForComment;

                    }
                    else
                    {
                        if (model.ApplicationID != null)
                        {
                            tempPermitSubForComment.ApplicationID = model.ApplicationID;
                        }
                        if (model.SubDepartmentID != null)
                        {
                            tempPermitSubForComment.SubDepartmentID = model.SubDepartmentID;
                        }
                        if (model.SubDepartmentName != null)
                        {
                            tempPermitSubForComment.SubDepartmentName = model.SubDepartmentName;
                        }
                        if (model.UserAssaignedToComment != null)
                        {
                            tempPermitSubForComment.UserAssaignedToComment = model.UserAssaignedToComment;
                        }
                        if (model.CreatedById != null)
                        {
                            tempPermitSubForComment.CreatedById = model.CreatedById;
                        }
                        if (model.PermitComment != null)
                        {
                            tempPermitSubForComment.PermitComment = model.PermitComment;
                        }
                        if (model.PermitCommentStatus != null)
                        {
                            tempPermitSubForComment.PermitCommentStatus = model.PermitCommentStatus;
                        }
                        if (model.ZoneID != null)
                        {
                            tempPermitSubForComment.ZoneID = model.ZoneID;
                        }
                        if (model.ZoneName != null)
                        {
                            tempPermitSubForComment.ZoneName = model.ZoneName;
                        }
                        #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
                        if (model.DocumentLocalPath != null)
                        {
                            tempPermitSubForComment.DocumentLocalPath = model.DocumentLocalPath;
                        }
                        if (model.PermitDocName != null)
                        {
                            tempPermitSubForComment.PermitDocName = model.PermitDocName;
                        }
                        tempPermitSubForComment.DateUpdated = DateTime.Now;
                        #endregion
                        _context.Update(tempPermitSubForComment);
                        await _context.SaveChangesAsync();
                        result = tempPermitSubForComment;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.PermitSubForCommentID > 0 ? "Updated Successfully" : "Created Successfully"), result));
                }
            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("DeletePermitSubForCommentByID")]
        public async Task<object> DeletePermitSubForCommentByID([FromBody] int permitSubForCommentID)
        {
            try
            {

                var tempPermitSubForComment = _context.PermitSubForComment.FirstOrDefault(x => x.PermitSubForCommentID == permitSubForCommentID);

                if (tempPermitSubForComment == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    tempPermitSubForComment.DateUpdated = DateTime.Now;
                    tempPermitSubForComment.isActive = false;
                    _context.Update(tempPermitSubForComment);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Deleted Successfully", true));
                }


            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllPermitSubForComment")]
        public async Task<object> GetAllPermitSubForComment()
        {
            try
            {
                var result = await (
                from permitSubForComment in _context.PermitSubForComment
                where permitSubForComment.isActive == true
                select new PermitSubForCommentDTO()
                {
                    ApplicationID = permitSubForComment.ApplicationID,
                    SubDepartmentID = permitSubForComment.SubDepartmentID,
                    SubDepartmentName = permitSubForComment.SubDepartmentName,
                    UserAssaignedToComment = permitSubForComment.UserAssaignedToComment,
                    CreatedById = permitSubForComment.CreatedById,
                    PermitComment = permitSubForComment.PermitComment,
                    PermitCommentStatus = permitSubForComment.PermitCommentStatus,
                    ZoneID = permitSubForComment.ZoneID,
                    ZoneName = permitSubForComment.ZoneName,

                    #region permitupload Sindiswa 09 January 2024
                    PermitDocName = permitSubForComment.PermitDocName,
                    DocumentLocalPath = permitSubForComment.DocumentLocalPath,
                    #endregion


                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Service Items", result));



            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }




        [HttpPost("GetPermitSubForCommentByApplicationID")]
        public async Task<object> GetPermitSubForCommentByApplicationID([FromBody] int applicationID)
        {
            try
            {
                var result = await (
                from permitSubForComment in _context.PermitSubForComment
                where permitSubForComment.ApplicationID == applicationID && permitSubForComment.isActive == true
                select new PermitSubForCommentDTO()
                {
                    PermitSubForCommentID = permitSubForComment.PermitSubForCommentID,
                    ApplicationID = permitSubForComment.ApplicationID,
                    SubDepartmentID = permitSubForComment.SubDepartmentID,
                    SubDepartmentName = permitSubForComment.SubDepartmentName,
                    UserAssaignedToComment = permitSubForComment.UserAssaignedToComment,
                    CreatedById = permitSubForComment.CreatedById,
                    PermitComment = permitSubForComment.PermitComment,
                    PermitCommentStatus = permitSubForComment.PermitCommentStatus,
                    ZoneID = permitSubForComment.ZoneID,
                    ZoneName = permitSubForComment.ZoneName,

                    #region permitupload Sindiswa 09 January 2024
                    PermitDocName = permitSubForComment.PermitDocName,
                    DocumentLocalPath = permitSubForComment.DocumentLocalPath,
                    #endregion


                }
                ).ToListAsync();



                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All PermitSubForComment By ID", result));

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpPost("GetPermitSubForCommentBySubID")]
        public async Task<object> GetPermitSubForCommentBySubID([FromBody] PermitSubForCommentBindingModel model)
        {
            try
            {
                if (model.UserAssaignedToComment != null)
                {
                    var zoneIds = await _context.UserProfilesTable
                                          .Where(z => z.SubDepartmentID == model.SubDepartmentID
                                                      && z.UserID == model.UserAssaignedToComment
                                                      && z.isActive)
                                          .Select(z => z.zoneID)
                                          .ToListAsync();

                    var result = await _context.PermitSubForComment
              .Where(s => s.ApplicationID == model.ApplicationID
                                              && s.isActive
                                              && s.SubDepartmentID == model.SubDepartmentID
                                              && zoneIds.Contains(s.ZoneID)) // Use Contains to filter by ZoneIDs
                                  .Select(s => new PermitSubForCommentDTO()
                                  {
                                      PermitSubForCommentID = s.PermitSubForCommentID,
                                      ApplicationID = s.ApplicationID,
                                      SubDepartmentID = s.SubDepartmentID,
                                      SubDepartmentName = s.SubDepartmentName,
                                      UserAssaignedToComment = s.UserAssaignedToComment,
                                      PermitCommentStatus = s.PermitCommentStatus,
                                      CreatedById = s.CreatedById,
                                      ZoneID = s.ZoneID,
                                      ZoneName = s.ZoneName,
                                  })
                                  .ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All PermitSubForComment By ID", result));
                }
                else { 
                    var result = await (
                from permitSubForComment in _context.PermitSubForComment
                where permitSubForComment.ApplicationID == model.ApplicationID && permitSubForComment.isActive == true && permitSubForComment.SubDepartmentID == model.SubDepartmentID
                select new PermitSubForCommentDTO()
                {
                    PermitSubForCommentID = permitSubForComment.PermitSubForCommentID,
                    ApplicationID = permitSubForComment.ApplicationID,
                    SubDepartmentID = permitSubForComment.SubDepartmentID,
                    SubDepartmentName = permitSubForComment.SubDepartmentName,
                    UserAssaignedToComment = permitSubForComment.UserAssaignedToComment,
                    CreatedById = permitSubForComment.CreatedById,
                    PermitComment = permitSubForComment.PermitComment,
                    PermitCommentStatus = permitSubForComment.PermitCommentStatus,
                    ZoneID = permitSubForComment.ZoneID,
                    ZoneName = permitSubForComment.ZoneName,


                }
                ).ToListAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All PermitSubForComment By ID", result));
                }

               

            }
            catch (Exception ex)
            {


                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        #region permitupload Sindiswa 09 January 2024
        [HttpPost("HasPermitSubForCommentDocuments")]

        public async Task<object> HasPermitSubForCommentDocuments([FromBody] int permitSubForCommentID)
        {
            try
            {
                var tempPermitSubForComment = _context.PermitSubForComment.FirstOrDefault(x => x.PermitSubForCommentID == permitSubForCommentID);

                if (tempPermitSubForComment == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", false));

                }
                else
                {
                    // Check if DocumentLocationPath and PermitDocName are empty or not
                    bool hasDocuments = !string.IsNullOrEmpty(tempPermitSubForComment.DocumentLocalPath) && !string.IsNullOrEmpty(tempPermitSubForComment.PermitDocName);

                    return await Task.FromResult(new ResponseModel(
                        Enums.ResponseCode.OK,
                        "Got Document Details",
                        new { HasDocuments = hasDocuments }
                    ));
                }

            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }

        }
        #endregion


    }


}
