using System.ComponentModel.DataAnnotations;

namespace WayleaveManagementSystem.Data.Entities
{
    public class ProjectSizeCheckList : BaseEntity
    {
        [Key]
        public int? ProjectSizeCheckListID { get; set; }
        public string? ProjectSizeCheckListRowNumber { get; set; }
        public string? ProjectSizeCheckListActivity { get; set; }
        public string? MandatoryDocumentCategory { get; set; }
        public string? ProjectSizeCheckListActivityType { get; set; }



        /*   public int? StageID { get; set; }*/

    }
}
