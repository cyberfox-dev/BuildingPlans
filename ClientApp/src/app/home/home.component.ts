import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { ApplicationsService } from '../service/Applications/applications.service';
import { MatTable } from '@angular/material/table';
import { CommentList } from '../nav-menu/nav-menu.component';
//import { ApplicationList } from '../shared/shared.service';
import { SharedService } from "src/app/shared/shared.service"
import { StagesService } from '../service/Stages/stages.service';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { ConfigService } from 'src/app/service/Config/config.service';


export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any

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
  ApplicationStatus: string
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
  ProjectNumber: string;
}


export interface RolesList {
  RoleID: number;
  RoleName: string;
  //RoleType: string;
  //RoleDescription: string;
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
  StagesList: StagesList[] = [];
  relatedApplications: ApplicationList[] = [];
  RolesList: RolesList[] = [];

  CurrentUser: any;
  stringifiedData: any;
    stringifiedDataUserProfile: any;
  CurrentUserProfile: any;
  public canReapply: boolean = false;

  unpaidcount = 0;
  distributioncount = 0;
  approveCount = 0;
  EMBcount = 0;
  rejectCount = 0;
  filter = false;
    previousYear: number;


  constructor(
    private router: Router,
    private applicationService: ApplicationsService,
    private sharedService: SharedService,
    private viewContainerRef: ViewContainerRef,
    private stagesService: StagesService,
    private NewWayleaveComponent: NewWayleaveComponent,
    private accessGroupsService: AccessGroupsService,
    private configService: ConfigService,


  ) {
    this.currentDate = new Date();
    this.previousMonth = this.currentDate.getMonth();
    this.previousYear = this.currentDate.getFullYear();
  }


  currentDate: Date;
  previousMonth: number;

  displayedColumns: string[] = ['FullName', 'Stage','Status', 'TypeOfApplication','AplicationAge','StageAge','DateCreated', 'actions'];
  dataSource = this.Applications;
  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationsList> | undefined;
  ngOnInit(): void {
    
   

    setTimeout(() => {

      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData);

      this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
      this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
      this.UpdateProjectNumberConfig()
      this.getAllApplicationsByUserID();
      this.getAllStages();
      this.getRolesLinkedToUser();

    }, 100);

    

  }

  UpdateProjectNumberConfig() {
    debugger;
    let currentMonth = this.currentDate.getMonth() + 1;
    let changeUtility = ("/" +this.currentDate.getFullYear() % 100).toString();
    //return currentMonth !== this.previousMonth;
   

      this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            let dbMonth = current.utilitySlot2.substring(0, 2);
            if (dbMonth < 10) {
              this.previousMonth = dbMonth.substring(1, 2);
            } else {
              this.previousMonth = dbMonth;
            }
            debugger;
            if (currentMonth !== Number(this.previousMonth)) {  //this.previousMonth  currentMonth
              debugger;
              this.configService.addUpdateConfig(current.configID, null, null, "1", "0" + currentMonth + changeUtility, null, this.CurrentUser.appUserId ).subscribe((data: any) => {
              if (data.responseCode == 1) {
                //for (let i = 0; i < data.dateSet.length; i++) {
                //  const current = data.dateSet[i];



                //}

              }
              else {
                //alert("Invalid Email or Password");
                alert(data.responseMessage);
              }
              console.log("addUpdateConfigReponse", data);

            }, error => {
              console.log("addUpdateConfigError: ", error);
            })
          }
          }

        }
        else {
          //alert("Invalid Email or Password");
          alert(data.responseMessage);
        }
        console.log("getConfigsByConfigNameReponse", data);

      }, error => {
        console.log("getConfigsByConfigNameError: ", error);
      })


   
   

  }

  getRolesLinkedToUser() {

    this.RolesList.splice(0, this.RolesList.length);

    this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;
          //tempRolesList.RoleType = current.roleType;
          //tempRolesList.RoleDescription = current.roleDescription;

          this.RolesList.push(tempRolesList);
          

        }
        this.sharedService.setCurrentUserRole(this.RolesList);
       // this.rolesTable?.renderRows();
        console.log("getAllLinkedRolesReponse", data.dateSet);
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })

  }

  getAllApplicationsByUserID() {

    
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
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;

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
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate;
            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;


            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);

          }

          this.applicationsTable?.renderRows();


          console.log("Got all applications", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }
        this.countUnpaid();
        this.countDistributed();
        this.countApproved();
        this.countEMBStage();
        this.countRejection();
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
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;

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
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate;
            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;


            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);

            this.Applications.push(tempApplicationList);

          }

          this.applicationsTable?.renderRows();
       

          console.log("Got all applications", data.dateSet);
          
        }
        else {
          alert(data.responseMessage);
        }
        this.countUnpaid();
        this.countDistributed();
        this.countApproved();
        this.countEMBStage();
        this.countRejection();

      })
    }

    
   
  }




  getAllStages() {

    this.StagesList.splice(0, this.StagesList.length);

    this.stagesService.getAllStages().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempStageList = {} as StagesList;
          const current = data.dateSet[i];
          tempStageList.StageID = current.stageID;
          tempStageList.StageName = current.stageName;
          tempStageList.StageOrderNumber = current.stageOrderNumber;

          this.StagesList.push(tempStageList);
          this.sharedService.setStageData(this.StagesList);
        }

      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  ngOnDestroy() {

    this.viewContainerRef.clear();
  }



  viewProject(index: any) {
 
    console.log("FIND",this.applicationDataForView[index]);

    this.applicationDataForViewToShared.push(this.applicationDataForView[index])  ;
    this.sharedService.setViewApplicationIndex(this.applicationDataForViewToShared);
/*    this.CheckIfCanReapply();*/
    this.viewContainerRef.clear();
    this.router.navigate(["/view-project-info"]);
  }

  goToNewWayleave(applicationType: boolean) { //application type refers to whether it is a brand new application or if it is a reapply.
    this.sharedService.setReapply(applicationType);
    this.NewWayleaveComponent.onWayleaveCreate(this.CurrentUser.appUserId);
    //console.log("Test: " + this.sharedService.getApplicationID())
/*        this.router.navigate(["/new-wayleave"]);*/
    this.viewContainerRef.clear();

  }

  countUnpaid() {

    for (var i = 0; i < this.applicationDataForView.length; i++) {
      const current = this.applicationDataForView[i];
      if (current.ApplicationStatus == "Unpaid") {
        this.unpaidcount++;

      }  
    }
  }

  countDistributed() {

    for (var i = 0; i < this.applicationDataForView.length; i++) {
      const current = this.applicationDataForView[i];
      if (current.ApplicationStatus == "Distributing" || current.ApplicationStatus == "Distributed/Unallocated" ) {
        this.distributioncount++;

      }
    }
  }

  countApproved() {

    for (var i = 0; i < this.applicationDataForView.length; i++) {
      const current = this.applicationDataForView[i];
      if (current.ApplicationStatus == "Approved" || current.ApplicationStatus == "Final Approval") {
        this.approveCount++;

      }
    }
  }


  countEMBStage() {

    for (var i = 0; i < this.applicationDataForView.length; i++) {
      const current = this.applicationDataForView[i];
      if (current.ApplicationStatus == "EMB") {
        this.EMBcount++;

      }
    }
  }

  countRejection() {

    for (var i = 0; i < this.applicationDataForView.length; i++) {
      const current = this.applicationDataForView[i];
      if (current.ApplicationStatus == "Rejected") {
        this.rejectCount++;

      }
    }
  }


/*  paid
  approved
  final approval
  EMB
  and then approved or rejected*/

/*  unpaidcount = 0;
  distributioncount = 0;
  approveCount = 0;
  EMBcount = 0;
  rejectCount = 0;*/


  filterByUnpaid() {
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Unpaid");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }

  }

  filterByDistribution() {
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Distributing" || df.ApplicationStatus == "Distributed/Unallocated");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }
  }

    filterByApproved() {
      if (this.filter == false) {
        this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Approved" || df.ApplicationStatus == "Final Approval");
        this.filter = true;
      }
      else {
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        this.filter = false;
      }
  }

  filterByRejected() {
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Rejected");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }
  }

  filterByWIP() {
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "EMB");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }
  }

  //Checks if user can re-apply
  async CheckIfCanReapply(index: any) {
    this.relatedApplications.splice(0, this.relatedApplications.length);

    await this.applicationService.getApplicationsByProjectNumber(this.sharedService.getProjectNumber()).subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRelatedApplications = {} as ApplicationList;
          const current = data.dateSet[i];
          tempRelatedApplications.ProjectNumber = current.projectNumber;

          this.relatedApplications.push(tempRelatedApplications);
          // this.sharedService.setStageData(this.StagesList);
        }



        if (data.dateSet.length < 3) {
          this.canReapply = true;
          this.sharedService.setCanReapply(true);
        } else {
          this.canReapply = false;
          this.sharedService.setCanReapply(false);
        }
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("reponse", data);

      this.viewProject(index);

    }, error => {
      console.log("Error: ", error);
    })
  }


}
