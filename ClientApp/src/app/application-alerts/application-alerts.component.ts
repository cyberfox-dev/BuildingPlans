import { Component, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CommentsService } from '../service/Comments/comments.service';
import { ApplicationsService } from '../service/Applications/applications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../shared/shared.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { PermitService } from '../service/Permit/permit.service';

//Clarifications Alerts Kyle
export interface Clarifications {
  ApplicationID: number;
  ProjectNumber: string;
  Description: string;
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
  userID: string,
  //Coordinates: string
  UserID: any;
  clientAlternativeEmail: string; //checkingNotifications Sindiswa 15 February 2024
}

@Component({
  selector: 'app-application-alerts',
  templateUrl: './application-alerts.component.html',
  styleUrls: ['./application-alerts.component.css']
})
export class ApplicationAlertsComponent implements OnInit {

  constructor(private commentsService: CommentsService, private applicationService: ApplicationsService, private modalService: NgbModal, private shared: SharedService, private router: Router, private permitService: PermitService) { }
  ClarificationsList: Clarifications[] = [];

  @ViewChild(MatTable) clarificationsTable: MatTable<any> | undefined;
  displayedColumnsClarifications: string[] = ['projectNumber', 'description', 'actions'];
  dataSourceClarifications = this.ClarificationsList;

  @ViewChild("clarifications", { static: true }) clarify!: ElementRef;

  applicationList: ApplicationList[] = [];
  permitHasDoc = [];
  stringifiedData: any;
  CurrentUser: any;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  isEMB: boolean;

  applicationData: any;
  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));

    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.isEMB = this.shared.EMBLoggedIn;
    this.getAllClarificationsAlerts();



  }
  getAllClarificationsAlerts() {
    
    this.commentsService.getAllCommentsAwaitingClarity(this.CurrentUser.appUserId).subscribe(async (data: any) => {
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempClarifyAlert = {} as Clarifications;
          const current = data.dateSet[i];
          
          tempClarifyAlert.ApplicationID = current.applicationID;
          tempClarifyAlert.Description = current.commentStatus;

          const projectNumber: string = await this.getProjectNumberForApplication(current.applicationID);

          tempClarifyAlert.ProjectNumber = projectNumber

          this.ClarificationsList.push(tempClarifyAlert);
        }

        this.getAllPendingApprovalPacksForUser();
      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("Error: ", error);
    })
    console.log("ClarificationsList", this.ClarificationsList);
  }

  async getProjectNumberForApplication(applicationID: any): Promise<string> {
    try {
      const data: any = await this.applicationService.getApplicationsByApplicationID(applicationID).toPromise();
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        
        return current.projectNumber;
      } else {
        //alert(data.responseMessage);
        throw new Error(data.responseMessage);
      }
    } catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }
  openClarificationsAlerts() {
    this.modalService.open(this.clarify, { centered: true, size: 'xl' });
  }

  goToApplication(index: any) {
    const projectNumber = this.ClarificationsList[index].ProjectNumber;

    this.shared.setProjectNumber(projectNumber);

    this.applicationService.getApplicationsByProjectNumber(projectNumber).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];

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

          this.applicationList.push(tempApplicationListShared)

        }


        this.shared.getShowFormerApps();

        this.shared.setViewApplicationIndex(this.applicationList);
        const application = this.shared.getViewApplicationIndex();
        console.log("application", application);
        this.modalService.dismissAll();
        this.router.navigate(["/view-project-info"]);
      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllPendingApprovalPacksForUser() {
    
    this.applicationService.getApplicationsList(this.CurrentUser.appUserId, this.CurrentUserProfile[0].isInternal).subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationAlert = {} as Clarifications;
          const current = data.dateSet[i];
          
          if (current.createdById == this.CurrentUser.appUserId && current.currentStageName == "Approval Pack Generation") {
            tempApplicationAlert.ApplicationID = current.applicationID;
            tempApplicationAlert.Description = "Approval Pack Generation";
            tempApplicationAlert.ProjectNumber = current.projectNumber;

            this.ClarificationsList.push(tempApplicationAlert);

          }

          if (current.createdById == this.CurrentUser.appUserId && current.currentStageName == "PTW") {

            const hasDocs = await this.checkIfHasDocs(current.applicationID);
            

            if (hasDocs.length > 0 && (hasDocs.includes(false) == false)) {
              
              tempApplicationAlert.ApplicationID = current.applicationID;
              tempApplicationAlert.Description = "Consolidate Permit To Work";
              tempApplicationAlert.ProjectNumber = current.projectNumber;

              this.ClarificationsList.push(tempApplicationAlert);
            }

          }
        }
         //Request For Delete Kyle 22-02-24
        if (this.isEMB == true) {
          this.getAllRequestsForDeletes();
        }
        else {
          this.dataSourceClarifications = this.ClarificationsList;
          this.clarificationsTable?.renderRows();
          if (this.ClarificationsList.length > 0) {

            this.openClarificationsAlerts();
          }
        }
       
      }
      else {
        alert(data.responseMessage);
      }
      console.log("KyleKyleKyle", this.ClarificationsList);

    }, error => {
      console.log("Error: ", error);
    })
  }
  async checkIfHasDocs(applicationID: number): Promise<any> {
    try {
      const data: any = await this.permitService.getPermitSubForCommentByApplicationID(applicationID).toPromise();
      if (data.responseCode == 1) {
        this.permitHasDoc = [];
        for (let i = 0; i < data.dateSet.length; i++) {
          
          const current = data.dateSet[i].permitSubForCommentID;

          const dataDoc: any = await this.permitService.hasPermitSubForCommentDocuments(current).toPromise();
          if (dataDoc.responseCode == 1) {
            
            const hasDocs = dataDoc.dateSet.hasDocuments;

            this.permitHasDoc.push(hasDocs);

          }




        }
        console.log("has Documents", this.permitHasDoc, data);
        return this.permitHasDoc;

      } else {
        //alert(data.responseMessage);
        throw new Error(data.responseMessage);
      }
    } catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }
  //Request For Delete Kyle 22-02-24
  getAllRequestsForDeletes() {
    this.permitService.getAllRequestsForDelete().subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDeleteRequest = {} as Clarifications;
          const current = data.dateSet[i];

          tempDeleteRequest.ApplicationID = current.applicationID;
          tempDeleteRequest.Description = "Request for delete of permit for " + current.subDepartmentName;
          tempDeleteRequest.ProjectNumber = await this.getProjectNumberForApplication(current.applicationID);

          this.ClarificationsList.push(tempDeleteRequest);
        }
        this.dataSourceClarifications = this.ClarificationsList;
        this.clarificationsTable?.renderRows();
        if (this.ClarificationsList.length > 0) {

          this.openClarificationsAlerts();
        }
      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("Error: ", error);


    })
  }
}


