namespace WayleaveManagementSystem.Data.Entities
{
    public class BaseEntity
    {
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public int? CreatedById { get; set; }

        public bool isActive { get; set; }


    }
}
