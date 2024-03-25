namespace BuildingPlans.DTO
{
    // DTO - Data Trasfer Object
    public class CommentBuilderDTO
    {
        public int CommentID { get; set; }
        public string? CommentName { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }



    }

}
