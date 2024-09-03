import { Component, OnInit,ViewChild } from '@angular/core';
import { ApplicationsService } from '../service/Applications/applications.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApplicationsList } from '../notification-center/notification-center.component';
import { SharedService } from '../shared/shared.service';
import { Router } from "@angular/router";
export interface Applications {
  ApplicationID: number;
  FullName: string;
  /*  ReferenceNumber: string;*/
  TypeOfApplication: any;
  DateCreated: any;
  TestApplicationAge: number,
  TestApplicationStageAge: number,
  CurrentStage: string,
  ApplicationStatus: string,
  ProjectNumber: string;
  isEscalated: boolean; //escalation Sindiswa 29 January 2024
  EscalationDate: any; //escalation Sindiswa 31 January 2024
  EMBActionDate: any; //escalation Sindiswa 31 January 2024
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
  ApplicationStatus: string,
  CurrentStageName: string,
  CurrentStageNumber: number,
  CurrentStageStartDate: Date,
  NextStageName: string,
  NextStageNumber: number,
  PreviousStageName: string,
  PreviousStageNumber: number,
  ProjectNumber: string,
  isPlanning?: boolean,
  permitStartDate: Date,
  DatePaid: Date;
  wbsrequired: boolean;
  Coordinates: string,
  userID: string
  //Coordinates: string
  UserID: any;
  clientAlternativeEmail: string; // checkingNotifications Sindiswa 15 February 2024
  NetworkLicensees: string; //Project size Kyle 27-02-24
  ContractorAccountDetails: string; //zxNumberUpdate Sindiswa 01 March 2024
}
@Component({
  selector: 'app-create-new-application',
  templateUrl: './create-new-application.component.html',
  styleUrls: ['./create-new-application.component.css']
})
export class CreateNewApplicationComponent implements OnInit {

  constructor(private applicationsService: ApplicationsService, private sharedService: SharedService,private router :Router) { }

  ApplicationsList: Applications[] = [];
  sharedList: ApplicationList[] = [];

  dataSource = this.ApplicationsList;
  displayedColumns: string[] = ['ProjectNumber', 'FullName', 'Stage', 'Status', 'TypeOfApplication', 'AplicationAge', 'StageAge', 'DateCreated', 'actions'];
  CurrentUser: any;
  stringifiedData: any;

  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationList> | undefined;
  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllApplications();
  }

  getAllApplications() {

    this.applicationsService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {

      debugger;
      if (data.responseCode == 1) {

        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as Applications;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];

          debugger;



          console.log("current", current)
          tempApplicationList.ApplicationID = current.applicationID;
          tempApplicationList.FullName = current.fullName;
          tempApplicationList.TypeOfApplication = current.typeOfApplication;
          tempApplicationList.CurrentStage = current.currentStageName;
          tempApplicationList.ApplicationStatus = current.applicationStatus;
          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

          //          /*cal application age*/

          const currentDate = new Date();
          const dateCreated = new Date(tempApplicationList.DateCreated);
          const timeDiff = currentDate.getTime() - dateCreated.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationAge = daysDiff;

          //          /*cal stage age*/
          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationStageAge = stageDateDiff;
          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);

          debugger;

          if (current.projectNumber != null && current.projectNumber != "") {
            tempApplicationList.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationList.ProjectNumber = (current.applicationID).toString();
          }


          //do {
          //  tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
          //} while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);
          //          //save here to send to the shared

          //tempApplicationListShared.applicationID = current. ;
         
          this.ApplicationsList.push(tempApplicationList);
          
          this.dataSource = this.ApplicationsList;


          this.applicationsTable?.renderRows();
          console.log("dataSourceWayleave", this.dataSource, this.ApplicationsList);
        }
      }
      else {
        alert(data.responseMessage);
      }

    })
  }

  ViewApplication(index: any) {
    debugger;
    const applicationID = this.ApplicationsList[index].ApplicationID;
    this.sharedService.setApplicationID(applicationID);
    this.applicationsService.getApplicationsByApplicationID(applicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const tempApplicationListShared = {} as ApplicationList;
        const current = data.dateSet[0];

        tempApplicationListShared.applicationID = current.applicationID;
        tempApplicationListShared.clientName = current.fullName;
        tempApplicationListShared.clientEmail = current.email;
        tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
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
        tempApplicationListShared.UserID = current.userID;//
        tempApplicationListShared.ApplicationStatus = current.applicationStatus;
        tempApplicationListShared.CurrentStageName = current.currentStageName;
        tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

        tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
        tempApplicationListShared.NextStageName = current.nextStageName;
        tempApplicationListShared.NextStageNumber = current.nextStageNumber;
        tempApplicationListShared.PreviousStageName = current.previousStageName;
        tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
        tempApplicationListShared.DatePaid = current.datePaid;
        tempApplicationListShared.wbsrequired = current.wbsRequired;
        tempApplicationListShared.Coordinates = current.coordinates;
        if (current.projectNumber != null) {
          tempApplicationListShared.ProjectNumber = current.projectNumber;
        } else {
          tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
        }

        tempApplicationListShared.isPlanning = current.isPlanning;
        tempApplicationListShared.permitStartDate = current.permitStartDate;

        this.sharedList.push(tempApplicationListShared);
        this.sharedService.setViewApplicationIndex(this.sharedList);

        this.router.navigate(["/view-project-info"])
        
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log(error);
    })
  }
}
