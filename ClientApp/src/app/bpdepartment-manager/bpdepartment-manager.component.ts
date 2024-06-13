import { Component, OnInit ,ViewChild} from '@angular/core';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { BPAccessGroupUserLinkService } from '../service/BPAccessGroupsUserLink/bpaccess-group-user-link.service';
import { BPAccessGroupsService } from '../service/BPAccessGroups/bpaccess-groups.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';

export interface UserProfileList {
  UserProfileID: number;
  UserID: string;
  FullName: string;
  Email: string;
  SubDepartmentName: string;
 
}

export interface AccessGroupsList {
  AccessGroupID: number;
  AccessGroupName: string;
  AccessGroupDescription: string;
  isLinked: boolean;
  AccessGroupUserLinkID: number;
}
@Component({
  selector: 'app-bpdepartment-manager',
  templateUrl: './bpdepartment-manager.component.html',
  styleUrls: ['./bpdepartment-manager.component.css']
})
export class BPDepartmentManagerComponent implements OnInit {

  constructor(private userProfileService: UserProfileService, private bpaccessGroupUserLinkService: BPAccessGroupUserLinkService, private bpAccessGroupService: BPAccessGroupsService, private modalService: NgbModal) { }

  internalUserList: UserProfileList[] = [];
  accessGroupList: AccessGroupsList[] = [];

  stringifiedData: any;
  CurrentUser: any;

  @ViewChild(MatTable) linkedUsersTable: MatTable<UserProfileList> | undefined;
  displayedColumns: string[] = ['userName', 'subDepartmentName', 'actions'];
  dataSource = this.internalUserList;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  functionalArea: string;
  subDepartmentName: string;

  selectedUser; any;
  accessGroupUserLinkID: number;

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    
    this.functionalArea = this.CurrentUserProfile[0].departmentName;
    this.subDepartmentName = this.CurrentUserProfile[0].subDepartmentName;
  }

  GetAllInternalUsers() {
    this.userProfileService.getInternalUsers().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempUser = {} as UserProfileList;

          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;

          this.internalUserList.push(tempUser);
        }

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  }
  onselectUser(index: any, accessGroups: any) {
    this.selectedUser = this.internalUserList[index];
    this.GetAllAccessGroupsAndUserLinks(accessGroups);
  }

  GetAllAccessGroupsAndUserLinks(accessGroups:any) {
    debugger;
    this.accessGroupList.splice(0, this.accessGroupList.length);
    this.bpAccessGroupService.getAllAccessGroupsAndUserLinks(this.selectedUser.UserProfileID, this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempAccessGroup = {} as AccessGroupsList;

          tempAccessGroup.AccessGroupID = current.accessGroupID;
          tempAccessGroup.AccessGroupName = current.accessGroupName;
          tempAccessGroup.AccessGroupDescription = current.accessGroupDescription;
          tempAccessGroup.AccessGroupUserLinkID = current.accessGroupUserLinkID;

          if (current.accessGroupUserLinkID == null || current.isActive == false) {
            tempAccessGroup.isLinked = false;
          }
          else {
            tempAccessGroup.isLinked = true;
          }
          this.accessGroupList.push(tempAccessGroup);
        
        }

        this.modalService.open(accessGroups, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  }
  
  getAllUsersForFunctionalArea(linkedUsers: any) {

    this.internalUserList.splice(0, this.internalUserList.length);
    this.userProfileService.getUsersForDepartmentAndSubDepartment(this.functionalArea, this.subDepartmentName).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempUser = {} as UserProfileList;
          debugger;
          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;
          tempUser.SubDepartmentName = this.subDepartmentName;

          this.internalUserList.push(tempUser);
        }
        debugger;
        this.dataSource = this.internalUserList;
        this.linkedUsersTable?.renderRows();
        this.modalService.open(linkedUsers, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  
  }

  linkUserToAccessgroup(index: any, accessGroups: any) {
    debugger;
    const accessGroup = this.accessGroupList[index];

    if (accessGroup.AccessGroupUserLinkID == null) {
      debugger;
      this.accessGroupUserLinkID = 0;
    }
    else {
      debugger;
      this.accessGroupUserLinkID = accessGroup.AccessGroupUserLinkID;
    }
    debugger;
    this.bpaccessGroupUserLinkService.addUpdateAccessGroupUserLink(this.accessGroupUserLinkID, accessGroup.AccessGroupID, accessGroup.AccessGroupName, null, null, this.subDepartmentName, this.selectedUser.UserID, this.CurrentUser.appUserId, this.functionalArea, this.subDepartmentName, this.selectedUser.UserProfileID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        alert(data.responseMessage);
        this.GetAllAccessGroupsAndUserLinks(accessGroups);
      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log(error);
    
    })
  }

  unlinkUserFromAccessGroup(index: any, accessGroups: any) {
    const accessGroup = this.accessGroupList[index];

    this.bpaccessGroupUserLinkService.deleteUserFromAccessGroup(accessGroup.AccessGroupUserLinkID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        alert(data.responseMessage);
        this.GetAllAccessGroupsAndUserLinks(accessGroups);
      }
      else {
        alert(data.responseMessage);

      }
    }, error => {
      console.log(error);
    
    })
  }
}
