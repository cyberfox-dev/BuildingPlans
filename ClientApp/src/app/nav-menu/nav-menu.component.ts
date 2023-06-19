import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentConfigComponent } from 'src/app/department-config/department-config.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from '../shared/shared.service';
import { RolesService } from '../service/Roles/roles.service';
import { MatTable } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';


export interface CommentList {
  CommentID: number;
  Comment: string;
  DateCreated: string;
  createdBy:any;
}
export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}

export interface NotificationsList {
  NotificationID: number;
  NotificationName: string;
  NotificationDescription: string;
  ApplicationID: number;
  UserID: number;
  DateCreated: string;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  configShow: number | undefined;
  notiBell = true;
  CommentList: CommentList[] = [];
  NotificationsList: NotificationsList[] = [];
  RolesList: RolesList[] = [];
  forEditIndex: any;

  cyberfoxConfigs: boolean = false;
  Configurations: boolean = false;
  CommentBuilder: boolean = false;

  public isInternalUser: boolean = false;
  Links: boolean = false;
  Icons: boolean = true;
  public addComment = this.formBuilder.group({
    newCommentName: ['', Validators.required],

  })

  public editComments = this.formBuilder.group({
    editCommentName: ['', Validators.required],
  })
    applica: any;
    UserRoles: import("C:/CyberfoxProjects/WayleaveManagementSystem/ClientApp/src/app/shared/shared.service").RolesList[];

  constructor(private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private router: Router, private shared: SharedService, private formBuilder: FormBuilder, private commentService: CommentBuilderService, private userPofileService: UserProfileService, private notificationsService: NotificationsService) { }

  displayedColumns: string[] = ['Comment', 'actions'];
  dataSource = this.CommentList;


  @ViewChild(MatTable) commentTable: MatTable<CommentList> | undefined;

  stringifiedData: any;
  CurrentUser: any;

  ngOnInit() {
    
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
/*    this.getUserProfileByUserID();*/

    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getRolesLinkedToUser();
/*    this.UserRoles = this.shared.getCurrentUserRoles();*/
    /*    this.setCurrentUserRoles();*/
 
    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log(this.CurrentUser);
    }

  }

  lockViewAccordingToRoles() {
  
    console.log("werwerwerrwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwererwer", this.RolesList);
    
    for (var i = 0; i < this.RolesList.length; i++) {
      
      if (this.RolesList[i].RoleName == "Developer Config") {
        this.Configurations = true;
      }
      if (this.RolesList[i].RoleName == "Developer Config" || this.RolesList[i].RoleName == "Configuration") {
        this.cyberfoxConfigs = true;
      }
    }


  }


  getRolesLinkedToUser() {
   
    this.RolesList.splice(0, this.RolesList.length);

    this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.AccessGroupName = current.accessGroupName;
          tempRolesList.AccessGroupID = current.accessGroupID;
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;

          this.RolesList.push(tempRolesList);
          this.lockViewAccordingToRoles();


        }

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

  setCurrentUserRoles() {
    
    this.RolesList[0].RoleName = this.UserRoles[0].RoleName;
    this.RolesList[0].RoleID = this.UserRoles[0].RoleID;

    console.log("SJDHFKSHFKJSDJKFHJKSDFHKLDFSHKSDJFHLKJSDFHLKJSDFKSDFSDFSDFSDFSDF", this.RolesList)
  }

  getUserProfileByUserID() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      
      if (data.responseCode == 1) {


        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;

        if (currentUserProfile.isInternal == true) {

          this.isInternalUser = true;

        }
        else {
          this.isInternalUser = false;
         
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


  onCommentCreate(commentBuilder: any) {
    let newCommentName = this.addComment.controls["newCommentName"].value;
   

    this.CommentList.splice(0, this.CommentList.length);
 
    this.commentService.addUpdateComment(null, newCommentName,this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.addComment.controls["newCommentName"].setValue(null);
        this.getAllCommentsByUserID(commentBuilder);
      }
      else {
        alert("Please type a comment");
      }
      alert(data.responseMessage);
 
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  getAllCommentsByUserID(commentBuilder: any) {
   

    

      this.CommentList.splice(0, this.CommentList.length);

      this.commentService.getCommentByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempCommentList = {} as CommentList;
            const current = data.dateSet[i];
            tempCommentList.CommentID = current.commentID;
            tempCommentList.Comment = current.commentName;
            tempCommentList.DateCreated = current.dateCreated;


            this.CommentList.push(tempCommentList);

          }

          this.commentTable?.renderRows();
          this.closeCommentBuilder(commentBuilder);
          this.openCommentBuilder(commentBuilder);

          console.log("Got all comments", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }

        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }

  

  onCommentDelete(index: any, commentBuilder: any) {
    console.log(this.CommentList[index].Comment);
    if (confirm("Are you sure to delete " + this.CommentList[index].Comment + "?")) {

      this.commentService.deleteComment(Number(this.CommentList[index].CommentID)).subscribe((data: any) => {
        this.CommentList.splice(0, this.CommentList.length);

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllCommentsByUserID(commentBuilder);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })


    }
  }

  onCommentEdit(index: any, commentBuilder: any, editComment: any) {

  }
  onEditCommentSave(commentBuilder: any) {
    let editCommentName = this.editComments.controls["editCommentName"].value;
    this.commentService.addUpdateComment(this.CommentList[this.forEditIndex].CommentID.toString(), editCommentName, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllCommentsByUserID(commentBuilder);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  //refresh() {
  //  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //    this.router.navigate([this.router.url]));
  //  location.reload();
  //}

  LogoutUser() {
    this.router.navigate(["/"]);
    localStorage.removeItem('LoggedInUserInfo');
    localStorage.removeItem('userProfile');

  }
/*routes for nav buttons*/
  goToConfig() {
    this.router.navigate(["/configuration"]);
  }

  goToSettings() {
    this.router.navigate(["/user-settings"]);
  }
  goToCyberfoxCofig() {
    this.router.navigate(["/cyberfox-config"]);
  }
/*This is to open the comment buider modal*/
  openCommentBuilder(commentBuilder:any) {
    this.modalService.open(commentBuilder, { centered:true,size: 'xl' });
  }

  closeCommentBuilder(commentBuilder: any) {
    this.modalService.dismissAll(commentBuilder);
  }
/*this is to open the notifications modal*/

  openNotificationsModal(notificationsCenter: any) {
    this.notiBell = false;
    this.modalService.open(notificationsCenter, { centered: true, size: 'xl' });
  }
  /*Notifications*/

  openCreateNewComment(createNewComment : any) {
    this.modalService.open(createNewComment, { centered: true, size: 'lg' });
  }
  viewEditComment(editComment: any, index: any) {
    this.editComments.controls["editCommentName"].setValue(this.CommentList[index].Comment);
    this.forEditIndex = index;
    this.modalService.open(editComment, { centered: true, size: 'lg' });
  }

  collapse() {
    this.isExpanded = false;
  } 

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.modalService.open(DepartmentConfigComponent);
  }

  openXl(content: any) {
		this.modalService.open(content, { size: 'xl' });
  }


  goHome() {
    this.router.navigate(["/home"]);
  }

  getAllNotifications() {
    this.applica = 3023;

    this.NotificationsList.splice(0, this.NotificationsList.length);
    this.notificationsService.getNotificationByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempNotificationsList = {} as NotificationsList;
          const current = data.dateSet[i];
          console.log(current);
          const date = current.dateCreated;
          tempNotificationsList.ApplicationID = current.applicationID;
          tempNotificationsList.NotificationID = current.notificationID;
          tempNotificationsList.NotificationName = current.notificationName;
          tempNotificationsList.NotificationDescription = current.notificationDescription;
          tempNotificationsList.DateCreated = date.substring(0, date.indexOf('T'));


          this.NotificationsList.push(tempNotificationsList);
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

  disableIcons() {

    this.Icons = false;
    if (this.Links == false) {
      this.Links = true

    }
    else {
      this.Links = false
    }
  }


  
}
