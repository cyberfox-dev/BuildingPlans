import { Component, OnInit } from '@angular/core';
import { BPSignageApplicationService } from '../service/BPSignageApplication/bpsignage-application.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
@Component({
  selector: 'app-bpsignage-application',
  templateUrl: './bpsignage-application.component.html',
  styleUrls: ['./bpsignage-application.component.css']
})
export class BPSignageApplicationComponent implements OnInit {

  constructor(private bpSignageService: BPSignageApplicationService ,private router:Router) { }

  TypeOfApplication: string;
  typeOfApplicant: string;
  isSingleApplicant: boolean;
  OrganisationName: string;
  UserID: string;
  ApplicantName: string;
  ApplicantSurname: string;
  ApplicantCell: string;
  ApplicantTelephone: string;
  ApplicantFax: string;
  ApplicantEmail: string;
  AddressType: string;
  Address: string;
  NatureOfAdvertisement: string;
  AreasOfControl: string;
  Height: string;
  Width: string;
  NoOfFaces: string;
  StartDate: any;
  EndDate: any;
  ApplicationFee: string;
  MonthlyFee: string;
  Voltage: string;
  ElectricityRequired: boolean = false;
  EnvironmentalImpactAssessment: boolean = false;
  AdvertisingSignRight: boolean = false;
  Encroachment: boolean = false;


  StreetNumber: string;
  StreetName: string;
  Suburb: string;
  City: string;
  PostalCode: string;

  stringifiedData: any;
  CurrentUser: any;

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }

  onSelectApplicant() {
    if (this.typeOfApplicant == "Single") {
      this.isSingleApplicant = true;
    }
    else if (this.typeOfApplicant == "Organisation") {
      this.isSingleApplicant = false;
    }
  }
  CreateSignageApplication() {
    this.Address = this.StreetNumber + " " + this.StreetName + " " + this.Suburb + " " + this.City + " " + this.PostalCode;
    debugger;
    this.bpSignageService.addUpdateSignageApplication(0, this.TypeOfApplication, this.typeOfApplicant, this.OrganisationName, this.CurrentUser.appUserId, this.ApplicantName, this.ApplicantSurname, this.ApplicantCell, this.ApplicantTelephone, this.ApplicantFax, this.ApplicantEmail, this.AddressType, this.Address, this.NatureOfAdvertisement, this.AreasOfControl, this.Height, this.Width, this.NoOfFaces, this.StartDate, this.EndDate, this.ApplicationFee, this.MonthlyFee, this.Voltage, this.ElectricityRequired, this.EnvironmentalImpactAssessment, this.AdvertisingSignRight, this.Encroachment, null, "Capture", null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.router.navigate(["/home"]);
      }
      else {
        alert(data.responseMessage);
      }
       
    }, error => {
      console.log("Error: ", error);
      
    })
  }
  onCheckElectricity() {
    if (this.ElectricityRequired == false) {
      this.ElectricityRequired = true;
    }
    else {
      this.ElectricityRequired = false;
    }
  }

  onCheckImpactAssessment() {
    if (this.EnvironmentalImpactAssessment == false) {
      this.EnvironmentalImpactAssessment = true;
    }
    else {
      this.EnvironmentalImpactAssessment = false;

    }
  }

  onEncroachmentCheck() {
    if (this.Encroachment == false) {
      this.Encroachment = true;
    }
    else {
      this.Encroachment = false;
    }
  }

  onAgreementCheck() {
    if (this.AdvertisingSignRight == false) {
      this.AdvertisingSignRight = true;
    }
    else {
      this.AdvertisingSignRight = false;
    }
  }
}
