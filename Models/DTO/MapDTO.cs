using Microsoft.EntityFrameworkCore;

namespace BuildingPlans.Models.DTO
{
    [Keyless]
    public class MapDTO
    {
        public object? Geometry { get; set; } // Adjust the type based on your needs
    }

}
