using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.IServices;
using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Service
{
    public class SubDepartmentForCommentService : ISubDepartmentForCommentService
    {
        private readonly AppDBContext _context;

        public SubDepartmentForCommentService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<SubDepartmentForComment> AddUpdateDepartmentForComment(int? subDepartmentForCommentID, int? applicationID, int? subDepartmentID, string subDepartmentName, string? userAssaignedToComment, string? commentStatus, string? creadtedByID, int? zoneID, string zoneName)
        {

            if (subDepartmentForCommentID == 0)
            {
                subDepartmentForCommentID = null;
            }
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);


            if (tempSubDepForCommentTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempSubDepForCommentTable = new SubDepartmentForComment()
                {
                    ApplicationID = applicationID,
                    SubDepartmentID = subDepartmentID,
                    SubDepartmentName = subDepartmentName,
                    UserAssaignedToComment = userAssaignedToComment,
                    CommentStatus = commentStatus,
                    isAwaitingClarity = false,
                    IsRefered = false,
                    ReferedToUserID = null,
                    CreatedById = creadtedByID,
                    DateCreated = DateTime.Now,
                    isActive = true,
                    ZoneID = zoneID,
                    ZoneName = zoneName,
                };



                //After the inizlization add to the db
                await _context.SubDepartmentForComment.AddAsync(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return tempSubDepForCommentTable;
            }

            else
            {
                if (applicationID != null)
                {
                    tempSubDepForCommentTable.ApplicationID = applicationID;
                }
                if (subDepartmentID != null)
                {
                    tempSubDepForCommentTable.SubDepartmentID = subDepartmentID;
                }
                if (subDepartmentName != null)
                {
                    tempSubDepForCommentTable.SubDepartmentName = subDepartmentName;
                }
                if (userAssaignedToComment != null)
                {
                    tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                }
                if (zoneID != null)
                {
                    tempSubDepForCommentTable.ZoneID = zoneID;
                }
                if (zoneName != null)
                {
                    tempSubDepForCommentTable.ZoneName = zoneName;
                }
                if(commentStatus != null)
                {
                    tempSubDepForCommentTable.CommentStatus = commentStatus;
                }

                tempSubDepForCommentTable.isAwaitingClarity = false;
                tempSubDepForCommentTable.IsRefered = false;
                tempSubDepForCommentTable.ReferedToUserID = null;

                tempSubDepForCommentTable.DateCreated = DateTime.Now;
                tempSubDepForCommentTable.isActive = true;

                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return tempSubDepForCommentTable;
            }



        }


        //JJS GISReviewer 04-03-24

        public async Task<bool> DepartmentForCommentUserAssaignedToComment(int? subDepartmentForCommentID, string? userAssaignedToComment, bool? isGISReviewing, string? GISReviewwerUserID)
        {


            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable != null)
            {


                tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                if (GISReviewwerUserID != null && GISReviewwerUserID != "")
                {
                    tempSubDepForCommentTable.GISReviewerUserID = GISReviewwerUserID;
                }
                else if (GISReviewwerUserID == "")
                {
                    tempSubDepForCommentTable.GISReviewerUserID = null;
                }
                if (isGISReviewing != null)
                {
                    tempSubDepForCommentTable.isGISReviewing = isGISReviewing;
                }

                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }


        }

        public async Task<bool> DepartmentForCommentFinalAppovalUserToComment(int? subDepartmentForCommentID, string? userAssaignedToComment)
        {


            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable != null)
            {


                tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                tempSubDepForCommentTable.FinalApproval = true;

                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }


        }

        public async Task<bool> DeleteDepartmentForComment(int subDepartmentForCommentID)
        {
            //this checks if the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);
            }
            else
            {
                _context.SubDepartmentForComment.Remove(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }
        }


        //this method gets all the professionals linked to a partcular user 
        public async Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForComment(int applicationID)
        {
            return await (
                from subDepartmentForComment in _context.SubDepartmentForComment
                where subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true
                select new SubDepartmentForCommentDTO()
                {
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    ApplicationID = subDepartmentForComment.ApplicationID,
                    SubDepartmentID = subDepartmentForComment.SubDepartmentID,
                    SubDepartmentName = subDepartmentForComment.SubDepartmentName,
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    CommentStatus = subDepartmentForComment.CommentStatus,
                    isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
                    IsRefered = subDepartmentForComment.IsRefered,
                    ReferedToUserID = subDepartmentForComment.ReferedToUserID,
                    CreatedById = subDepartmentForComment.CreatedById,
                    ZoneID = subDepartmentForComment.ZoneID,
                    ZoneName = subDepartmentForComment.ZoneName,
                    isGISReviewing = subDepartmentForComment.isGISReviewing,
                    GISReviewerUserID = subDepartmentForComment.GISReviewerUserID,
                }
                ).ToListAsync();
        }

        public async Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForCommentBySubID(int applicationID, int? subDepartmentID, string? userID)
        {

            if (userID != null)
            {
                // Step 1: Get the list of ZoneIDs associated with the user
                var zoneIds = await _context.UserProfilesTable
                                      .Where(z => z.SubDepartmentID == subDepartmentID
                                                  && z.UserID == userID
                                                  && z.isActive)
                                      .Select(z => z.zoneID)
                                      .ToListAsync();

                // Step 2: Use the retrieved ZoneIDs in the SubDepartmentForComment query
                return await _context.SubDepartmentForComment
                                    .Where(s => s.ApplicationID == applicationID
                                                && s.isActive
                                                && s.SubDepartmentID == subDepartmentID
                                                && zoneIds.Contains(s.ZoneID)) // Use Contains to filter by ZoneIDs
                                    .Select(s => new SubDepartmentForCommentDTO()
                                    {
                                        SubDepartmentForCommentID = s.SubDepartmentForCommentID,
                                        ApplicationID = s.ApplicationID,
                                        SubDepartmentID = s.SubDepartmentID,
                                        SubDepartmentName = s.SubDepartmentName,
                                        UserAssaignedToComment = s.UserAssaignedToComment,
                                        CommentStatus = s.CommentStatus,
                                        isAwaitingClarity = s.isAwaitingClarity,
                                        IsRefered = s.IsRefered,
                                        ReferedToUserID = s.ReferedToUserID,
                                        CreatedById = s.CreatedById,
                                        ZoneID = s.ZoneID,
                                        ZoneName = s.ZoneName,
                                        isGISReviewing = s.isGISReviewing,
                                        GISReviewerUserID = s.GISReviewerUserID
                                    })
                                    .ToListAsync();
            }
            else
            {
                return await (
           from subDepartmentForComment in _context.SubDepartmentForComment
           where subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true && subDepartmentForComment.SubDepartmentID == subDepartmentID
           select new SubDepartmentForCommentDTO()
           {
               SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
               ApplicationID = subDepartmentForComment.ApplicationID,
               SubDepartmentID = subDepartmentForComment.SubDepartmentID,
               SubDepartmentName = subDepartmentForComment.SubDepartmentName,
               UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
               CommentStatus = subDepartmentForComment.CommentStatus,
               isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
               IsRefered = subDepartmentForComment.IsRefered,
               ReferedToUserID = subDepartmentForComment.ReferedToUserID,
               CreatedById = subDepartmentForComment.CreatedById,
               ZoneID = subDepartmentForComment.ZoneID,
               ZoneName = subDepartmentForComment.ZoneName,

           }
           ).ToListAsync();
            }



        }




        public async Task<List<SubDepartmentForCommentDTO>> GetSubDepartmentForCommentNotLinked(int applicationID)
        {
            return await (
                from subDepartmentForComment in _context.SubDepartmentForComment
                where subDepartmentForComment.ApplicationID == applicationID && subDepartmentForComment.isActive == true
                select new SubDepartmentForCommentDTO()
                {
                    SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                    ApplicationID = subDepartmentForComment.ApplicationID,
                    SubDepartmentID = subDepartmentForComment.SubDepartmentID,
                    SubDepartmentName = subDepartmentForComment.SubDepartmentName,
                    UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                    CommentStatus = subDepartmentForComment.CommentStatus,
                    isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
                    IsRefered = subDepartmentForComment.IsRefered,
                    ReferedToUserID = subDepartmentForComment.ReferedToUserID,
                    CreatedById = subDepartmentForComment.CreatedById,
                    ZoneID = subDepartmentForComment.ZoneID,
                    ZoneName = subDepartmentForComment.ZoneName,

                }
                ).ToListAsync();
        }

        public async Task<bool> UpdateCommentStatus(int? subDepartmentForCommentID, string? commentStatus, bool? isAwaitingClarity, bool? isRefered, string? userAssaignedToComment, bool? finalApproval)
        {
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {

                if (isAwaitingClarity != null)
                {
                    tempSubDepForCommentTable.isAwaitingClarity = isAwaitingClarity;
                }
                if (isRefered != null)
                {
                    tempSubDepForCommentTable.IsRefered = isRefered;
                }
                if (userAssaignedToComment != null)
                {
                    tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                }
                if (userAssaignedToComment != null)
                {
                    tempSubDepForCommentTable.FinalApproval = finalApproval;
                }


                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }


        }

        public async Task<bool> ReferToComment(int? subDepartmentForCommentID, string? commentStatus, bool? isRefered, string? referedToUserID)
        {
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.IsRefered = isRefered;
                tempSubDepForCommentTable.ReferedToUserID = referedToUserID;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }



        }

        public async Task<bool> UpdateCommentStatusToAwaitingClarity(int? subDepartmentForCommentID, string? commentStatus, bool? isAwaitingClarity)
        {
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);

            if (tempSubDepForCommentTable == null)
            {
                return await Task.FromResult(false);

            }
            else
            {
                tempSubDepForCommentTable.CommentStatus = commentStatus;
                tempSubDepForCommentTable.isAwaitingClarity = isAwaitingClarity;
                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return true;
            }



        }

        #region actionCentreEdits Sindiswa 16 January 2024
        public async Task<List<SubDepartmentForCommentDTO>> GetAssignedReviewer(int? ApplicationID, int? SubDepartmentID, int? ZoneID)
        {
            return await (
               from subDepartmentForComment in _context.SubDepartmentForComment
               where subDepartmentForComment.ApplicationID == ApplicationID && subDepartmentForComment.SubDepartmentID == SubDepartmentID && subDepartmentForComment.isActive == true
               select new SubDepartmentForCommentDTO()
               {
                   SubDepartmentForCommentID = subDepartmentForComment.SubDepartmentForCommentID,
                   ApplicationID = subDepartmentForComment.ApplicationID,
                   SubDepartmentID = subDepartmentForComment.SubDepartmentID,
                   SubDepartmentName = subDepartmentForComment.SubDepartmentName,
                   UserAssaignedToComment = subDepartmentForComment.UserAssaignedToComment,
                   CommentStatus = subDepartmentForComment.CommentStatus,
                   isAwaitingClarity = subDepartmentForComment.isAwaitingClarity,
                   IsRefered = subDepartmentForComment.IsRefered,
                   ReferedToUserID = subDepartmentForComment.ReferedToUserID,
                   CreatedById = subDepartmentForComment.CreatedById,
                   ZoneID = subDepartmentForComment.ZoneID,
                   ZoneName = subDepartmentForComment.ZoneName,
                   isActive = subDepartmentForComment.isActive,
               }
               ).ToListAsync();
        }

        public async Task<SubDepartmentForComment> AssignSeniorReviewerOrFinalApprover(int? subDepartmentForCommentID, string? userAssaignedToComment)
        {

            if (subDepartmentForCommentID == 0)
            {
                subDepartmentForCommentID = null;
            }
            //this checks is the record exists in the db
            var tempSubDepForCommentTable = _context.SubDepartmentForComment.FirstOrDefault(x => x.SubDepartmentForCommentID == subDepartmentForCommentID);


            if (tempSubDepForCommentTable == null)
            {
                //create a new object of professional entity class then initialize the object with given infomation
                tempSubDepForCommentTable = new SubDepartmentForComment()
                {
                    UserAssaignedToComment = userAssaignedToComment,
                    isAwaitingClarity = false,
                    IsRefered = false,
                    ReferedToUserID = "Encountered a problem with updating the relevant details", // Sindiswa is using this column to sommer debug
                    CreatedById = userAssaignedToComment,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    isActive = true,
                };



                //After the inizlization add to the db
                await _context.SubDepartmentForComment.AddAsync(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return tempSubDepForCommentTable;
            }

            else
            {

                if (userAssaignedToComment != null)
                {
                    tempSubDepForCommentTable.UserAssaignedToComment = userAssaignedToComment;
                }

                tempSubDepForCommentTable.DateUpdated = DateTime.Now;
                tempSubDepForCommentTable.isActive = true;
                //Comments Kyle 01/02/24
                tempSubDepForCommentTable.IsRefered = false;
                _context.Update(tempSubDepForCommentTable);
                await _context.SaveChangesAsync();
                return tempSubDepForCommentTable;
            }



        }



        #endregion

    }
}
