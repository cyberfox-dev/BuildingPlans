import { Component, OnInit } from '@angular/core';
import { OccupationClassificationService } from 'src/app/service/OccupationClassification/occupation-classification.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
import { BPDemolitionApplicationService } from '../service/BPDemolitionApplication/bpdemolition-application.service';
export interface OccupationsClassificationsList {
  OccupationID: number;
  OccupationName: string;
  OccupationCode: string;
  Occupancy: string;
  FunctionalArea: string;
  OccupancyDescription: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;

}
@Component({
  selector: 'app-bpdemolition-application',
  templateUrl: './bpdemolition-application.component.html',
  styleUrls: ['./bpdemolition-application.component.css']
})
export class BPDemolitionApplicationComponent implements OnInit {

  constructor(private occupationService: OccupationClassificationService, private router: Router, private sharedService: SharedService, private bpDemolitionService: BPDemolitionApplicationService) { }

  OccupationsClassificationList: OccupationsClassificationsList[] = [];

  isOwner: boolean = false;
  isArchive: boolean;

  mainMunicipality: string;

  applicantName: string ;
  applicantSurname: string;
  applicantIDNumber: string;
  applicantEmail: string;
  applicantContact: string;

 

  ownerName: string;
  ownerSurname: string;
  ownerEmail: string;
  ownerContact: string;
  ownerIDNumber: string;

  applicantStreetNumber: string;
  applicantStreetName: string;
  applicantSuburb: string;
  applicantCity: string;
  applicantPostalCode: string;
  applicantAddress: string;

  siteStreetNumber: string;
  siteStreetName: string;
  siteSuburb: string;
  siteCity: string;
  sitePostalCode: string;
  siteERFNumber: string;
  siteCadastralDescription: string;
  siteAddress: string;
  reasonForDemolition: "";
  propertyExistingUser: string;
  DemolitionFees: string;

  stringifiedData: any;
  CurrentUser: any;

  ngOnInit(): void {
    this.isArchive = this.sharedService.isDemolitionArchive;
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllOccupationClassifications();
  }

  onCheckIsOwner() {
    if (this.isOwner == false) {
      this.isOwner = true;
      this.ownerIDNumber = this.applicantIDNumber;
      this.ownerName = this.applicantName;
      this.ownerSurname = this.applicantSurname;
      this.ownerEmail = this.applicantEmail;
      this.ownerContact = this.applicantContact;
    }
    else {
      this.isOwner = false;
    }
  }

  getAllOccupationClassifications() {
    this.occupationService.getAllClassificationForFunctionalArea("Building Plan").subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempOccupation = {} as OccupationsClassificationsList;

          tempOccupation.OccupationID = current.occupationID;
          tempOccupation.OccupationName = current.occupationName;
          tempOccupation.OccupationCode = current.occupationCode;
          tempOccupation.Occupancy = current.occupancy;
          tempOccupation.OccupancyDescription = current.occupancyDescription;
          tempOccupation.FunctionalArea = current.functionalArea;
          tempOccupation.DateCreated = current.dateCreated.substring(0,current.dateCreated.indexOf("T"));
          tempOccupation.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempOccupation.CreatedById = current.createdById;

          this.OccupationsClassificationList.push(tempOccupation);
        }

      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

  Create() {
    this.applicantAddress = this.applicantStreetNumber + " " + this.applicantStreetName + " " + this.applicantSuburb + " " + this.applicantCity + " " + this.applicantPostalCode;
    this.siteAddress = this.siteStreetNumber + " " + this.siteStreetName + " " + this.siteSuburb + " " + this.siteCity + " " + this.sitePostalCode;
    debugger;
    this.bpDemolitionService.addUpdateDemolitionApplication(0, this.mainMunicipality, this.applicantName, this.applicantSurname, this.applicantIDNumber, this.applicantEmail, this.applicantContact, this.isOwner, this.ownerIDNumber, this.ownerName, this.ownerSurname, this.ownerEmail, this.ownerContact, this.applicantAddress, this.siteAddress, this.siteERFNumber, this.siteCadastralDescription, this.reasonForDemolition, this.propertyExistingUser, this.DemolitionFees, this.isArchive, this.CurrentUser.appUserId,null,null,null).subscribe((data: any) => {
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
}
