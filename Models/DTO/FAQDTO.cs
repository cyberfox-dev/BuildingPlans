namespace WayleaveManagementSystem.Models.DTO
{
    public class FAQDTO
    {


        public int FAQID { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string? CreatedById { get; set; }

        public bool? isActive { get; set; }



    }
}
