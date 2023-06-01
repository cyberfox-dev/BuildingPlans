namespace WayleaveManagementSystem.Models.BindingModel
{
    public class TypeOfExcavationBindingModel
    {

        //Access Groups
        public int? TypeOfExcavationID { get; set; } // this is also shareed across all 3 tables
        public string? TypeOfExcavationName { get; set; }

        public string? TypeOfExcavationDescription { get; set; }

        //Base Entity
        public string? CreatedById { get; set; }

    }
}
