import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { asyncScheduler } from 'rxjs';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';

export interface UserList {
  userProfileID: any;
  userId: any;
  idNumber: string;
  fullName: string;

}

export interface UserProfile {

  userId: any;
  fullName: string;
  depID: number;

}

export interface AccessGroupList {
  AccessGroupID: number,
  AccessGroupName: string,
}


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  CurrentUser: any;
  stringifiedData: any;
  selectedUserIndex: number;

  UserList: UserList[] = [];
  UserProfile: UserProfile[] = [];
  AccessGroupList: AccessGroupList[] = [];

  displayedColumnsLinkUsers: string[] = ['idNumber', 'fullName', 'actions'];
  dataSourceLinkUsers = this.UserList;

  @ViewChild(MatTable) UserListTable: MatTable<UserList> | undefined;

  constructor(private userPofileService: UserProfileService, private modalService: NgbModal, private accessGroupsService: AccessGroupsService) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getUserProfileByUserID();
    /*   this.getAllusersNotLinkedToDep();*/
    this.getAllAccessGroup();

  }

  openAssignModal(content, index: any) {

    this.selectedUserIndex = this.UserList[index].userProfileID;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  getAllusersNotLinkedToDep() {

/* this.UserList.splice(0, this.UserList.length);*/
  

     this.userPofileService.getAllUsersToLinkToDep(this.UserProfile[0].depID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          
          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;
          tempZoneList.userProfileID = current.userProfileID;


          this.UserList.push(tempZoneList);
        }
        this.UserListTable?.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }


  getUserProfileByUserID() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempUserProfileList = {} as UserProfile;
          const current = data.dateSet[i];
          tempUserProfileList.userId = current.userID;
          tempUserProfileList.depID = current.departmentID;
          tempUserProfileList.fullName = current.fullName;
          this.UserProfile.push(tempUserProfileList);
        }
        console.log("THis is the logged in user dep iD", this.UserProfile[0].depID);
        this.getAllusersNotLinkedToDep();
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllAccessGroup() {
    this.AccessGroupList.splice(0, this.AccessGroupList.length);
    this.accessGroupsService.getAllAccessGroups().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAccessGroupList = {} as AccessGroupList;
          const current = data.dateSet[i];
          tempAccessGroupList.AccessGroupID = current.accessGroupID;
          tempAccessGroupList.AccessGroupName = current.accessGroupName;
          this.AccessGroupList.push(tempAccessGroupList);

        }

        console.log("Got All Access Groups", this.AccessGroupList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AcceptUser() {
    console.log("This is the index of the selected user:", this.selectedUserIndex);
    this.userPofileService.userGainsApproval(this.selectedUserIndex).subscribe((data: any) => {
      this.UserList.splice(0, this.UserList.length);

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.getAllusersNotLinkedToDep();
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
