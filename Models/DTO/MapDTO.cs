using Microsoft.EntityFrameworkCore;
using WayleaveManagementSystem.Data.Entities;

namespace WayleaveManagementSystem.Models.DTO
{
    [Keyless]
    public class MapDTO
    {
        public object? Geometry { get; set; } // Adjust the type based on your needs
    }

}
