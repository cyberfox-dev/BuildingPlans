import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { asyncScheduler } from 'rxjs';
import { forkJoin } from 'rxjs';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { ZonesService } from '../service/Zones/zones.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { Observable } from 'rxjs';
import { DepartmentsService } from '../service/Departments/departments.service';


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

export interface RolesList {
  RoleID: number;
  RoleName: string;
  RoleType: string;
  RoleDescription: string;
}

export interface TheirRolesList {
  RoleName: string;
}

export interface ZoneLinkList {
  userID: string;
  fullName: string;
  departmentName: string;
  subdepartmentName: string;
  zoneName: string;
  isZoneAdmin: string;
  isDepartmentAdmin: string; 
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


  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  ZoneLinkList: ZoneLinkList[] = [];

  displayedColumnsLinkUsers: string[] = ['fullName', 'zoneName', 'actions'];
  dataSourceLinkUsers = this.UserList;

  @ViewChild(MatTable) UserListTable: MatTable<UserList> | undefined;
  ZoneID: any;
  accessGroupID: any;
  loggedInUsersSubDepartmentID: any;
  loggedInUsersDepartmentID: number;

  constructor(private userPofileService: UserProfileService, private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private zoneService: ZonesService, private zoneLinkService: ZoneLinkService, private subDepartmentService: SubDepartmentsService, private departmentService: DepartmentsService) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));

    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersDepartmentID = this.CurrentUserProfile[0].departmentID;
    console.log('User Information???????????????????????????????????????????', this.CurrentUser);
    this.getUserProfileByUserID();
    this.loggedInUserDepartment();
    this.showLinkedUsers();
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
  openNewUserModal(newUser) {
    this.modalService.open(newUser, { centered: true, size: 'lg' });
  }
  openAllUsersModal(allUsers) {
    this.modalService.open(allUsers, { centered: true, size: 'xl' });
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

    debugger;

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

  userDepartmentID: any = '';

  getUserProfileByUserID() {
    debugger;
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempUserProfileList = {} as UserProfile;
          const current = data.dateSet[i];
          tempUserProfileList.userId = current.userID;
          tempUserProfileList.depID = current.departmentID;
          tempUserProfileList.fullName = current.fullName;
          this.UserProfile.push(tempUserProfileList);
        }
        console.log("DepartmentID????");
        console.log("THis is the logged in user dep iD", this.UserProfile[0].depID);

        this.userDepartmentID = this.UserProfile[0].depID;
        this.getAllusersNotLinkedToDep();
        //this.showLinkedUsers();
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
    console.log("SDFSDFSDSDFSDFDSf", this.accessGroupID)
  }


  approveTheUser() {

    //This is for the the zone linking

    //this.zoneService.getZoneByZoneID(this.selectedUserZoneID).subscribe((data: any) => {

    //  if (data.responseCode == 1) {


    //    const tempZoneList = {} as ZoneList;
    //    const current = data.dateSet[0];
    //    tempZoneList.departmentID = current.departmentID;
    //    tempZoneList.subDepartmentID = current.subDepartmentID;

    //    tempZoneList.zoneName = current.zoneName;
    //    this.ZoneList.push(tempZoneList);

    //    this.zoneLinkService.addUpdateZoneLink(0, this.UserProfile[0].depID, this.selectedUserZoneID, tempZoneList.subDepartmentID, this.selectedUserIndex.toString(), null, this.CurrentUser.appUserId).subscribe((data: any) => {
    //      ;
    //      if (data.responseCode == 1) {
    //        alert(data.responseMessage);
    //      }
    //      else {
    //        alert(data.responseMessage);
    //      }
    //      console.log("reponse", data);

    //    }, error => {
    //      console.log("Error: ", error);
    //    })


    //    console.log("Got All ZONES", this.ZoneList);

    //  }
    //  else {
    //    alert(data.responseMessage);
    //  }
    //  console.log("reponse", data);

    //}, error => {
    //  console.log("Error: ", error);
    //})

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

  @ViewChild(MatTable) ZoneDepTable: MatTable<ZoneLinkList> | undefined;
  displayedColumnsZoneLinks: string[] = ['fullName', 'departmentName', 'subdepartmentName', 'zoneName', 'isZoneAdmin', 'isDepartmentAdmin', 'actions'];
  dataSourceZoneLink = this.ZoneLinkList;

  //dynamic button name and user list title
  loggedInUserDepartmentName: string = "department";
  loggedInUserDepartment() {
    debugger;
    this.departmentService.getDepartmentByDepartmentID(this.loggedInUsersDepartmentID).subscribe(async (data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        debugger;
        this.loggedInUserDepartmentName = current.departmentName;
        console.log("Got Department Name", this.loggedInUserDepartmentName);

      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, (error) => {
      console.log("Error: ", error);
    });

  }

  async showLinkedUsers() {
    debugger;
    console.log("Hi, from show linked - This is the department ID????" + this.loggedInUsersDepartmentID);
    //This service become undefined??
    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.loggedInUsersDepartmentID).subscribe(async (subDepartmentsData: any) => {
      if (subDepartmentsData.responseCode === 1) {
        const observables = subDepartmentsData.dateSet.map(async (subDepartment: any) => {
          const userData = await this.userPofileService.getUsersBySubDepartmentName(subDepartment.subDepartmentName).toPromise();
          return userData;
        });
        debugger;
        const userDataSets = await Promise.all(observables);
        console.log("What is going on??");
        console.table(userDataSets);
        for (let i = 0; i < userDataSets.length; i++) {
          const data = userDataSets[i];
          if (data.responseCode === 1) {
            for (let j = 0; j < data.dateSet.length; j++) {
              const tempZoneLinkList = {} as ZoneLinkList;
              const current = data.dateSet[j];
              debugger;
              tempZoneLinkList.userID = current.userID;
              tempZoneLinkList.fullName = current.fullName;
              tempZoneLinkList.departmentName = current.directorate;
              tempZoneLinkList.subdepartmentName = current.subDepartmentName;
              tempZoneLinkList.isZoneAdmin = current.isZoneAdmin ? 'Yes' : 'No';
              tempZoneLinkList.isDepartmentAdmin = current.isDepartmentAdmin ? 'Yes' : 'No';

              if (current.directorate == "EMB" || current.subDepartmentName == "EMB") {
                tempZoneLinkList.zoneName = "EMB";
              } else {
                //zoneID
                if (current.zoneID != null) {
                  try {
                    const zoneName: string = await this.getTheirZoneName(current.zoneID);
                    tempZoneLinkList.zoneName = zoneName;
                    // Use zoneName here as a string
                    console.log("Zone Name:", zoneName);
                  } catch (error) {
                    // Handle errors here
                    console.error("Error:", error);
                    tempZoneLinkList.zoneName = "Unassigned";
                  }
                } else {
                  // this.zoneLinkService.getAllUserLinks(current.userID).subscribe
                  try {
                    const fetchedZoneID: number = await this.getZoneIDViaLink(current.userID);
                    const zoneName: string = await this.getTheirZoneName(fetchedZoneID);
                    tempZoneLinkList.zoneName = zoneName;
                  } catch (error) {
                    // Handle errors here
                    debugger;
                    console.error("Error:", error);
                    // Set a default message for "Unknown Zone"
                    tempZoneLinkList.zoneName = "Unassigned";
                  }
                }
              }
              this.ZoneLinkList.push(tempZoneLinkList);
            }
          } else {
            alert(data.responseMessage);
          }
          console.log('response', data);
        }
        console.log("Iphi le ZONE LINK LIST????");
        console.table(this.ZoneLinkList);

        this.ZoneDepTable?.renderRows();
      } else {
        alert(subDepartmentsData.responseMessage);
      }
    }, error => {
      console.log('Error showing linked users: ', error);
    });
  }

  //Zone Name
  async getTheirZoneName(zoneID: any): Promise<string> {
    if (zoneID === null) {
      //if not the return no zone 
      return "No Zone";
    }

    return new Promise<string>((resolve, reject) => {
      this.zoneService.getZoneByZoneID(zoneID).subscribe((data: any) => {
        if (data.responseCode == 1) {

          const current = data.dateSet[0];
          debugger;
          const zoneName = current.zoneName;
          console.log("Got Zone Name", zoneName);
          resolve(zoneName);
        } else {
          alert(data.responseMessage);
          reject(data.responseMessage);
        }
        console.log("response", data);
      }, (error) => {
        console.log("Error: ", error);
        reject(error);
      });
    });
  }
  async getZoneIDViaLink(userID: any): Promise<number> {
    debugger;
    return new Promise<number>((resolve, reject) => {
      this.zoneLinkService.getAllUserLinks(userID).subscribe((data: any) => {
        if (data.responseCode === 1 && data.dateSet && data.dateSet.length > 0) {
          debugger;
          const current = data.dateSet[0];
          if (current && current.zoneID !== undefined) {
            const zoneID = current.zoneID;
            resolve(zoneID); // Resolve the Promise with zoneID
          } else {
            reject("Zone ID is undefined or null in current");
          }
        } else {
          reject("No data or responseCode is not 1");
        }
      }, (error) => {
        reject(error); // Reject with the error object
      });
    });
  }
  //click events do nothing for now


  selectedUser: number = null;
  selectedUserID: string = '';
  selectedUserName: string = '';
  ThisUserRolesList: TheirRolesList[] = [];

  removeUserFromDPT(index: any) {
    this.selectedUser = index;
  }
  async editUserScope(index: any, viewDepartmentPerson: any) {
    debugger;
    this.selectedUser = index;

    this.selectedUserID = this.ZoneLinkList[index].userID;
    this.selectedUserName = this.ZoneLinkList[index].fullName;
    console.log("Selected UserID: ", this.selectedUserID);
    console.log("Selected UserName: ", this.selectedUserName);

    try {
      const data: any = await this.accessGroupsService.getAllRolesForUser(this.selectedUserID).toPromise();

      console.log("Roles response Data: ", data);

      if (data && data.response === 1) { // Check if data is not null/undefined
        console.log("Entering if block");
        debugger;

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as TheirRolesList;
          const current = data.dateSet[i];
          tempRolesList.RoleName = current.roleName;
          console.table(tempRolesList);
          this.ThisUserRolesList.push(tempRolesList);
        }

        // Open the modal after the loop has finished
        this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });

        console.log("Exiting if block");
        debugger;
      } else {
        if (data) {
          alert(data.responseMessage);
        } else {
          alert("No data received or invalid response structure.");
        }
      }
    } catch (error) {
      console.log('Error getting roles for selected user: ', error);
      alert('Error getting roles for selected user: ' + error.message);
    }

    console.log("I'm out of the method.");
  }

  removeRole(index: number): void {
    //am I going to need more than this? maybe a young delete via service?
    this.ThisUserRolesList.splice(index, 1);
  }
}





