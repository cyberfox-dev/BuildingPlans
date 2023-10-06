import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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


export interface NotificationsList {
  NotificationID: number;
  NotificationName: string;
  NotificationDescription: string;
  ApplicationID: number;
  UserID: number;
  IsRead: boolean;
  DateCreated: string;
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
  Message: any;
}



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

  constructor(private modalService: NgbModal, private sharedService: SharedService, private userProfileService: UserProfileService, private notificationService: NotificationsService, private applicationService: ApplicationsService, private hhtp: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.openModal(this.content);
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));

    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllNotifications();
    this.getAllReadNotifications();
    this.getUserInfo();

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
    this.notificationService.getNotificationByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {
      
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


            this.OldNotificationsList.push(tempNotificationsList);
          }
          // this.sharedService.setStageData(this.StagesList);
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

  getSelectedNotification(applicationID: number ) {


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
          this.notificationService.addUpdateNotification(tempNotificationsList.NotificationID, tempNotificationsList.NotificationName, tempNotificationsList.NotificationDescription, tempNotificationsList.IsRead, null, null, tempNotificationsList.ApplicationID, tempNotificationsList.Message).subscribe((data: any) => {

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

          this.ApplicationID = current.applicationID;
          this.MessageList = tempNotificationsList;

        }

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      console.log("notification", this.MessageList)
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
  getAllNotifications() {

    this.NotificationsList.splice(0, this.NotificationsList.length);
    this.notificationService.getNotificationByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {
      debugger;
      
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
  onClose() {
    this.modalService.dismissAll();
  }
  onRefreshModal() {
    debugger;
    this.modalService.dismissAll();
    this.openModal(this.content);
    this.getAllNotifications();
    this.getAllReadNotifications();
  }
  
  getUserInfo() {
    debugger;
    this.userProfileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {
      const current = data.dateSet[0];
      if (data.responseCode == 1) {
        debugger;
        this.internalUser = current.isInternal;
        this.fullName = current.fullName;
      }
      else {
        debugger;
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      debugger;
      console.log("Error: ", error);
    })
  }
}


