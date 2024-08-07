﻿namespace BuildingPlans.Models.BindingModel
{
    public class CommentBindingModel
    {
        public int? CommentID { get; set; }
        public int? ApplicationID { get; set; }
        public string? Comment { get; set; }
        public string? CommentStatus { get; set; }
        public int? SubDepartmentForCommentID { get; set; }
        public int? SubDepartmentID { get; set; }
        public string? SubDepartmentName { get; set; }
        public string? CreatedById { get; set; }
        public int? isClarifyCommentID { get; set; }
        public string? isApplicantReplay { get; set; }
        public string? UserName { get; set; }
        public string? ZoneName { get; set; }
        public string? CanReplyUserID { get; set; }
        public string? FunctionalArea { get; set; }
        public string? SecondReply { get; set; }
    }
}
