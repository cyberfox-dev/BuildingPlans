import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { BPBannerApplicationService } from '../service/BPBannerApplication/bpbanner-application.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { BPFlagApplicationService } from '../service/BPFlagApplication/bpflag-application.service';

@Component({
  selector: 'app-bpbanner-application',
  templateUrl: './bpbanner-application.component.html',
  styleUrls: ['./bpbanner-application.component.css']
})
export class BPBannerApplicationComponent implements OnInit {

  constructor(private shared: SharedService, private bpBannerService: BPBannerApplicationService, private router: Router, private bpFlagService: BPFlagApplicationService) { }

  isFlagApplication: boolean;

  UserID: string;
  ApplicantName: string;
  ApplicantSurname: string;
  ApplicantEmail: string;
  ApplicantFax: string
  ApplicantCell: string;
  ApplicantTelephone: string;
  Address: string;
  TypeOfAdvert: string;
  NatureOfEvent: string;
  Description: string;
  NameOfEvent: string;
  StartDate: string;
  EndDate: string;
  SizeOfPoster: string;
  NumberOfPosters: string;
  ApplicationFee: string;

  streetName: string;
  streetNumber: string;
  Suburb: string;
  City: string;
  postalCode: string;

  stringifiedData: any;
  CurrentUser: any;

  //Flag application
  applicationType: string;
  flagStreetName: string;
  poleNumber: string;
  startPole: string;
  endPole: string;

  isFlag: boolean = false;
  IsPole: boolean = false;
  isHeadline: boolean  = false;

  natureOfEvent: string;
  subjectMatter: string;
  noOfFlags: string;

  //Pole Application
  NoOfAgents: string;
  natureOfAdvertisement: string;
  poleSubjectMatter: string;
  placeOfEvent: string;
  applicationFee: string;

  //Headline Details
  

  ngOnInit(): void {
    this.isFlagApplication = this.shared.isFlagApplication;

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }

  createBannerApplication() {
    if (this.isFlagApplication == false) {
      this.bpBannerService.addUpdateBannerApplication(0, this.UserID, this.ApplicantName, this.ApplicantSurname, this.ApplicantEmail, this.ApplicantFax, this.ApplicantCell, this.ApplicantTelephone, this.Address, this.TypeOfAdvert, this.NameOfEvent, this.Description, this.NameOfEvent, this.StartDate, this.EndDate, this.SizeOfPoster, this.NumberOfPosters, this.ApplicationFee, null, "Capture", null, this.CurrentUser.appUserId).subscribe((data: any) => {
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
    else {
      this.createFlagApplication();
    }
  }

  createFlagApplication() {
    this.bpFlagService.addUpdateFlagApplication(0, this.UserID, this.ApplicantName, this.ApplicantSurname, this.ApplicantEmail, this.ApplicantFax, this.ApplicantCell, this.ApplicantTelephone, this.Address, this.applicationType, this.flagStreetName, this.poleNumber, this.startPole, this.endPole, this.subjectMatter, this.noOfFlags, this.NoOfAgents, this.natureOfAdvertisement, this.StartDate, this.EndDate, this.placeOfEvent, this.applicationFee, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode) {
        this.router.navigate(["/home"]);
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }

  onChangeTypeOfApplication() {
    if (this.applicationType == "Flag") {
      this.isFlag = true;
    }
    if (this.applicationType == "Pole") {
      this.IsPole = true;
    }
    if (this.applicationType == "Headline") {
      this.isHeadline = true;
    }
  }
}
