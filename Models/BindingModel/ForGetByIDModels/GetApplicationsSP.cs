﻿namespace BuildingPlans.Models.BindingModel.ForGetByIDModels
{
    public class GetApplicationsSP
    {


        public string UserID { get; set; }
        public bool isInternal { get; set; }
        public bool isDrafted { get; set; }

    }
}
