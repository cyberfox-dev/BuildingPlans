using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class TypeOfExcavation : BaseEntity
    {
        [Key]
        public int TypeOfExcavationID { get; set; }
        public string? TypeOfExcavationName { get; set; }

        public string? TypeOfExcavationDescription { get; set; }

    }
}
