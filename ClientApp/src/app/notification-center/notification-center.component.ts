import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core'; //routeToProject
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
import { ApplicationsService } from '../service/Applications/applications.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { concat } from 'rxjs';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';

export interface NotificationsList {
  NotificationID: number;
  NotificationName: string;
  NotificationDescription: string;
  ApplicationID: number;
  UserID: number;
  IsRead: boolean;
  DateCreated: string;
  DateCreatedwithTIME: string;
  Message: string;
}
export interface OldNotificationsList {
  NotificationID: number;
  NotificationName: string;
  NotificationDescription: string;
  ApplicationID: number;
  UserID: number;
  IsRead: boolean;
  DateCreated: string;
  DateCreatedwithTIME: string;
  Message: any;
}
//#region routingToProject
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
  UserID: any;
  clientAlternativeEmail: string; // chekingNotifications Sindiswa 13 February 2024
  NetworkLicensees: any;
  ContractorAccountDetails: string; //zxNumberUpdate Sindiswa 01 March 2024
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
  isEscalated: boolean; //escalation Sindiswa 29 January 2024
  EscalationDate: any; //escalation Sindiswa 31 January 2024
  EMBActionDate: any; //escalation Sindiswa 31 January 2024
}
//#endregion

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})

export class NotificationCenterComponent implements OnInit {
  @ViewChild("Notifications", { static: true }) content!: ElementRef;
  @ViewChild("Internal", { static: true }) Internal!: ElementRef;
  @ViewChild("External", { static: true }) External!: ElementRef;
  OldNotificationsList: OldNotificationsList[] = [];
  NotificationsList: NotificationsList[] = [];
  stringifiedData: any;
  CurrentUser: any;
  ApplicationID: number;
  MessageList: any;
  fullName: string;
  projectNumber: number;
  internalUser: boolean;

  viewNotification: any;

  constructor(private modalService: NgbModal, private sharedService: SharedService, private userProfileService: UserProfileService, private notificationService: NotificationsService, private applicationService: ApplicationsService, private hhtp: HttpClient, private router: Router, private dialog: MatDialog, /*routeToProject*/
    private viewContainerRef: ViewContainerRef) { }
 fakeDatenow: any = new Date();
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));

    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllNotifications();
    this.getAllReadNotifications();
    this.getUserInfo();

    console.log(`This is the time now${this.fakeDatenow}`)
  }

  openModal(Notifications: any) {
    this.modalService.open(Notifications, { size: 'xl' });
  }
  openNotificationExternal(External: any) {
    this.modalService.open(External, { size: 'xl' });
  }
  openNotificationInternal(Internal: any) {
    this.modalService.open(Internal, { size: 'xl' });
  }
  getAllReadNotifications() {

   
    this.OldNotificationsList.splice(0, this.OldNotificationsList.length);
    // checkingNotifications Sindiswa 12 February 2024
    //this.notificationService.getNotificationByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {
    /*const firstObservable = this.notificationService.getNotificationByUserID(this.CurrentUser.appUserId);
 const secondObservable = this.notificationService.getNotificationsForUserID(this.CurrentUser.appUserId);

   concat(firstObservable, secondObservable).subscribe(*/
    this.notificationService.getNotificationsForUserID(this.CurrentUser.appUserId).subscribe(
      (data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempNotificationsList = {} as OldNotificationsList;
          const current = data.dateSet[i];
          console.log(current);
          if (current.isRead == true) {

            const date = current.dateCreated;
            tempNotificationsList.ApplicationID = current.applicationID;
            tempNotificationsList.NotificationID = current.notificationID;
            tempNotificationsList.NotificationName = current.notificationName;
            tempNotificationsList.NotificationDescription = current.notificationDescription;
            tempNotificationsList.DateCreated = current.dateCreated.substring(0, date.indexOf('T'));
            tempNotificationsList.DateCreatedwithTIME = current.dateCreated;

            this.OldNotificationsList.push(tempNotificationsList);
          }
          // this.sharedService.setStageData(this.StagesList);
          this.NotificationsList.sort((a, b) => {
            return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
          });

          this.OldNotificationsList.sort((a, b) => {
            return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
          });
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  close() {
    this.dialog.open(NotificationCenterComponent, {
      width: '70%',
      maxHeight: 'calc(100vh - 90px)',
      height: 'auto'
    });
  }

  getSelectedNotificationNew(notificationID: number) {
    this.dialog.closeAll();

    this.NotificationsList.splice(0, this.NotificationsList.length);
    this.notificationService.getNotificationByNotificationID(notificationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        console.log("This is the selected notification:", data.dateSet);
        const current = data.dateSet[0];


        if (current.isRead == false) {
          const tempNotificationsList = {} as NotificationsList;

          const date = current.dateCreated;
          tempNotificationsList.ApplicationID = current.applicationID;
          tempNotificationsList.NotificationName = current.notificationName;
          tempNotificationsList.NotificationDescription = current.notificationDescription;
          tempNotificationsList.NotificationID = current.notificationID;
          tempNotificationsList.Message = current.message;
          tempNotificationsList.IsRead = true;
          tempNotificationsList.UserID = current.userID;

          this.ApplicationID = current.applicationID;
          this.MessageList = tempNotificationsList;
          // checkingNotifications Sindiswa 12 February 2024
          this.notificationService.addUpdateNotification(tempNotificationsList.NotificationID, tempNotificationsList.NotificationName, tempNotificationsList.NotificationDescription, tempNotificationsList.IsRead, null, tempNotificationsList.ApplicationID, null, tempNotificationsList.Message).subscribe((data: any) => {

            if (data.responseCode == 1) {
              /*alert(data.responseMessage);*/

            }
            else {
              alert(data.responseMessage);
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })



          this.OldNotificationsList = [];

        }
        else {
          const tempNotificationsList = {} as NotificationsList;
          const date = current.dateCreated;
          tempNotificationsList.NotificationName = current.notificationName;
          tempNotificationsList.NotificationDescription = current.notificationDescription;
          tempNotificationsList.ApplicationID = current.applicationID;
          tempNotificationsList.NotificationID = current.notificationID;
          tempNotificationsList.Message = current.message;
          tempNotificationsList.DateCreatedwithTIME = current.dateCreated;

          this.ApplicationID = current.applicationID;
          this.MessageList = tempNotificationsList;

        }

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      console.log("notification", this.MessageList);
      this.NotificationsList.sort((a, b) => {
        return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
      });
    
        this.OldNotificationsList.sort((a, b) => {
      return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
    });




    }, error => {
      console.log("Error: ", error);
    })
    if (this.internalUser === true) {
      this.openNotificationInternal(this.Internal);
    }
    else {
      this.openNotificationExternal(this.External)
    }
  }
  getSelectedNotification(applicationID: number) {
    this.dialog.closeAll();

    this.NotificationsList.splice(0, this.NotificationsList.length);
    this.notificationService.getNotificationByID(applicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        const current = data.dateSet[0];


        if (current.isRead == false) {
          const tempNotificationsList = {} as NotificationsList;

          const date = current.dateCreated;
          tempNotificationsList.ApplicationID = current.applicationID;
          tempNotificationsList.NotificationName = current.notificationName;
          tempNotificationsList.NotificationDescription = current.notificationDescription;
          tempNotificationsList.NotificationID = current.notificationID;
          tempNotificationsList.Message = current.message;
          tempNotificationsList.IsRead = true;
          tempNotificationsList.UserID = current.userID;

          this.ApplicationID = current.applicationID;
          this.MessageList = tempNotificationsList;
          // checkingNotifications Sindiswa 12 February 2024
          this.notificationService.addUpdateNotification(tempNotificationsList.NotificationID, tempNotificationsList.NotificationName, tempNotificationsList.NotificationDescription, tempNotificationsList.IsRead, null, tempNotificationsList.ApplicationID, null, tempNotificationsList.Message).subscribe((data: any) => {

            if (data.responseCode == 1) {
              /*alert(data.responseMessage);*/

            }
            else {
              alert(data.responseMessage);
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })



          this.OldNotificationsList = [];

        }
        else {
          const tempNotificationsList = {} as NotificationsList;
          const date = current.dateCreated;
          tempNotificationsList.NotificationName = current.notificationName;
          tempNotificationsList.NotificationDescription = current.notificationDescription;
          tempNotificationsList.ApplicationID = current.applicationID;
          tempNotificationsList.NotificationID = current.notificationID;
          tempNotificationsList.Message = current.message;
          tempNotificationsList.DateCreatedwithTIME = current.dateCreated;

          this.ApplicationID = current.applicationID;
          this.MessageList = tempNotificationsList;

        }

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      console.log("notification", this.MessageList);
      this.NotificationsList.sort((a, b) => {
        return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
      });
    
        this.OldNotificationsList.sort((a, b) => {
      return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
    });




    }, error => {
      console.log("Error: ", error);
    })
    if (this.internalUser === true) {
      this.openNotificationInternal(this.Internal);
    }
    else {
      this.openNotificationExternal(this.External)
    }
  }

  getApplicationForNotification(applicationID: number) {



    this.applicationService.getApplicationsByApplicationID(applicationID).subscribe((data: any) => {
      if (data.responseCode === 1) {

        const current = data.dateSet[0];
        this.fullName = current.fullName;
        this.ApplicationID = current.applicationID;
        this.projectNumber = current.projectNumber;

      } else {
       
        alert(data.responseMessage);
      }
     
      console.log("response", data);
    }, error => {
     
      console.log("Error", error);

    })

  }
  // #region escalation Sindiswa 30 January 2024
  /*
  getAllNotifications() {

    this.NotificationsList.splice(0, this.NotificationsList.length);
    this.notificationService.getNotificationByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {
      
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempNotificationsList = {} as NotificationsList;
          const current = data.dateSet[i];
          console.log(current);
          if (current.isRead == false) {

            const date = current.dateCreated;
            tempNotificationsList.ApplicationID = current.applicationID;
            tempNotificationsList.NotificationID = current.notificationID;
            tempNotificationsList.NotificationName = current.notificationName;
            tempNotificationsList.NotificationDescription = current.notificationDescription;
            tempNotificationsList.DateCreated = current.dateCreated.substring(0, date.indexOf('T'));


            this.NotificationsList.push(tempNotificationsList);
          }
          // this.sharedService.setStageData(this.StagesList);
          this.NotificationsList.sort((a, b) => {
            return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
          });

          this.OldNotificationsList.sort((a, b) => {
            return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
          });
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
    // #region escalation Sindiswa 30 January 2024
    this.notificationService.getNotificationsForUserID(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempNotificationsList = {} as NotificationsList;
          const current = data.dateSet[i];
          console.log(current);
          if (current.isRead == false) {

            const date = current.dateCreated;
            tempNotificationsList.ApplicationID = current.applicationID;
            tempNotificationsList.NotificationID = current.notificationID;
            tempNotificationsList.NotificationName = current.notificationName;
            tempNotificationsList.NotificationDescription = current.notificationDescription;
            tempNotificationsList.DateCreated = current.dateCreated.substring(0, date.indexOf('T'));


            this.NotificationsList.push(tempNotificationsList);
          }
          // this.sharedService.setStageData(this.StagesList);
          this.NotificationsList.sort((a, b) => {
            return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
          });

          this.OldNotificationsList.sort((a, b) => {
            return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
          });
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
    // #endregion
  }*/


  getAllNotifications() {
    
  this.NotificationsList.splice(0, this.NotificationsList.length);

    /* checkingNotifications Sindiswa 13 February 2024, now that UserID and CreatedByID aren't made null randomly, can now fetch ONLY notifications FOR human
       Wait, what's going to happen to everything that happened before this though? DZIN DZIN - Welp, I'm just going to go ahead and assume everyone is all caught up */

  /*const firstObservable = this.notificationService.getNotificationByUserID(this.CurrentUser.appUserId);
  const secondObservable = this.notificationService.getNotificationsForUserID(this.CurrentUser.appUserId);

    concat(firstObservable, secondObservable).subscribe(*/
    this.notificationService.getNotificationsForUserID(this.CurrentUser.appUserId).subscribe(
    (data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempNotificationsList = {} as NotificationsList;
          const current = data.dateSet[i];

          if (current.isRead == false) {
            const date = current.dateCreated;
            tempNotificationsList.ApplicationID = current.applicationID;
            tempNotificationsList.NotificationID = current.notificationID;
            tempNotificationsList.NotificationName = current.notificationName;
            tempNotificationsList.NotificationDescription = current.notificationDescription;
            tempNotificationsList.DateCreated = current.dateCreated.substring(0, date.indexOf('T'));
            tempNotificationsList.DateCreatedwithTIME = current.dateCreated;

            this.NotificationsList.push(tempNotificationsList);
          }
        }

        this.NotificationsList.sort((a, b) => {
          return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
        });

        this.OldNotificationsList.sort((a, b) => {
          return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
        });
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    },
    error => {
      console.log("Error: ", error);
    }
  );
}

// #endregion
  onClose() {
    this.modalService.dismissAll();
  }
  onRefreshModal() {
    
    
    this.modalService.dismissAll();

    this.getAllNotifications();
    this.getAllReadNotifications();
   
  }
  //#region notifications Sindiswa 12 February 2024
  updateCount() {
    window.location.reload(); // Uhh, there has to be a better way
  }
  //#endregion
  getUserInfo() {
    
    this.userProfileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {
      const current = data.dateSet[0];
      if (data.responseCode == 1) {
        
        this.internalUser = current.isInternal;
        this.fullName = current.fullName;
      }
      else {
        
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      
      console.log("Error: ", error);
    })
  }

  // #region notifications Sindiswa 31 January 2024 - turns out I DIDN"T EVEN NEED A NEW METHOD, the issue was the substring time... Oh, well!
  /*getTimeAgo(dateCreated: string): string {
    const now = new Date();
    const createdDate = new Date(dateCreated + 'T00:00:00Z'); // Assume the time part is always 00:00:00 UTC
    const timeDifference = now.getTime() - createdDate.getTime();

    // Calculate hours and days
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    } else {
      const daysAgo = Math.floor(hoursAgo / 24);
      return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    }
  }*/

  getTimeAgo(dateCreated: string): string {
    const now: any = new Date();
    const createdDate: any = new Date(dateCreated);

    // Check if it's a future date
    if (isNaN(createdDate.getTime()) || createdDate > now) {
      return 'In the future';
    }

    const timeDifferenceMinutes = Math.floor((now - createdDate) / (1000 * 60));

    if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes} minute${timeDifferenceMinutes !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    if (timeDifferenceHours < 24) {
      return `${timeDifferenceHours} hour${timeDifferenceHours !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);
    return `${timeDifferenceDays} day${timeDifferenceDays !== 1 ? 's' : ''} ago`;
  }

  //#endregion

  // #region routingToProject Sindiswa 
  specificApplication: ApplicationList[] = [];
  Applications: ApplicationsList[] = [];
  public canReapply: boolean = false;
  goToApplication(appID: any) {
    
    this.applicationService.getApplicationsByApplicationID(appID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempApplicationList = {} as ApplicationsList;
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

          tempApplicationListShared.UserID = current.userID;
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
          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

          //#region escalation Sindiswa 31 January 2024
          tempApplicationList.isEscalated = current.isEscalated;
          tempApplicationList.EscalationDate = current.escalationDate;
          tempApplicationList.EMBActionDate = current.embActionDate;
          //#endregion

         

          this.specificApplication.push(tempApplicationListShared);
          this.Applications.push(tempApplicationList);
        }


        console.log("Hi, from notifications 1", this.specificApplication);
        if (data.dateSet.length < 3) {

          this.canReapply = true;
          this.sharedService.setCanReapply(true);
        } else {
          this.canReapply = false;
          this.sharedService.setCanReapply(false);
        }

        this.viewSpecificProject();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    

    }, error => {
      console.log("Error: ", error);
    })

  }

  viewSpecificProject() {
    this.sharedService.getShowFormerApps();
    //this.specificApplication.push(this.specificApplication[0]);
    console.log("Hi, from notifications 2", this.specificApplication);
    this.sharedService.setViewApplicationIndex(this.specificApplication);

    this.viewContainerRef.clear();
    this.router.navigate(["/view-project-info"]);
  }
  //#endregion
}



