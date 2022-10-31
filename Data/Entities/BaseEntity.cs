namespace WayleaveManagementSystem.Data.Entities
{
    public class BaseEntity
    {
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string? CreatedById { get; set; }

        public bool isActive { get; set; }


    }
}
