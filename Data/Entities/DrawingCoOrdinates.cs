using System.ComponentModel.DataAnnotations;


namespace BuildingPlans.Data.Entities
{
    public class DrawingCoOrdinates:BaseEntity
    {
        [Key]
        public int CoOrdinateID { get; set; }
        public int? ApplicationID { get; set; }
        public string? DrawingType { get; set; }
        public string? Latitude { get; set; } 
        public string? Longitude { get; set; }
        public string? Radius { get; set; } 
        
        //public Geometry? Geometry { get; set; }
        }
  
    }

    


