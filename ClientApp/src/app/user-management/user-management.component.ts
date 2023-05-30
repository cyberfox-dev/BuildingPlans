import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { asyncScheduler } from 'rxjs';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { ZonesService } from '../service/Zones/zones.service';

export interface UserList {
  userProfileID: any;
  userId: any;
  idNumber: string;
  fullName: string;
  zoneName: string;
  ZoneID: any;
}
export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
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
  selectedUsersubDepID: number;
  selectedUserZoneID: number;
  selectedUserAccessGroupID: any;
  accessGroupName = '';

  UserList: UserList[] = [];
  UserProfile: UserProfile[] = [];
  AccessGroupList: AccessGroupList[] = [];
  ZoneList: ZoneList[] = [];

  displayedColumnsLinkUsers: string[] = [ 'fullName','zoneName', 'actions'];
  dataSourceLinkUsers = this.UserList;

  @ViewChild(MatTable) UserListTable: MatTable<UserList> | undefined;
    ZoneID: any;
    accessGroupID: any;

  constructor(private userPofileService: UserProfileService, private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private zoneService: ZonesService, private zoneLinkService: ZoneLinkService) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getUserProfileByUserID();
    this.getAllusersNotLinkedToDep();


  }

  openAssignModal(content, index: any) {

    this.selectedUserIndex = this.UserList[index].userProfileID;
    this.selectedUserZoneID = this.UserList[index].ZoneID;
   /* this.selectedUserAccessGroupID = this.AccessGroupList[0].AccessGroupID;*/
   /* this.getAllZonesByZoneID();*/

    this.modalService.open(content, { centered: true, size: 'lg' });
    console.log("FSDFJNISDFSDFJNISFDJNISFDSDFJISDF", this.selectedUsersubDepID, this.selectedUserZoneID);
  }

  async getZoneByZoneId(zoneID: any): Promise<string> {
    try {
      const data: any = await this.zoneService.getZoneByZoneID(zoneID).toPromise();
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        return current.zoneName;
      } else {
        alert(data.responseMessage);
        throw new Error(data.responseMessage);
      }
    } catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }

  getAllusersNotLinkedToDep() {



    /* this.UserList.splice(0, this.UserList.length);    this.zoneService.getZoneByZoneID(tempZoneList.ZoneID)*/
     this.userPofileService.getAllUsersToLinkToDep(this.UserProfile[0].depID).subscribe(async (data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          
          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;
          tempZoneList.userProfileID = current.userProfileID;
          tempZoneList.ZoneID = current.zoneID;


          const zoneName: string = await this.getZoneByZoneId(current.zoneID);

          tempZoneList.zoneName = zoneName;

        

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
    /*this.userPofileService.userGainsApproval(this.selectedUserIndex).subscribe((data: any) => {
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



*/

  }


  getAccesGroupID(event: any) {

    this.accessGroupID = event.target.value;
    console.log("SDFSDFSDSDFSDFDSf",this.accessGroupID)
  }


  approveTheUser() {

    //This is for the the zone linking

    this.zoneService.getZoneByZoneID(this.selectedUserZoneID).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
       

          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[0];
          tempZoneList.departmentID = current.departmentID;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.zoneName = current.zoneName;
          this.ZoneList.push(tempZoneList);

          this.zoneLinkService.addUpdateZoneLink(0, this.UserProfile[0].depID, this.selectedUserZoneID, tempZoneList.subDepartmentID, this.selectedUserIndex.toString(), null, this.CurrentUser.appUserId).subscribe((data: any) => {
            ;
            if (data.responseCode == 1) {
              alert(data.responseMessage);
            }
            else {
              alert(data.responseMessage);
            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
        

        console.log("Got All ZONES", this.ZoneList);
      
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

    //this is for the access group linking



    this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.accessGroupID, this.selectedUserIndex.toString(), this.CurrentUser.appUserId).subscribe((data: any) => {
      ;
      if (data.responseCode == 1) {
        alert(data.responseMessage);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    //this is for acppeting the user into the department
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





