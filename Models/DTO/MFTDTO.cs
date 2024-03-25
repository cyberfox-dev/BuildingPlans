namespace BuildingPlans.Models.DTO
{
    public class MFTDTO
    {


        public int MFTID { get; set; }
        public int? ApplicationID { get; set; }
        public string? MFTNote { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentLocalPath { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }
        public string? AppUserID { get; set; }
        public bool? isActive { get; set; }
        public string? FullName { get; set; }


    }
}
