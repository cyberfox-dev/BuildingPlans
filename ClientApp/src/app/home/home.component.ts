import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { ApplicationsService } from '../service/Applications/applications.service';
import { MatTable } from '@angular/material/table';
import { CommentList } from '../nav-menu/nav-menu.component';
//import { ApplicationList } from '../shared/shared.service';
import { SharedService } from "src/app/shared/shared.service"


export interface ApplicationsList {
  ApplicationID: number;
  FullName: string;
  /*  ReferenceNumber: string;*/
  TypeOfApplication: any;
  DateCreated: any;
  TestApplicationAge: number,
  TestApplicationStageAge: number
}



export interface ApplicationList {
  applicationID: number,
  clientName: string,
  clientEmail: string,
  clientAddress: string,
  clientRefNo: string,
  CompanyRegNo: string,
  TypeOfApplication: string,
  NotificationNumber: string,
  WBSNumber: string,
  PhysicalAddressOfProject: string,
  DescriptionOfProject: string,
  NatureOfWork: string,
  ExcavationType: string,
  ExpectedStartDate: Date,
  ExpectedEndDate: Date,
  Location: string,
  clientCellNo: string,
  CreatedById: number,

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.scss"],
})




export class HomeComponent implements OnInit,OnDestroy {

  Applications: ApplicationsList[] = [];
  applicationDataForView: ApplicationList[] = [];
  applicationDataForViewToShared: ApplicationList[] = [];
  CurrentUser: any;
  stringifiedData: any;
    stringifiedDataUserProfile: any;
    CurrentUserProfile: any;
  constructor(private router: Router, private applicationService: ApplicationsService, private sharedService: SharedService, private viewContainerRef: ViewContainerRef) {

  }

  displayedColumns: string[] = [ 'FullName', 'TypeOfApplication','AplicationAge','StageAge','DateCreated', 'actions'];
  dataSource = this.Applications;
  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationsList> | undefined;
  ngOnInit(): void {
    
   

    setTimeout(() => {

      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData);

      this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
      this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

      this.getAllApplicationsByUserID();
    }, 100);

  }



  getAllApplicationsByUserID() {
    debugger;
    
    this.Applications.splice(0, this.Applications.length);

    if (this.CurrentUserProfile[0].isInternal) {
      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {


        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempApplicationList = {} as ApplicationsList;
            const tempApplicationListShared = {} as ApplicationList;
            const current = data.dateSet[i];
            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;

            tempApplicationList.DateCreated = current.dateCreated;

            tempApplicationList.TestApplicationAge = Math.floor(Math.random() * 30) + 1;
            do {
              tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
            } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;


            this.applicationDataForView.push(tempApplicationListShared);
            this.Applications.push(tempApplicationList);

          }

          this.applicationsTable?.renderRows();


          console.log("Got all applications", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }
      })
    }
    else {
      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {
     

        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempApplicationList = {} as ApplicationsList;
            const tempApplicationListShared = {} as ApplicationList;
            const current = data.dateSet[i];
            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;

            tempApplicationList.DateCreated = current.dateCreated;

            tempApplicationList.TestApplicationAge = Math.floor(Math.random() * 30) + 1;
            do {
              tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
            } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;


            this.applicationDataForView.push(tempApplicationListShared);
            this.Applications.push(tempApplicationList);

          }

          this.applicationsTable?.renderRows();


          console.log("Got all applications", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }
      })
    }

   
   
  }

  ngOnDestroy() {
    debugger;
    this.viewContainerRef.clear();
  }



  viewProject(index: any) {
 
    console.log("FIND",this.applicationDataForView[index]);

    this.applicationDataForViewToShared.push(this.applicationDataForView[index])  ;
    this.sharedService.setViewApplicationIndex(this.applicationDataForViewToShared);
    this.router.navigate(["/view-project-info"]);
    this.viewContainerRef.clear();

  }


  goToNewWayleave(){
    this.router.navigate(["/new-wayleave"]);
    this.viewContainerRef.clear();
  }
}
