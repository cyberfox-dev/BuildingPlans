import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { ApplicationsService } from '../service/Applications/applications.service';
import { NavigationEnd, Router } from '@angular/router';
import { ZoneForCommentService } from '../service/ZoneForComment/zone-for-comment.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';


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
  userID: string,
  //Coordinates: string
  UserID: any;
  clientAlternativeEmail: string; // chekingNotifications Sindiswa 13 February 2024
}
export interface ApplicationsList {
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
}
export interface ZoneList {
  subDepartmentName: any;
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
  zoneForCommentID: number | null;
}

@Component({
  selector: 'app-old-application-versions',
  templateUrl: './old-application-versions.component.html',
  styleUrls: ['./old-application-versions.component.css']
})


export class OldApplicationVersionsComponent implements OnInit {

  constructor(private router: Router, private sharedService: SharedService, private applicationsService: ApplicationsService, private viewContainerRef: ViewContainerRef, private modalService: NgbModal, private zoneForCommentService: ZoneForCommentService) { }

  ngOnInit(): void {

    this.getOldApplicationVersions();
  }

  projectNumber: string = '';
  Applications: ApplicationsList[] = [];
  applicationDataForView: ApplicationList[] = [];
  applicationDataForViewToShared: ApplicationList[] = [];
  ZoneLinkedList: ZoneList[] = [];
  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;
  displayedColumnsViewLinkedZones: string[] = ['subDepartmentName', 'zoneName'];
  dataSourceViewLinkedZones = this.ZoneLinkedList;
  routerSubscription: Subscription;


  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationsList> | undefined;
  displayedColumns: string[] = ['ProjectNumber', 'FullName', 'Stage', 'Status', 'TypeOfApplication', 'AplicationAge', 'StageAge', 'DateCreated', 'actions'];
  dataSource = this.Applications;


  getOldApplicationVersions() {
    
    this.projectNumber = this.sharedService.getProjectNumber();
    console.log("This is the project number that has been fetched: " + this.sharedService.getProjectNumber());
    this.applicationsService.getApplicationsByProjectNumberRA(this.projectNumber).subscribe((data: any) => {
      if (data.responseCode == 1) {
        // Clear existing data
        this.Applications = [];

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];





          console.log("current", current)
          tempApplicationList.ApplicationID = current.applicationID;
          tempApplicationList.FullName = current.fullName;
          tempApplicationList.TypeOfApplication = current.typeOfApplication;
          tempApplicationList.CurrentStage = current.currentStageName;
          tempApplicationList.ApplicationStatus = current.applicationStatus;

          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

          /*cal application age*/

          const currentDate = new Date();
          const dateCreated = new Date(tempApplicationList.DateCreated);
          const timeDiff = currentDate.getTime() - dateCreated.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationAge = daysDiff;

          /*cal stage age*/
          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationStageAge = stageDateDiff;
          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



          if (current.projectNumber != null) {
            tempApplicationList.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationList.ProjectNumber = (current.applicationID).toString();
          }


          /*            do {
                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
          //save here to send to the shared

          //tempApplicationListShared.applicationID = current. ;
          tempApplicationListShared.applicationID = current.applicationID;
          tempApplicationListShared.clientName = current.fullName;
          tempApplicationListShared.clientEmail = current.email;
          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 19 February 2024
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



          this.applicationDataForView.push(tempApplicationListShared);
          this.Applications.push(tempApplicationList);
        }
        // After populating the data, set it as the dataSource
        this.dataSource =this.Applications;
        this.applicationsTable?.renderRows();
        console.log("This is the archive datasource", this.dataSource);
      }
      else {
        //alert("Invalid Email or Password");
        //alert(data.responseMessage); //This always ays "Parameters are missing??" || NVM
        console.log("Does this application have old versions?",data.responseMessage)
      }
      console.log("reponse", data); 

    }, error => {
      console.log("Error: ", error);
    })
  }

  viewProject(index: any) {
    
    console.log("FIND", this.applicationDataForView[index]);

    this.applicationDataForViewToShared = [this.applicationDataForView[index]];
 
    console.log("this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]", this.applicationDataForView[index]);
    this.sharedService.setViewApplicationIndex(this.applicationDataForViewToShared);

    this.sharedService.setShowFormerApps(false);
    this.sharedService.setFromReApplyArchive(true);
    this.viewContainerRef.clear();

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // First navigation to "/home" has completed, now navigate to "/view-project-info"
        this.router.navigate(["/view-project-info"]);
      }
    });
    this.sharedService.setRoutingToOldAapp(this.routerSubscription);
    // Navigate to "/home"
    this.router.navigate(["/home"]);
    //this.router.navigate(["/view-project-info"]);
  }

  getLinkedZones(ApplicationID: any, processFlow: any) {

    this.ZoneLinkedList.splice(0, this.ZoneLinkedList.length);

   
 
    this.zoneForCommentService.getZonesForComment(ApplicationID, null).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;
          tempZoneList.zoneForCommentID = current.zoneForCommentID;
          tempZoneList.subDepartmentName = current.subDepartmentName;


          this.ZoneLinkedList.push(tempZoneList);
          this.ZoneListTable?.renderRows();

        }


        this.ZoneListTable?.renderRows();

        this.modalService.open(processFlow, { backdrop: 'static', centered: true, size: 'lg' });

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      this.ZoneListTable?.renderRows();


    }, error => {
      console.log("Error: ", error);
    })

  }


}
