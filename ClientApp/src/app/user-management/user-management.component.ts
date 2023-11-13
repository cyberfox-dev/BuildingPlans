import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
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
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { AccessGroupUserLinkServiceService } from '../service/AccessGroupUserLink/access-group-user-link-service.service';
import { UserService } from '../service/User/user.service';
import { NewProfileComponent } from '../new-user/new-profile/new-profile.component';
import { SharedService } from '../shared/shared.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
//import { access } from 'fs';
//import * as internal from 'stream';


export interface UserList {
  userProfileID: any;
  userId: any;
  email: string;
  idNumber: string;
  fullName: string;
  zoneName: string;
  ZoneID: any;
  SubDepartmentID: any;
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

export interface AccessGroupDetailsList {
  AccessGroupID: number,
  AccessGroupName: string,
  AccessGroupUserLinkID: number,
  SubdepartmentID: any;
  ZoneID: number;
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
export interface TheirAccessGroupList {
  AccessGroupUserLinkID: any;
  AccessGroupID: number;
  ZoneID: number;
}

export interface ZoneLinkList {
  userProfileID: any;
  userID: string;
  fullName: string;
  departmentName: string;
  subDepartmentID: any;
  departmentID: any;
  subdepartmentName: string;
  zoneName: string;
  isZoneAdmin: string;
  isDepartmentAdmin: string;
  ZoneID: any;
}
export interface SubDepartmentList {
  SubDepartmentID: number;
  SubDepartmentName: string;
  DepartmentID: number;
}

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
}

export interface ZonesList {
  ZoneID: number;
  ZoneName: string;
  DepartmentID: number;
  SubDepartmentID: number;
  isLinked: boolean;
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
  createdUPID: number;
  theDepartmentName: string = "";
  UserList: UserList[] = [];
  UserProfile: UserProfile[] = [];
  AccessGroupList: AccessGroupList[] = [];
  ZoneList: ZoneList[] = [];

  SubDepartmentList: SubDepartmentList[] = [];
  AllSubDepartmentList: SubDepartmentList[] = [];
  ZonesList: ZonesList[] = [];

  DepartmentList: DepartmentList[] = [];

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
  accessGroupUserLinkID: any;
  selectedUsersDepartmentID: number;
  ZoneName: string;

  constructor(private cdr: ChangeDetectorRef, private userService: UserService, private newProfileComponent: NewProfileComponent, private sharedService: SharedService, private notificationService: NotificationsService,
    private userPofileService: UserProfileService, private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private zoneService: ZonesService, private zoneLinkService: ZoneLinkService, private subDepartmentService: SubDepartmentsService, private departmentService: DepartmentsService, private accessGroupLinkService: AccessGroupUserLinkServiceService, private zonesService: ZonesService) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));

    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersDepartmentID = this.CurrentUserProfile[0].departmentID;
    this.loggedInUsersDepartmentID = this.CurrentUserProfile[0].departmentID;
    console.log('User Information???????????????????????????????????????????', this.CurrentUser);
    console.log('User Information???????????????????????????????????????????2', this.CurrentUserProfile);
    this.getUserProfileByUserID(); //Note this method calls this.getAllusersNotLinkedToDep();
    this.loggedInUserDepartment();
    this.getDepartmentID(this.loggedInUsersSubDepartmentID);
    //this.showLinkedUsers();
    //this.getAllusersNotLinkedToDep();
    //this.getAllAccessGroups();
    this.getAllDepartments();
  }


  getUserProfiles() {
    //if (this.CurrentUserProfile.) {

    //}
  }


  approveZoneName: string = '';
  nameToApprove: string = '';
  openAssignModal(content, index: any) {

    this.selectedUserIndex = this.UserList[index].userProfileID;
    this.selectedUserZoneID = this.UserList[index].ZoneID;
    this.selectedUsersubDepID = this.UserList[index].SubDepartmentID;
    this.selectedUserID = this.UserList[index].userId;
    this.approveZoneName = this.UserList[index].zoneName;
    this.nameToApprove = this.UserList[index].fullName;

    /*          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
  
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;
        
          tempZoneList.ZoneID = current.zoneID;
          tempZoneList.SubDepartmentID = current.subDepartmentID;


          const zoneName: string = await this.getZoneByZoneId(current.zoneID);

          tempZoneList.zoneName = zoneName;



          this.UserList.push(tempZoneList);
        }*/
    /* this.selectedUserAccessGroupID = this.AccessGroupList[0].AccessGroupID;*/
    /* this.getAllZonesByZoneID();*/

    this.modalService.open(content, { centered: true, size: 'lg' });
    console.log("FSDFJNISDFSDFJNISFDJNISFDSDFJISDF", this.selectedUsersubDepID, this.selectedUserZoneID);
  }
  openNewUserModal(newUser) {
    this.modalService.open(newUser, { centered: true, size: 'xl' });
  }
  openFilterSettingsModal(moreFilter) {
    this.modalService.open(moreFilter, { centered: true, size: 'lg', backdrop: 'static' });
  }
  openAllUsersModal(allUsers) {

    this.modalService.dismissAll();
    const modalRef = this.modalService.open(allUsers, { centered: true, size: 'xl', backdrop: 'static', });
    //modalRef.componentInstance.dataSource = this.dataSourceZoneLink;
  }
  /*async openAllUsersModal(allUsers) {
    try {
      // Retrieve the default list before opening the modal
      await this.showLinkedUsers();

      // Dismiss any existing modals
      this.modalService.dismissAll();

      // Open the new modal with the freshly acquired data source
      const modalRef = this.modalService.open(allUsers, {
        centered: true,
        size: 'xl',
        backdrop: 'static', // Prevent dismissal by clicking outside the modal
      });

      modalRef.componentInstance.dataSource = [...this.ZoneLinkList];

      // Subscribe to the modal's dismiss event to refresh the data source
      modalRef.result.then(
        async () => {
          // Refresh the data source when the modal is dismissed
          await this.showLinkedUsers();
          modalRef.componentInstance.dataSource = [...this.ZoneLinkList];
        },
        () => {
          // Handle dismissal rejection if needed
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  */

  async getZoneByZoneId(zoneID: any): Promise<string> {
    try {
      const data: any = await this.zoneService.getZoneByZoneID(zoneID).toPromise();
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        return current.zoneName;
      } else {
        //alert(data.responseMessage);
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
    //this.userPofileService.getAllUsersToLinkToDep(this.UserProfile[0].depID).subscribe(async (data: any) => {
    this.userPofileService.getAllUsersToLinkToDep(this.loggedInUsersDepartmentID).subscribe(async (data: any) => {
      debugger;
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;
          tempZoneList.email = current.email;
          tempZoneList.userProfileID = current.userProfileID;
          tempZoneList.ZoneID = current.zoneID;
          tempZoneList.SubDepartmentID = current.subDepartmentID;


          const zoneName: string = await this.getZoneByZoneId(current.zoneID);

          tempZoneList.zoneName = zoneName;



          this.UserList.push(tempZoneList);
        }
        this.UserListTable?.renderRows();

      }
      else {
        //alert(data.responseMessage);
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

        //alert(data.responseMessage);
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
        //alert(data.responseMessage);
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

  selectedAccessGroups: number[] = [];
  getAccesGroupID(event: any) {

    //this.accessGroupID = event.target.value;
    //console.log("SDFSDFSDSDFSDFDSf", this.accessGroupID)

    const accessGroupId = +event.target.value; // Convert the value to a number

    if (event.target.checked) {
      // If the checkbox is checked, add the access group ID to the selectedAccessGroups array
      this.selectedAccessGroups.push(accessGroupId);
    } else {
      // If the checkbox is unchecked, remove the access group ID from the selectedAccessGroups array
      const index = this.selectedAccessGroups.indexOf(accessGroupId);
      if (index !== -1) {
        this.selectedAccessGroups.splice(index, 1);
      }
    }

  }

  isAccessGroupSelected(targetName: string): boolean {
    const accessGroupId = this.getAccessGroupIdByName(targetName);
    return this.selectedAccessGroups.includes(accessGroupId);
  }

  async approveTheUser() {
    console.log("I want to push USERPROFILEID", this.selectedUserIndex)

    const userId = this.selectedUserID;
    const appUserId = this.CurrentUser.appUserId;
    const userZoneID = this.selectedUserZoneID;
    const userSubDepID = this.selectedUsersubDepID;
    const userIndex = this.selectedUserIndex;

    try {
      await this.getDepartmentID(this.selectedUsersubDepID);
      await this.getSubdepartmentName(this.selectedUsersubDepID);
      await this.getDepartmentName(this.theDepartmentID);

      if (this.selectedAccessGroups.length === 0) {
        // No access groups selected, handle this case as needed
        alert("Please select at least one access group");
        return;
      }

      const isDepartmentAdmin = this.isAccessGroupSelected("Department Admin");
      const isZoneAdmin = this.isAccessGroupSelected("Zone Admin");

      // This is for accepting the user:
      const approvalResponse = await new Promise((resolve, reject) => {
        this.userPofileService.userGainsApproval(this.selectedUserIndex).subscribe(
          (data: any) => {
            this.UserList.splice(0, this.UserList.length);

            if (data.responseCode == 1) {
              alert(data.responseMessage);

              this.getAllusersNotLinkedToDep();

              // These are the access group zonelink things
              const accessGroupPromises = this.selectedAccessGroups.map(accessGroupId =>
                new Promise((resolve, reject) => {
                  this.accessGroupsService.addUpdateAccessGroupUserLink(0, accessGroupId, userId, appUserId, userZoneID, userSubDepID, userIndex)
                    .subscribe(
                      (data: any) => {
                        if (data.responseCode === 1) {
                          alert(data.responseMessage);

                          //#region
                          const subDepartmentID = this.selectedUsersubDepID;
                          const zoneName = this.approveZoneName;
                          const zoneID = this.selectedUserZoneID;

                          const fullNameArray = this.nameToApprove.split(' ');
                          const name = fullNameArray[0];
                          const surname = fullNameArray[1];
                          //#endregion

                          const costCenterNumber = 0o0000;
                          const costCenterOwner = "Approved By Dept Manager"
                          this.userPofileService.addUpdateUserProfiles(this.selectedUserIndex, null, null, null, null, null, null, null, null, null,
                            this.theDepartmentName, this.theDepartmentID, subDepartmentID, null, costCenterNumber.toString(), costCenterOwner, null, this.CurrentUser.appUserId, null, zoneID,
                            null, null, null, isDepartmentAdmin, isZoneAdmin, this.theSubDepartmentName, null, null, name, surname, this.theDepartmentName, zoneName, true, null, null).subscribe((data: any) => {

                              if (data.responseCode == 1) {
                              }
                              else {
                                alert(data.responseMessage);
                              }
                              console.log("response", data);
                            }, (error) => {
                              console.log("Error: ", error);
                            });

                          resolve(data);
                        } else {
                          alert(data.responseMessage);
                          reject(data);
                        }
                      },
                      error => {
                        console.log("Error:", error);
                        reject(error);
                      }
                    );
                })
              );

              Promise.all(accessGroupPromises)
                .then(() => {
                  // Continue with other code if needed
                  resolve(data);
                })
                .catch(reject);
            } else {
              alert(data.responseMessage);
              reject(data);
            }
          },
          error => {
            console.log("Error: ", error);
            reject(error);
          }
        );
      });

    } catch (error) {
      console.error("An error occurred during approval:", error);
    } finally {
      // Clear the selected access groups when done with everything else
      this.selectedAccessGroups.splice(0, this.selectedAccessGroups.length);
    }
  }

  @ViewChild(MatTable) ZoneDepTable: MatTable<ZoneLinkList> | undefined;
  //displayedColumnsZoneLinks: string[] = ['fullName', 'departmentName', 'subdepartmentName', 'zoneName', 'isZoneAdmin', 'isDepartmentAdmin', 'actions'];
  displayedColumnsZoneLinks: string[] = ['fullName', 'subdepartmentName', 'zoneName', 'actions'];
  //displayedColumnsZoneLinks: string[] = ['fullName','subdepartmentName', 'actions'];
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

        if (this.loggedInUserDepartmentName == "EMB" || this.loggedInUsersDepartmentID == 28) {
          this.isEMBAdmin = true;
          this.showAllLinkedUsers();

          console.log("Is this user in EMB???" + this.loggedInUserDepartmentName)
        }
        else {
          this.isEMBAdmin = false;
          this.showLinkedUsers();
          this.getMatMenuDetails();


        }
        console.log("Got Department Name", this.loggedInUserDepartmentName);

      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, (error) => {
      console.log("Error: ", error);
    });

  }

  async showAllLinkedUsers() {
    this.subDepartmentService.getSubDepartmentsList().subscribe(async (subdepartmentData: any) => {
      if (subdepartmentData.responseCode === 1) {
        const observables = subdepartmentData.dateSet.map(async (subDepartment: any) => {
          const userData = await this.userPofileService.getUsersBySubDepartmentName(subDepartment.subDepartmentName).toPromise();
          return userData;

        });
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
              tempZoneLinkList.userProfileID = current.userProfileID;
              tempZoneLinkList.userID = current.userID;
              tempZoneLinkList.fullName = current.fullName;
              tempZoneLinkList.departmentName = current.directorate;
              tempZoneLinkList.departmentID = current.departmentID;
              tempZoneLinkList.subDepartmentID = current.subDepartmentID;
              tempZoneLinkList.subdepartmentName = current.subDepartmentName;
              tempZoneLinkList.isZoneAdmin = current.isZoneAdmin ? 'Yes' : 'No';
              tempZoneLinkList.isDepartmentAdmin = current.isDepartmentAdmin ? 'Yes' : 'No';


              this.getZones(current.subDepartmentID);
              if (current.directorate == "EMB" || current.subDepartmentName == "EMB") {
                tempZoneLinkList.zoneName = "EMB";
              } else {
                //zoneID
                if (current.zoneID != null) {
                  try {
                    tempZoneLinkList.ZoneID = current.zoneID;
                    const zoneName: string = await this.getTheirZoneName(current.zoneID);
                    tempZoneLinkList.zoneName = zoneName;
                    // Use zoneName here as a string
                    console.log("Zone Name:", zoneName);
                  } catch (error) {
                    // Handle errors here
                    console.error("Error:", error);
                    tempZoneLinkList.ZoneID = null;
                    tempZoneLinkList.zoneName = "Unassigned";
                  }
                } else {
                  // this.zoneLinkService.getAllUserLinks(current.userID).subscribe
                  try {
                    const fetchedZoneID: number = await this.getZoneIDViaLink(current.userID);
                    tempZoneLinkList.ZoneID = fetchedZoneID;
                    const zoneName: string = await this.getTheirZoneName(fetchedZoneID);
                    tempZoneLinkList.zoneName = zoneName;
                  } catch (error) {
                    // Handle errors here
                    debugger;
                    console.error("Error:", error);
                    // Set a default message for "Unknown Zone"
                    tempZoneLinkList.ZoneID = null;
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
        //alert(subdepartmentData.responseMessage);
      }
    }, error => {
      console.log('Error showing linked users: ', error);
    });
  }

  async showLinkedUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      debugger;
      this.ZoneLinkList.splice(0, this.ZoneLinkList.length);
      console.log("Hi, from show linked - This is the department ID????" + this.loggedInUsersDepartmentID);

      this.subDepartmentService.getSubDepartmentsByDepartmentID(this.loggedInUsersDepartmentID).subscribe(async (subDepartmentsData: any) => {
        try {
          if (subDepartmentsData.responseCode === 1) {
            const observables = subDepartmentsData.dateSet.map(async (subDepartment: any) => {
              const userData = await this.userPofileService.getUsersBySubDepartmentName(subDepartment.subDepartmentName).toPromise();
              return userData;
            });

            const userDataSets = await Promise.all(observables);

            for (let i = 0; i < userDataSets.length; i++) {
              const data = userDataSets[i];

              if (data.responseCode === 1) {
                for (let j = 0; j < data.dateSet.length; j++) {
                  const tempZoneLinkList = {} as ZoneLinkList;
                  const current = data.dateSet[j];

                  debugger;
                  tempZoneLinkList.userProfileID = current.userProfileID;
                  tempZoneLinkList.userID = current.userID;
                  tempZoneLinkList.fullName = current.fullName;
                  tempZoneLinkList.departmentName = current.directorate;
                  tempZoneLinkList.subDepartmentID = current.subDepartmentID;
                  tempZoneLinkList.departmentID = current.departmentID;
                  tempZoneLinkList.subdepartmentName = current.subDepartmentName;
                  tempZoneLinkList.isZoneAdmin = current.isZoneAdmin ? 'Yes' : 'No';
                  tempZoneLinkList.isDepartmentAdmin = current.isDepartmentAdmin ? 'Yes' : 'No';

                  this.getZones(current.subDepartmentID);
                  if (current.directorate == "EMB" || current.subDepartmentName == "EMB") {
                    tempZoneLinkList.zoneName = "EMB";
                  } else {
                    //zoneID
                    if (current.zoneID != null) {
                      try {
                        tempZoneLinkList.ZoneID = current.zoneID;
                        const zoneName: string = await this.getTheirZoneName(current.zoneID);
                        tempZoneLinkList.zoneName = zoneName;
                        // Use zoneName here as a string
                        console.log("Zone Name:", zoneName);
                      } catch (error) {
                        // Handle errors here
                        console.error("Error:", error);
                        tempZoneLinkList.ZoneID = null;
                        tempZoneLinkList.zoneName = "Unassigned";
                      }
                    } else {
                      // this.zoneLinkService.getAllUserLinks(current.userID).subscribe
                      try {
                        const fetchedZoneID: number = await this.getZoneIDViaLink(current.userID);
                        tempZoneLinkList.ZoneID = fetchedZoneID;
                        const zoneName: string = await this.getTheirZoneName(fetchedZoneID);
                        tempZoneLinkList.zoneName = zoneName;
                      } catch (error) {
                        // Handle errors here
                        debugger;
                        console.error("Error:", error);
                        // Set a default message for "Unknown Zone"
                        tempZoneLinkList.ZoneID = null;
                        tempZoneLinkList.zoneName = "Unassigned";
                      }
                    }
                  }

                  this.ZoneLinkList.push(tempZoneLinkList);
                }
              } else {
                //alert(data.responseMessage);
              }
              console.log('response', data);
            }

            console.log("Iphi le ZONE LINK LIST????");
            console.table(this.ZoneLinkList);

            this.ZoneDepTable?.renderRows();
            resolve(); // Resolve the promise once the asynchronous operations are complete
          } else {
            //alert(subDepartmentsData.responseMessage);
            reject("Error: " + subDepartmentsData.responseMessage);
          }
        } catch (error) {
          console.log('Error showing linked users: ', error);
          reject("Error: " + error);
        }
      }, error => {
        console.log('Error showing linked users: ', error);
        reject("Error: " + error);
      });
    });
  }

  //Zone Name == This was a roundabout way that I used because there was no Zone Name column at the time
  //TODO: Get ZoneName from UserProfile table
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
  isZoneAdmin: any;// actually string
  isDepartmentAdmin: any;
  zoneAdminValue: number;
  //departmentAdminValue: number; //toggle removed
  subDeptName: string = '';
  subDeptID: any = null;
  boolZoneAdmin: boolean;
  boolDeptAdmin: boolean;
  userProfileID: any;

  convertToBoolean(value: number): boolean {
    if (value === 1) {
      return true;
    } else if (value === 0) {
      return false;
    } else {
      throw new Error("Input must be 0 or 1");
    }
  }


  UserZoneLinkID: any;
  zoneId: any;
  thisAccessGroupID: any;

  async editUserScope(index: any, viewDepartmentPerson: any) {

    debugger;

    this.ThisUserRolesList.splice(0, this.ThisUserRolesList.length);
    this.selectedUser = index;

    this.selectedUserID = this.dataSourceZoneLink[index].userID;
    this.userProfileID = this.dataSourceZoneLink[index].userProfileID;
    this.thisUSERPID = this.dataSourceZoneLink[index].userProfileID;
    this.selectedUserName = this.dataSourceZoneLink[index].fullName;
    this.theirSelectedSubDepartment = this.dataSourceZoneLink[index].subdepartmentName;
    this.theirSelectedZoneName = this.dataSourceZoneLink[index].zoneName;

    //this.selectedDepartmentID = this.ZoneLinkList[index].departmentID;

    console.log("Selected UserID: ", this.selectedUserID);
    console.log("Selected UserName: ", this.selectedUserName);

    /*
    WILL NO LONGER BE AUTOPOPULATING ACCORDING TO THE VALUES IN THE USER PROFILE TABLE
    const zoneAdminString = this.ZoneLinkList[index].isZoneAdmin;
    const departmentAdminString = this.ZoneLinkList[index].isDepartmentAdmin;
        // Convert string values to numeric values (0 or 1)
    this.isZoneAdmin = zoneAdminString === "Yes" ? 1 : 0;
    this.isDepartmentAdmin = departmentAdminString === "Yes" ? 1 : 0;
    */

    /*this.subDeptID = this.ZoneLinkList[index].subDepartmentID;
    this.zoneId = this.ZoneLinkList[index].ZoneID;
    this.ZoneName = this.ZoneLinkList[index].zoneName;
    this.subDeptName = this.ZoneLinkList[index].subdepartmentName;*/

    this.subDeptID = this.dataSourceZoneLink[index].subDepartmentID;
    this.zoneId = this.dataSourceZoneLink[index].ZoneID;
    this.ZoneName = this.dataSourceZoneLink[index].zoneName;
    this.subDeptName = this.dataSourceZoneLink[index].subdepartmentName;


    this.getAccessGroups();

    const selectedAccessGroup = this.AccessGroupList[index];

    // Find the user's association in ThisUserAGList based on the AccessGroupID

    /*const userAccessGroup = this.ThisUserAGList.find(userAG => userAG.AccessGroupID === selectedAccessGroup.AccessGroupID);

    this.accessGroupUserLinkID = userAccessGroup.AccessGroupUserLinkID;
    this.thisAccessGroupID = userAccessGroup.AccessGroupID;*/


    //initialy thought roles were gonna be used
    /*try {
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

        debugger;
        // Open the modal after the loop has finished
        this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });

        console.log("Exiting if block");
        debugger;
      } else {
        if (data) {
          //response is supposedly not 1 - there's a raised condition I can't figure out at the moment
          for (let i = 0; i < data.dateSet.length; i++) {
            const tempRolesList = {} as TheirRolesList;
            const current = data.dateSet[i];
            tempRolesList.RoleName = current.roleName;
            console.table(tempRolesList);
            this.ThisUserRolesList.push(tempRolesList);
          }

          console.log("Exiting if block");



          alert(data.responseMessage);
        } else {
          alert("No data received or invalid response structure.");
        }
      }
      this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
    } catch (error) {
      console.log('Error getting roles for selected user: ', error);
      alert('Error getting roles for selected user: ' + error.message);
    }*/
    debugger;

    this.zoneLinkService.getBySubAndUserID(this.subDeptID, this.selectedUserID).subscribe((data: any) => {
      if (data || data.responseCode == 1) {
        //alert(data.responseMessage);
        debugger;

        const current = data.dateSet[0];

        this.UserZoneLinkID = current.zoneLinkID;
        //this.departmentAdminValue = current.isDepartmentAdmin ? 1 : 0;
        //this.zoneAdminValue = current.isZoneAdmin ? 1 : 0;
        if (current.isZoneAdmin === true) {
          this.zoneAdminValue = 1;
        } else if (current.isZoneAdmin === false) {
          this.zoneAdminValue = 0;
        } else {
          // Handle the case when it's null (e.g., set a default value)
          this.zoneAdminValue = 0; // Replace defaultValue with an appropriate value
        }

        //console.log("This is the departmentValue: " + this.departmentAdminValue);
        console.log("This is the zoneAdminValue: " + this.zoneAdminValue);
        console.log(data);

        console.log("Is this it? Is this the ZoneLink ID? " + this.UserZoneLinkID);
        this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });

      } else {
        //alert(data.responseMessage);
      }
    })
    console.log("I'm out of the method.");
  }

  async editUserScopeManyZones(index: any, departmentPersonZones: any) {

    debugger;

    this.ThisUserRolesList.splice(0, this.ThisUserRolesList.length);
    this.selectedUser = index;

    this.selectedUserID = this.dataSourceZoneLink[index].userID;
    this.userProfileID = this.dataSourceZoneLink[index].userProfileID;
    this.selectedUserName = this.dataSourceZoneLink[index].fullName;

    //this.selectedDepartmentID = this.ZoneLinkList[index].departmentID;

    console.log("Selected UserID: ", this.selectedUserID);
    console.log("Selected UserName: ", this.selectedUserName);

    this.subDeptID = this.dataSourceZoneLink[index].subDepartmentID;
    this.theirSubdepartmentID = this.dataSourceZoneLink[index].subDepartmentID;
    this.zoneId = this.dataSourceZoneLink[index].ZoneID;
    this.ZoneName = this.dataSourceZoneLink[index].zoneName;
    this.subDeptName = this.dataSourceZoneLink[index].subdepartmentName;

    await this.ZonesList.splice(0, this.ZonesList.length);
    await this.TheirZoneLinkDetailsList.splice(0, this.TheirZoneLinkDetailsList.length);

    await this.getZones(this.subDeptID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.selectedDepartmentID = data.dateSet.departmentID;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZonesList = {} as ZonesList;
          const current = data.dateSet[i];
          tempZonesList.ZoneID = current.zoneID;
          tempZonesList.ZoneName = current.zoneName;
          tempZonesList.DepartmentID = current.departmentID;
          tempZonesList.SubDepartmentID = current.subDepartmentID;
          this.ZonesList.push(tempZonesList);
        }
        console.log("This is the relevant departmentID, and I have just got all of the zones for the mat-tab ", this.subDeptID);
        console.table(this.ZonesList);
      } else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
    }, error => {
      console.log("ZonesList error: ", error);
    });
    await this.accessGroupLinkService.getAGBySubDeptAndUserID(this.selectedUserID, this.subDeptID).subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        console.log("ZONELINKS ARE NOW IN THE ACCESSGROUPUSERLINKTABLE:", data);
        // This is essentially the new thisUserZoneInfo()

        //const zoneName: string = await this.getZoneByZoneId(current.zoneID);
        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const tempTheirZoneLinkDetailsList = {} as ZoneLinkList;
            const current = data.dateSet[i];
            tempTheirZoneLinkDetailsList.ZoneID = current.zoneID;
            tempTheirZoneLinkDetailsList.zoneName = await this.getZoneByZoneId(current.zoneID);
            this.TheirZoneLinkDetailsList.push(tempTheirZoneLinkDetailsList);
          }
          console.log("I want to know which zones they are in: ", data);
          console.table(this.TheirZoneLinkDetailsList);
          await this.checkZoneLinkage();
          console.log(data.responseMessage);
        } else {
          console.log(data.responseMessage);
        }
      }
    }, error => {
      console.log("ZonesList error: ", error);
    });

    this.modalService.open(departmentPersonZones, { centered: true, size: 'lg' });
    //#region OLD IMPLEMENTATION THAT USES THE ZONELINK TABLE
    /*
    await this.getZoneLinks(this.selectedUserID); //NO LONGER USING THE ZONE LINK TABLE - ALL IS DONE VIA THE USERPROFILETABLE AND THE ACCESSGROUPUSERLINKTABLES
    this.TheirZoneLinkDetailsList.splice(0, this.TheirZoneLinkDetailsList.length);
    await this.thisUserZoneInfo();//NB - won't know where user is linked without this
    await this.checkZoneLinkage();

    //this.getAccessGroups();
    //this.getZoneAccessGroups();

    const selectedAccessGroup = this.AccessGroupList[index];

    debugger;

    this.zoneLinkService.getBySubAndUserID(this.subDeptID, this.selectedUserID).subscribe((data: any) => {
      if (data || data.responseCode == 1) {
        //alert(data.responseMessage);
        debugger;

        const current = data.dateSet[0];

        this.UserZoneLinkID = current.zoneLinkID;
        //this.departmentAdminValue = current.isDepartmentAdmin ? 1 : 0;
        //this.zoneAdminValue = current.isZoneAdmin ? 1 : 0;
        if (current.isZoneAdmin === true) {
          this.zoneAdminValue = 1;
        } else if (current.isZoneAdmin === false) {
          this.zoneAdminValue = 0;
        } else {
          // Handle the case when it's null (e.g., set a default value)
          this.zoneAdminValue = 0; // Replace defaultValue with an appropriate value
        }

        //console.log("This is the departmentValue: " + this.departmentAdminValue);
        console.log("This is the zoneAdminValue: " + this.zoneAdminValue);
        console.log(data);

        console.log("Is this it? Is this the ZoneLink ID? " + this.UserZoneLinkID);
        //this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
        this.modalService.open(departmentPersonZones, { centered: true, size: 'lg' });

      } else {
        //alert(data.responseMessage);
      }
    })
    console.log("I'm out of the method.");
    */
    //#endregion
  }

  checkZoneLinkage() {
    // Iterate through each zone and check linkage
    debugger;
    this.ZonesList.forEach(zone => {
      zone.isLinked = this.checkZoneInTheirZoneLink(zone.ZoneID);
    });
  }

  removeRole(index: number): void {
    //am I going to need more than this? maybe a young delete via service?
    //method does nothing for NOW
    this.selectedUser = index;
    //this.ThisUserRolesList.splice(index, 1);
  }

  getAccessGroupName(accessGroupId: number): string | undefined {
    const accessGroup = this.AccessGroupList.find(group => group.AccessGroupID === accessGroupId);
    return accessGroup ? accessGroup.AccessGroupName : undefined;
  }
  saveAdminChanges() {

    //this.boolDeptAdmin = this.convertToBoolean(this.departmentAdminValue); //made null for now
    this.boolZoneAdmin = this.convertToBoolean(this.zoneAdminValue);
    debugger;

    //TODO: I need the accessGroupUserLinkID and accessGroupName - or do I?
    //What is this user type thing?

    //this.accessGroupUserLinkID = userAccessGroup.AccessGroupUserLinkID;
    //this.thisAccessGroupID = userAccessGroup.AccessGroupID;

    //There's a problem Zone Admin isn't in the Access Group Table
    //this.accessGroupName = this.getAccessGroupName(this.thisAccessGroupID);

    /*this.zoneLinkService.addUpdateZoneLink(this.UserZoneLinkID, null, null, null, this.subDeptID, this.subDeptName, this.selectedUserID, null, this.CurrentUser.appUserId, null, this.boolZoneAdmin, null, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });*/
    const observables = this.UserZoneLinkID.map(zoneLinkID => {
      return this.zoneLinkService.addUpdateZoneLink(
        zoneLinkID,
        null,
        null,
        null,
        this.subDeptID,
        this.subDeptName,
        this.selectedUserID,
        null,
        this.CurrentUser.appUserId,
        null,
        this.boolZoneAdmin,
        null,
        null
      );
    });

    forkJoin(observables).subscribe((responses: any[]) => {
      responses.forEach(data => {
        if (data.responseCode == 1) {
          //alert(data.responseMessage);
          console.log(data.responseMessage);
        } else {
          //alert(data.responseMessage);
          console.log(data.responseMessage);
        }
        console.log("response", data);
      });
    }, error => {
      console.log("Error: ", error);
    });

  }
  ThisUserAGList: TheirAccessGroupList[] = [];
  getAccessGroups() {
    this.ThisUserAGList.splice(0, this.ThisUserAGList.length);
    //shnap, this table doesn't have Access group names, just the IDs?!
    this.accessGroupLinkService.getAccessGroupByUserID(this.selectedUserID).subscribe((data: any) => {
      debugger;
      if (data || data.responseCode == 1) {
        //alert(data.responseMessage);
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAccessList = {} as TheirAccessGroupList;
          const current = data.dateSet[i];
          debugger;
          tempAccessList.AccessGroupUserLinkID = current.accessGroupUserLinkID;//accessGroupUserLinkID
          tempAccessList.AccessGroupID = current.accessGroupID;
          tempAccessList.ZoneID = current.zoneID;
          console.table(tempAccessList);
          this.ThisUserAGList.push(tempAccessList);
        }

      } else {
        //alert(data.responseMessage);
      }
    }
    )
  }
  /*
    async getZoneAccessGroups() {
      this.ThisUserAGList.splice(0, this.ThisUserAGList.length);
  
      await this.getZones(this.subDeptID).subscribe((zoneList: any[]) => {
        // Iterate over the ZoneIDs in the zoneList
        for (const zone of zoneList) {
          this.accessGroupLinkService
            .getAccessGroupsBySubDeptZoneAndUserID(this.selectedUserID, zone.ZoneID, this.subDeptID)
            .subscribe((data: any) => {
              if (data.responseCode == 1) {
                debugger;
                console.log("Zone specific access group info for ZoneID " + zone.ZoneID + ":", data);
                console.log(data.responseMessage);
  
                for (let i = 0; i < data.dateSet.length; i++) {
                  const tempAccessList = {} as TheirAccessGroupList;
                  const current = data.dateSet[i];
                  debugger;
                  tempAccessList.AccessGroupUserLinkID = current.accessGroupUserLinkID;//accessGroupUserLinkID
                  tempAccessList.AccessGroupID = current.accessGroupID;
                  console.table(tempAccessList);
                  this.ThisUserAGList.push(tempAccessList);
                }
  
              } else {
                console.log("Error for ZoneID " + zone.ZoneID + ":", data.responseMessage);
              }
            }, error => {
              console.log("Error for ZoneID " + zone.ZoneID + ":", error);
            });
        }
      });
    }
  */
  onTabChange(event: MatTabChangeEvent) {
    const selectedZone = this.ZonesList[event.index];
    if (selectedZone.isLinked) {
      debugger;
      this.getZoneAccessGroups(selectedZone.ZoneID);
    }
  }
  /*async getZoneAccessGroups(zoneId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      debugger;
      this.ThisUserAGList.splice(0, this.ThisUserAGList.length);

      this.accessGroupLinkService.getAccessGroupsBySubDeptZoneAndUserID(this.selectedUserID, zoneId, this.subDeptID)
        .subscribe((data: any) => {
          if (data.responseCode == 1) {
            debugger;
            for (let i = 0; i < data.dateSet.length; i++) {
              const tempAccessList = {} as TheirAccessGroupList;
              const current = data.dateSet[i];
              debugger;
              tempAccessList.AccessGroupUserLinkID = current.accessGroupUserLinkID;
              tempAccessList.AccessGroupID = current.accessGroupID;
              tempAccessList.ZoneID = current.zoneID;
              console.table(tempAccessList);
              this.ThisUserAGList.push(tempAccessList);
            }
            console.log("Zone specific access group info: ", data);
            console.log(data.responseMessage);
            resolve(); // Resolve the Promise when the operation is complete.
          } else {
            console.log(data.responseMessage);
            reject(`Error: ${data.responseMessage}`);
          }
          console.log("Zone specific access group info: ", data);
        }, error => {
          console.log("Error: ", error);
          reject(`Error: ${error}`);
        });
    });
  }*/
  async getZoneAccessGroups(zoneId: number): Promise<void> {
    try {
      this.ThisUserAGList.splice(0, this.ThisUserAGList.length);
      const data: any = await this.accessGroupLinkService.getAccessGroupsBySubDeptZoneAndUserID(this.selectedUserID, zoneId, this.subDeptID).toPromise();

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAccessList = {} as TheirAccessGroupList;
          const current = data.dateSet[i];
          debugger;
          tempAccessList.AccessGroupUserLinkID = current.accessGroupUserLinkID;
          tempAccessList.AccessGroupID = current.accessGroupID;
          tempAccessList.ZoneID = current.zoneID;
          console.table(tempAccessList);
          this.ThisUserAGList.push(tempAccessList);
        }
        console.log("Zone specific access group info: ", data);
      } else {
        console.log(data.responseMessage);
        throw new Error(`Error: ${data.responseMessage}`);
      }
    } catch (error) {
      console.log("Error: ", error);
      throw new Error(`Error: ${error}`);
    }
  }

  //AccessGroupList: AccessGroupList[] = [];
  getAllAccessGroups() {
    this.accessGroupsService.getAllAccessGroups().subscribe((data: any) => {
      debugger;
      if (data || data.responseCode == 1) {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAllAccessList = {} as AccessGroupList;
          const current = data.dateSet[i];
          debugger;
          tempAllAccessList.AccessGroupID = current.accessGroupID;
          tempAllAccessList.AccessGroupName = current.accessGroupName;
          console.table(tempAllAccessList);
          this.AccessGroupList.push(tempAllAccessList);
        }

      } else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
    }
    )
  }
  theDepartmentID: any;
  theSubDepartmentName: any;

  async getSubdepartmentName(subDepartmentId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.subDepartmentService.getSubDepartmentBySubDepartmentID(subDepartmentId).subscribe(
        (data: any) => {
          if (data.responseCode == 1) {
            this.theSubDepartmentName = data.dateSet[0].subDepartmentName;
            console.log("All I want is the SUbDepartmentName: ", data);
            console.log(data.responseMessage);
            resolve(this.theSubDepartmentName);
          } else {
            console.log(data.responseMessage);
            reject(data.responseMessage);
          }
        },
        (error) => {
          console.log("Error: ", error);
          reject(error);
        }
      );
    });
  }

  /*getSubdepartmentName(subDepartmentId: number) {
    debugger;
    this.subDepartmentService.getSubDepartmentBySubDepartmentID(subDepartmentId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.theSubDepartmentName = data.dateSet[0].subDepartmentName;

        console.log("All I want is the SUbDepartmentName: ", data);
        console.log(data.responseMessage);
      } else {
        console.log(data.responseMessage);
      }
      console.log("All I want is the SubDepartmentName: ", data);
    }, error => {
      console.log("Error: ", error);
    });
  }*/

  /*getDepartmentName(departmentId: number) {
    debugger;
    this.departmentService.getDepartmentByDepartmentID(departmentId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.theDepartmentName = data.dateSet[0].departmentName;
        console.log("This is the departmentName", this.theDepartmentName)

        console.log("All I want is the DepartmentName: ", data);
        console.log(data.responseMessage);
      } else {
        console.log(data.responseMessage);
      }
      console.log("All I want is the DepartmentName: ", data);
    }, error => {
      console.log("Error: ", error);
    });
  }*/
  getDepartmentName(departmentId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.departmentService.getDepartmentByDepartmentID(departmentId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.theDepartmentName = data.dateSet[0].departmentName;
          console.log("This is the departmentName", this.theDepartmentName);
          resolve(this.theDepartmentName);
        } else {
          reject(data.responseMessage);
        }
      }, error => {
        reject(error);
      });
    });
  }

  getDepartmentID(subDepartmentID: number) {
    debugger;
    this.subDepartmentService.getSubDepartmentBySubDepartmentID(subDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.theDepartmentID = data.dateSet[0].departmentID;

        console.log("All I want is the DepartmentID: ", data);
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      } else {

        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("All I want is the DepartmentID: ", data);
    }, error => {
      // Handle errors that may occur during the zone link update.
      console.log("Error: ", error);
    });
  }

  isUserInAccessGroup(accessGroupID: number): boolean {
    return this.ThisUserAGList.some(userAccessGroup => userAccessGroup.AccessGroupID === accessGroupID);
  }

  isUserInAccessGroup2(accessGroupID: number, zoneId: number): boolean {
    debugger;
    //why is the zone ID null??
    return this.ThisUserAGList.some(userAccessGroup => userAccessGroup.AccessGroupID === accessGroupID && userAccessGroup.ZoneID === zoneId);
  }
  tempAccessGroupDetailsArray: AccessGroupDetailsList[] = [];
  //THIS IS THE METHOD I AM CALLING:

  zoneAdminAGID: number;
  departAdminAGID: number;
  async addToAccessGroup(index: number, viewDepartmentPerson: any) {
    // You can use the index to access the selected access group in AccessGroupList
    const selectedAccessGroup = this.AccessGroupList[index];
    const accessGroupID = selectedAccessGroup.AccessGroupID;

    this.zoneAdminAGID = this.getAccessGroupIdByName("Zone Admin");
    this.departAdminAGID = this.getAccessGroupIdByName("Department Admin");
    //SMALL PROBLEM = so for each zone link AKA userprofile there is a isDepartmentAdmin and isZoneAdmin - i'd like to update that depending on selections
    if (accessGroupID == this.zoneAdminAGID) {
      this.userPofileService.updateAdminBool(this.thisUSERPID, null, true, this.CurrentUser.appUserId).subscribe((data: any) => {
        debugger;

        if (data.responseCode == 1) {
          console.log("This user is no longer a zone admin", data);
        }
        else {
          //alert(data.responseMessage);
          console.log(data.responseMessage);
        }
        console.log("UPDATED USER PROFILE: ADDING THEM TO THE ZONE ADMIN ACCESS GROUP", data);

      }, error => {
        console.log("UPDATED USER PROFILE: ADDING THEM TO THE ZONE ADMIN ACCESS GROUP", error);
      })
    }
    if (accessGroupID == this.departAdminAGID) {
      this.userPofileService.updateAdminBool(this.thisUSERPID, true, null, this.CurrentUser.appUserId).subscribe((data: any) => {
        debugger;

        if (data.responseCode == 1) {
          console.log("This user is no longer a department admin", data);
        }
        else {
          //alert(data.responseMessage);
          console.log(data.responseMessage);
        }
        console.log("UPDATED USER PROFILE: ADDING THEM TO THE DEPARTMENT ADMIN ACCESS GROUP", data);

      }, error => {
        console.log("UPDATED USER PROFILE: ADDING THEM TO THE DEPARTMENT ADMIN ACCESS GROUP", error);
      })
    }




    debugger;
    //NB: MAKE SURE THAT THOSE TWO NEW ARGUMENTS ARE ACCOUNTED FOR ACCORDINGLY!
    // TODO: FIX THE LAST ARGUMENT
    await this.accessGroupsService.addUpdateAccessGroupUserLink(0, accessGroupID, this.selectedUserID, this.CurrentUser.appUserId, this.zoneId, this.subDeptID, this.thisUSERPID).subscribe((data: any) => {
      ///
      console.log("TRYINGTRYINGTRYINGTOADDACCESSGROUPACCESSGROUP");
      if (data.responseCode == 1) {
        debugger;
        //this.modalService.dismissAll();
        //this.modalService.open(viewDepartmentPerson, { size: 'lg' });
        console.log("What gets outputted?? kodwa here's the data: ", data);
        const tempAccessGroupDetails = {} as AccessGroupDetailsList;

        tempAccessGroupDetails.AccessGroupID = data.dateSet.accessGroupID;
        tempAccessGroupDetails.SubdepartmentID = data.dateSet.subDepartmentID;
        tempAccessGroupDetails.AccessGroupName = this.getAccessGroupName(data.dateSet.accessGroupID);
        tempAccessGroupDetails.AccessGroupUserLinkID = data.dateSet.accessGroupUserLinkID;
        tempAccessGroupDetails.ZoneID = data.dateSet.zoneID;

        this.tempAccessGroupDetailsArray.push(tempAccessGroupDetails);
        this.ThisUserAGList.push(tempAccessGroupDetails);
        //is.boolZoneAdmin = this.convertToBoolean(this.zoneAdminValue); //nb: NOTE THERE IS NO MORE TOGGLE!!
        this.getDepartmentID(tempAccessGroupDetails.SubdepartmentID);

        console.log("This is the tempoaryAccessGroupDetails", this.tempAccessGroupDetailsArray)
        // Now, update the zone link.
        //#region THE ZONE LINK TABLE ISN'T BEING USED ANYMORE:
        /*this.zoneLinkService.addUpdateZoneLink(0, this.zoneId, this.ZoneName, this.theDepartmentID, this.subDeptID, this.subDeptName, this.selectedUserID, null, this.CurrentUser.appUserId, null, this.boolZoneAdmin,
           tempAccessGroupDetails.AccessGroupUserLinkID,
           tempAccessGroupDetails.AccessGroupName
         ).subscribe((zoneLinkData: any) => {
           if (zoneLinkData.responseCode == 1) {
             // Successful zone link update. Display a success message.
             //alert(zoneLinkData.responseMessage);
             console.log(data.responseMessage);
           } else {
             // Handle the case where the zone link update fails. Display an error message.
             //alert(zoneLinkData.responseMessage);
             console.log(data.responseMessage);
           }
           console.log("response", zoneLinkData);
         }, error => {
           // Handle errors that may occur during the zone link update.
           console.log("Error: ", error);
         });*/
        //#endregion

        console.log("user has been added??");
      } else {

        console.log("There's an error, kodwa here's the data: ", data);
        console.log(data.responseMessage);
      }
      console.log("response", data);
      this.getZoneAccessGroups(this.zoneId);
    }, error => {
      console.log("Error:", error);


    })



    //await new Promise(resolve => setTimeout(resolve, 1000));
    //await this.getAccessGroups();
    await this.getZoneAccessGroups(this.zoneId);
    this.modalService.dismissAll(); // Close the modal before reopening.
    this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
  }

  //MIZE THIS METHOD FOR NOW!!!!
  async addToAccessGroupInZones(index: number, departmentPersonZones: any, zoneId) {
    // You can use the index to access the selected access group in AccessGroupList
    const selectedAccessGroup = this.AccessGroupList[index];
    const accessGroupID = selectedAccessGroup.AccessGroupID;


    //this.selectedDepartmentID


    debugger;
    //NB: MAKE SURE THAT THOSE TWO NEW ARGUMENTS ARE ACCOUNTED FOR ACCORDINGLY!
    // TODO: FIX THE LAST ARGUMENT
    this.accessGroupsService.addUpdateAccessGroupUserLink(0, accessGroupID, this.selectedUserID, this.CurrentUser.appUserId, zoneId, this.subDeptID, null).subscribe((data: any) => {
      ///
      console.log("TRYINGTRYINGTRYINGTOADDACCESSGROUPACCESSGROUP");
      if (data.responseCode == 1) {
        debugger;
        //this.modalService.dismissAll();
        //this.modalService.open(viewDepartmentPerson, { size: 'lg' });
        console.log("What gets outputted?? kodwa here's the data: ", data);
        const tempAccessGroupDetails = {} as AccessGroupDetailsList;

        tempAccessGroupDetails.AccessGroupID = data.dateSet.accessGroupID;
        tempAccessGroupDetails.SubdepartmentID = data.dateSet.subDepartmentID;
        tempAccessGroupDetails.AccessGroupName = this.getAccessGroupName(data.dateSet.accessGroupID);
        tempAccessGroupDetails.AccessGroupUserLinkID = data.dateSet.accessGroupUserLinkID;

        this.tempAccessGroupDetailsArray.push(tempAccessGroupDetails);
        this.boolZoneAdmin = this.convertToBoolean(this.zoneAdminValue);
        this.getDepartmentID(tempAccessGroupDetails.SubdepartmentID);

        console.log("This is the tempoaryAccessGroupDetails", this.tempAccessGroupDetailsArray)
        // Now, update the zone link.
        this.zoneLinkService.addUpdateZoneLink(0, this.zoneId, this.ZoneName, this.theDepartmentID, this.subDeptID, this.subDeptName, this.selectedUserID, null, this.CurrentUser.appUserId, null, this.boolZoneAdmin,
          tempAccessGroupDetails.AccessGroupUserLinkID,
          tempAccessGroupDetails.AccessGroupName
        ).subscribe((zoneLinkData: any) => {
          if (zoneLinkData.responseCode == 1) {
            // Successful zone link update. Display a success message.
            //alert(zoneLinkData.responseMessage);
            console.log(data.responseMessage);
          } else {
            // Handle the case where the zone link update fails. Display an error message.
            //alert(zoneLinkData.responseMessage);
            console.log(data.responseMessage);
          }
          console.log("response", zoneLinkData);
        }, error => {
          // Handle errors that may occur during the zone link update.
          console.log("Error: ", error);
        });

        this.getAccessGroups();
        console.log("user has been added??");
      } else {
        //this.modalService.dismissAll();
        //this.modalService.open(viewDepartmentPerson, { size: 'lg' });
        console.log("There's an error, kodwa here's the data: ", data);
        //console.error('Error adding user to access group:', data.responseMessage);
        this.getAccessGroups();
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error:", error);


    })



    //await new Promise(resolve => setTimeout(resolve, 1000));
    await this.getAccessGroups();
    this.modalService.open(departmentPersonZones, { centered: true, size: 'lg' });
  }

  removeFromAccessGroup(index: number) {
    // Get the selected access group
    const selectedAccessGroup = this.AccessGroupList[index];

    const accessGroupID = selectedAccessGroup.AccessGroupID;
    this.zoneAdminAGID = this.getAccessGroupIdByName("Zone Admin");
    this.departAdminAGID = this.getAccessGroupIdByName("Department Admin");
    //SMALL PROBLEM = so for each zone link AKA userprofile there is a isDepartmentAdmin and isZoneAdmin - i'd like to update that depending on selections
    if (accessGroupID == this.zoneAdminAGID) {
      this.userPofileService.updateAdminBool(this.thisUSERPID, null, false, this.CurrentUser.appUserId).subscribe((data: any) => {
        debugger;

        if (data.responseCode == 1) {
          console.log("This user is no longer a zone admin", data);
        }
        else {
          //alert(data.responseMessage);
          console.log(data.responseMessage);
        }
        console.log("UPDATED USER PROFILE: REMOVING FROM THE ZONE ADMIN ACCESS GROUP", data);

      }, error => {
        console.log("UPDATED USER PROFILE: REMOVING FROM THE ZONE ADMIN ACCESS GROUP", error);
      })
    }
    if (accessGroupID == this.departAdminAGID) {
      this.userPofileService.updateAdminBool(this.thisUSERPID, false, null, this.CurrentUser.appUserId).subscribe((data: any) => {
        debugger;

        if (data.responseCode == 1) {
          console.log("This user is no longer a department admin", data);
        }
        else {
          //alert(data.responseMessage);
          console.log(data.responseMessage);
        }
        console.log("UPDATED USER PROFILE: REMOVING FROM THE DEPARTMENT ADMIN ACCESS GROUP", data);

      }, error => {
        console.log("UPDATED USER PROFILE: REMOVING FROM THE DEPARTMENT ADMIN ACCESS GROUP", error);
      })
    }

    // Find the user's association in ThisUserAGList based on the AccessGroupID
    const userAccessGroup = this.ThisUserAGList.find(userAG => userAG.AccessGroupID === selectedAccessGroup.AccessGroupID);

    if (userAccessGroup) {
      const accessGroupUserLinkID = userAccessGroup.AccessGroupUserLinkID;


      const confirmation = confirm(`Are you sure you want to remove "${selectedAccessGroup.AccessGroupName}" privileges?`);

      if (confirmation) {
        this.accessGroupsService.deleteAccessGroupUserLinkByID(accessGroupUserLinkID).subscribe((data: any) => {
          if (data || data.response == 1) {

            console.log("DELETEDELETEDELETEDELETEACCESSGROUPACCESSGROUP");
            const indexOfUserAccessGroup = this.ThisUserAGList.indexOf(userAccessGroup);
            if (indexOfUserAccessGroup !== -1) {
              this.ThisUserAGList.splice(indexOfUserAccessGroup, 1);
            }
            this.getZoneAccessGroups(this.zoneId);
          } else {
            console.error('Error removing user from access group:', data.responseMessage);
          }
        });
      } else {
        console.log('Removal canceled by the user.');
      }
    } else {
      console.error('User access group not found for removal.');
    }
  }


  //isInternal, isActive
  newDirectorate: string = '';
  newDepartmentID: string = '';
  newSubDepartmentID: string = '';
  newBranch: string = '';

  newCreatedById: string = '';
  //need to be able to set this isDepartmentAdmin, isZoneAdmin
  //depConfirmation
  newzoneID: string = '';
  newSubDepartmentName: string = '';

  isEMBAdmin: boolean;



  addNewDepartmentUser() {
    debugger;

    if (this.loggedInUserDepartmentName == "EMB" || this.loggedInUsersDepartmentID == 28) {
      this.isEMBAdmin = true;
      this.getAllSubdepartments();
      console.log("Is this user in EMB???" + this.loggedInUserDepartmentName)
    }
    else {
      this.isEMBAdmin = false;
      this.selectedUsersDepartmentID = this.loggedInUsersDepartmentID;
      this.getSubdepartments();
    }
  }
  selectedDepartmentID: any;
  getSubdepartments() {
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    debugger;
    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.loggedInUsersDepartmentID).subscribe((data: any) => {
      debugger;

      if (data.responseCode == 1) {
        debugger;

        this.selectedDepartmentID = data.dateSet.departmentID;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.SubDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.SubDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.DepartmentID = current.departmentID;
          this.SubDepartmentList.push(tempSubDepartmentList);

        }

        console.log("Where are they??? SubDepartmentList", this.SubDepartmentList);
      }
      else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("SubDepartmentList", data);

    }, error => {
      console.log("SubDepartmentList: ", error);
    })
  }
  getAllSubdepartments() {
    this.AllSubDepartmentList.splice(0, this.AllSubDepartmentList.length);
    this.subDepartmentService.getSubDepartmentsList().subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {

        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.SubDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.SubDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.DepartmentID = current.departmentID;
          this.AllSubDepartmentList.push(tempSubDepartmentList);

        }

        console.log("Where are they??? SubDepartmentList", this.AllSubDepartmentList);
      }
      else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("SubDepartmentList", data);

    }, error => {
      console.log("SubDepartmentList: ", error);
    })
  }
  onSubdepartmentChange() {
    // Update data or perform actions based on the selected subdepartment
    //this.ZonesList = [];
    this.getZones(this.selectedSubdepartment).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.selectedDepartmentID = data.dateSet.departmentID;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZonesList = {} as ZonesList;
          const current = data.dateSet[i];
          tempZonesList.ZoneID = current.zoneID;
          tempZonesList.ZoneName = current.zoneName;
          tempZonesList.DepartmentID = current.departmentID;
          tempZonesList.SubDepartmentID = current.subDepartmentID;
          //this.ZonesList.push(tempZonesList); //so I was essentially pushing the zones list twice! **face palm*


        }
        //console.log("This is the selected departmentID ", this.selectedDepartmentID);
      } else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
    }, error => {
      console.log("ZonesList error: ", error);
    });

    // Trigger change detection to update the template
    //this.cdr.detectChanges();
  }
  getZones(subDeptID: any): Observable<any> {
    debugger;
    console.log('subDeptID:', subDeptID);
    this.ZonesList = [];
    return this.zonesService.getZonesBySubDepartmentsID(subDeptID)
      .pipe(
        tap((data: any) => {
          if (data.responseCode == 1) {

            this.ZonesList = data.dateSet.map(current => ({
              ZoneID: current.zoneID,
              ZoneName: current.zoneName,
              DepartmentID: current.departmentID,
              SubDepartmentID: current.subDepartmentID


            }));
            this.selectedDepartmentID = this.ZonesList[0].DepartmentID;

            console.log("This is the selected departmentID ", this.selectedDepartmentID);
            console.log("I got the ZonesList", this.ZonesList);
          } else {
            //alert(data.responseMessage);
            console.log(data.responseMessage);
          }
          console.log("ZonesList", data);
        }),
        catchError(error => {
          console.log("ZonesList: ", error);
          return throwError(error);
        })
      );
  }

  selectedSubdepartment: any;
  selectedZone: any;

  newName: string = '';
  newSurname: string = '';
  newCostCenterOwner: string = '';
  newCostCenterNumber: string = '';
  newEmail: string = '';
  newPhoneNumber: string = '';

  validEmail: boolean = false;
  validNames: boolean = false;

  clearFormFields() {
    this.selectedSubdepartment = null;
    this.selectedZone = null;
    this.newName = '';
    this.newSurname = '';
    this.newCostCenterOwner = '';
    this.newCostCenterNumber = '';
    this.newPhoneNumber = '';
    this.newEmail = '';
  }
  isSouthAfricanPhoneNumber(phoneNumber: string): boolean {
    const mobilePattern = /^(?:\+27|0)[678][0-9]{8}$/;
    const landlinePattern = /^(?:\+27|0)[0-9]{9,10}$/;

    if (mobilePattern.test(phoneNumber)) {
      return true//"Valid South African mobile number";
    } else if (landlinePattern.test(phoneNumber)) {
      return true;//"Valid South African landline number";
    } else {
      return false;//"Invalid phone number";
    }
  }

  async verifyingTheAddition(): Promise<void> {
    let internalSubdepartment = this.selectedSubdepartment;
    let internalZone = this.selectedZone;
    let internalName = this.newName;
    let internalSurname = this.newSurname;
    //let internalCostCenterOwner = this.newCostCenterOwner;
    //let internalCostCenterNumber = this.newCostCenterNumber;
    let internalPhoneNumber = this.newPhoneNumber;
    let internalEmail = this.newEmail + "@capetown.gov.za";

    //choose to the option to be able to leave the cost centre things and phone number empty

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (internalSubdepartment !== null &&
      internalZone !== null &&
      internalName !== null &&
      internalSurname !== null &&
      internalEmail !== null) {
      //number
      if (this.isSouthAfricanPhoneNumber(this.newPhoneNumber) || internalPhoneNumber === null || internalPhoneNumber.trim() === '') {
        //Do nothing, all is well
      }
      else {
        alert("Please enter a valid telephone or cell number")
        return;
      }

      //email
      if (!emailRegex.test(internalEmail)) {
        alert("Please enter a valid email address");
      }
      else {
        try {
          const exists = await this.userService.emailExists(internalEmail).toPromise();
          if (exists) {
            debugger;
            this.validEmail = true;
            await this.handlingEmailExist(internalEmail, internalSubdepartment);
            //debugger;
            //alert("Email already exists in wayleave system. Are you sure you want to add this user to this department as well?");

          }
          else {
            this.validEmail = true;
            this.existingUser = false;
          }
        }
        catch (error) {
          console.error("An error occurred possibly due to the email you entered: ", error);
          this.validEmail = false;
        }
      }

      const nameWords = internalName.split(' ');
      const surnameWords = internalSurname.split(' ');

      //name and surname
      if (nameWords.length === 1 && surnameWords.length === 1) {
        this.validNames = true;
      } else {
        this.validNames = false;
        alert('Name and surname should contain only one word each.');
      }
    }
    else {
      alert('Please fill in all required fields.');
    }

  }
  //These variables are for when a user has a wayleave profile but is NOT in this subdepartment
  emailSubDepartmentID: any = null;
  emailUSerID = '';
  emailUSerProfileID: number;
  emailFullName = '';
  emailName = '';
  emailSurname = '';
  emailTelNumber: any;

  existingUser: boolean = false; //old user in new department, well - extra department that is not their default USERPROFILETABLE subdepartment

  async handlingEmailExist(email: string, selectedSubDepID: number) {
    try {
      const data: any = await this.userPofileService.getUserByEmail(email).toPromise();
      debugger;
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          let current = data.dateSet[i];

          // Skip profiles with null subDepartmentID
          if (current.subDepartmentID === null) {
            continue;
          }

          this.emailSubDepartmentID = current.subDepartmentID;
          this.emailUSerID = current.userID;
          this.emailUSerProfileID = current.userProfileID;
          this.emailFullName = current.fullName;
          this.emailName = current.name;
          this.emailSurname = current.surname;
          this.emailTelNumber = current.phoneNumber;

          console.log("Profile found for this email:", current);
          console.log("SubDepartmentID of the profile:", this.emailSubDepartmentID);
          console.log("UserID of the profile:", this.emailUSerID);

          await this.getSubdepartmentName(current.subDepartmentID);
          if (this.emailSubDepartmentID == selectedSubDepID) {
            alert(this.emailFullName + " is already linked to the " + this.theSubDepartmentName + " subdepartment.");
            // Break out of the loop since we found a match
            break;
          }
        }
        if (this.emailSubDepartmentID != selectedSubDepID) {
          const zoneData: any = await this.zoneLinkService.getBySubAndUserID(selectedSubDepID, this.emailUSerID).toPromise();
          if (zoneData.responseCode == 1) {
            if (zoneData.dateSet.length > 1) {
              await this.getSubdepartmentName(selectedSubDepID);
              this.validEmail = false;
              alert(this.emailFullName + " is already linked to the " + this.theSubDepartmentName + " subdepartment.");
            } else {
              this.validEmail = true;
              this.existingUser = true; //THAT IS NOT IN THIS DEPARTMENT
              console.log("The user is not linked to this department.");
              // You can add the user to this department here
              // Emails must be linked to one person only!!
              // This is where you should create a new profile for the person...
            }
          }
        }
      }
    } catch (error) {
      console.error("An error occurred in handlingEmailExist: ", error);
    }
  }


  reviewerAGID: any = null;
  thisUSERPID: number;
  async addingTheUser(viewDepartmentPerson: any) {

    let internalCostCenterOwner = this.newCostCenterOwner;
    let internalCostCenterNumber = this.newCostCenterNumber;
    let internalPhoneNumber = this.newPhoneNumber;
    let internalSubdepartment = this.selectedSubdepartment;
    let internalZone = this.selectedZone;
    let internalName = this.newName;
    let internalSurname = this.newSurname;
    let internalEmail = this.newEmail + "@capetown.gov.za";

    try {
      await this.getSubdepartmentName(internalSubdepartment);
      await this.verifyingTheAddition();

      console.log("validNames:", this.validNames);
      console.log("validEmail:", this.validEmail);
      console.log("existingUser:", this.existingUser);

      if (this.validNames && this.validEmail && this.existingUser) {
        //this user is already in the userprofile table

        //remember that the default access groups at time of link are "Reviewer" and "Capturer?"
        await this.getDepartmentID(internalSubdepartment);
        await this.getDepartmentName(this.theDepartmentID);
        await this.getSubdepartmentName(internalSubdepartment);
        const zoneName: string = await this.getTheirZoneName(internalZone);
        this.reviewerAGID = this.getAccessGroupIdByName("Reviewer");
        debugger;
        await this.userPofileService.addUpdateUserProfiles(0, this.emailUSerID, this.emailFullName, internalEmail, this.emailTelNumber, true, null, null, null, null, this.theDepartmentName,
          this.theDepartmentID, internalSubdepartment, null, internalCostCenterNumber, internalCostCenterOwner, null, this.CurrentUser.appUserId, null, internalZone,
          null, null, null, null, null, this.theSubDepartmentName, null, null, this.emailName, this.emailSurname, this.theDepartmentName, zoneName, false, null, true).subscribe(async (data: any) => {

            debugger;
            if (data && data.responseCode == 1) {
              const current = data.dateSet;
              debugger;
              console.log("I have created a new userprofile for an existing user, nansi: ", current)
              this.thisUSERPID = current.userProfileID;
              this.zoneId = data.dateSet.zoneID;

              await this.userPofileService.userGainsApproval(this.thisUSERPID).subscribe((data: any) => {

              })
              // TODO: subdeptId and zoneId
              await this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.reviewerAGID, this.emailUSerID, this.CurrentUser.appUserId, internalZone, internalSubdepartment, this.thisUSERPID).subscribe(async (data: any) => {
                ;
                if (data.responseCode == 1) {
                  //alert(data.responseMessage);
                  console.log(data.responseMessage);

                  debugger;
                  this.newAcessGroupUserLinkID = data.dateSet.accessGroupUserLinkID;
                  debugger;
                  //Note: that I decided that the default access group is reviewer.

                  alert("Since " + internalEmail + " is linked to a " + this.emailFullName + " a new profile linked to " + this.theSubDepartmentName + " has been created for them.");
                  this.clearFormFields();
                  this.showLinkedUsers();
                  this.theirSelectedZoneName = await this.getTheirZoneName(internalZone);
                  this.selectedUserID = this.emailUSerID;
                  this.subDeptID = internalSubdepartment;
                  this.selectedUserName = this.emailFullName;
                  this.theirSelectedSubDepartment = this.theSubDepartmentName;
                  await this.getZoneAccessGroups(internalZone);
                  this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
                  //WE ARE NO LONGER USING THE ZONE LINK TABLE!!
                  /*await this.zoneLinkService.addUpdateZoneLink(0, internalZone, this.ZoneName, this.theDepartmentID, this.subDeptID, this.subDeptName, this.emailUSerID, null, this.CurrentUser.appUserId, false, false, this.newAcessGroupUserLinkID, "Reviewer").subscribe((data: any) => {
                    debugger;
                    if (data.responseCode == 1) {
                      //alert(data.responseMessage);
                      console.log(data.responseMessage);
  
                    }
                    else {
                      // alert(data.responseMessage);
                      console.log(data.responseMessage);
                    }
                    console.log("Response after trying to add user into the ZoneLink table: ", data);
  
                  }, error => {
                    console.log("Error after trying to add user into the ZoneLink table: ", error);
                  })*/
                }
                else {
                  // alert(data.responseMessage);
                  console.log(data.responseMessage);
                }
                console.log("Response after trying to auto approve the user: ", data);

              }, error => {
                console.log("Error after trying to auto approve the user: ", error);
              })
            }
            else {
              console.log("This happened when you tried to add an exisisting wayleave user to another department: ", data.responseMessage);
            }
          }, error => {
            console.log("Error: ", error);
          })
      }
      else if (this.validNames && this.validEmail && !this.existingUser) {
        //register the user and create a profile
        this.userService.register(internalName + " " + internalSurname, internalEmail, "12345").subscribe(async (data: any) => {
          if (data.responseCode == 1) {

            debugger;
            this.sharedService.userIDForWalkIn == data.dateSet.appUserId; //added to add access user ID, when trying to create new wayleave for new client?

            //link them to this department and zone - approve them too
            //then open access group link list!
            await this.getDepartmentID(internalSubdepartment);
            await this.getDepartmentName(this.theDepartmentID);
            const zoneName: string = await this.getTheirZoneName(internalZone);

            this.userPofileService.addUpdateUserProfiles(
              0, data.dateSet.appUserId, internalName + " " + internalSurname, internalEmail, internalPhoneNumber, true, null, null, null,
              null, this.theDepartmentName, this.theDepartmentID, internalSubdepartment, null, internalCostCenterNumber, internalCostCenterOwner, null, this.CurrentUser.appUserId, null, internalZone,
              null, null, null, null, null, this.theSubDepartmentName, null, null, internalName, internalSurname, this.theDepartmentName, zoneName, true, null, true).subscribe(async (data: any) => {

                if (data.responseCode == 1) {
                  debugger;
                  //alert(data.responseMessage);
                  console.log(data.responseMessage);
                  this.thisUSERPID = data.dateSet.userProfileID;
                  this.selectedUserID = data.dateSet.userID;
                  this.userProfileID = data.dateSet.userProfileID;
                  this.subDeptID = data.dateSet.subDepartmentID;
                  this.zoneId = data.dateSet.zoneID;
                  this.subDeptName = data.dateSet.subDepartmentName;
                  debugger;
                  await this.getSubdepartmentName(data.dateSet.subDepartmentID);
                  this.ZoneName = await this.getZoneByZoneId(this.zoneId);

                  console.log("DATADATADATADATADATA, this is related to a new user being added via the department manager.", data);

                  this.selectedUserName = internalName + " " + internalSurname;
                  this.theirSelectedSubDepartment = this.subDeptName;
                  this.autoApproveNewUser();
                  //this.getZoneAccessGroups(this.zoneId);
                  this.showLinkedUsers(); //I hope this will refresh the modal - it didn't
                  this.theirSelectedZoneName = await this.getTheirZoneName(internalZone);
                  //await this.getAccessGroups();
                  await this.getZoneAccessGroups(this.zoneId);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  alert("A new " + this.subDeptName + " user has been created");
                  this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
                }
                else {
                  //alert(data.responseMessage)
                  console.log(data.responseMessage);
                }
              }, error => {
                console.log("Error: ", error);
              })
          }
          else {
            //alert(data.responseMessage);
            console.log(data.responseMessage);

          }
          console.log("DATADATADATADATADATA, this is related to a user being added via the department manager.", data);
        }, error => {
          console.log("Error: ", error);
        })
        //why don't we use this UserProfile entity property public bool? depConfirmation { get; set; } to auto approve???
        //the zone link table is supposed to also have the AccessGroupName and AccessGroupUserLinkID
        this.clearFormFields();
      }
      else {
        alert("There seem to be some verification issues.")
      }
    }
    catch (error) {
      console.error("Error while adding new user in department manager:", error);
    }
  }

  newUserAccessGroupID: number = 1002; //default access group is that of reviewer
  newUserAccessGroupName: any;
  newAcessGroupUserLinkID: any;

  autoApproveNewUser() {
    debugger;
    // TODO: FIX THE LAST ARGUMENT
    this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.newUserAccessGroupID, this.selectedUserID, this.CurrentUser.appUserId, this.zoneId, this.subDeptID, this.userProfileID).subscribe((data: any) => {
      ;
      if (data.responseCode == 1) {
        //alert(data.responseMessage);
        console.log(data.responseMessage);

        debugger;
        this.newAcessGroupUserLinkID = data.dateSet.accessGroupUserLinkID;
        debugger;
        //Note: that I decided that the default access group is reviewer.

        //TODO : remove zone link tings
        this.zoneLinkService.addUpdateZoneLink(0, this.zoneId, this.ZoneName, this.theDepartmentID, this.subDeptID, this.subDeptName, this.selectedUserID, null, this.CurrentUser.appUserId, false, false, this.newAcessGroupUserLinkID, "Reviewer").subscribe((data: any) => {
          debugger;
          if (data.responseCode == 1) {
            //alert(data.responseMessage);
            console.log(data.responseMessage);

          }
          else {
            // alert(data.responseMessage);
            console.log(data.responseMessage);
          }
          console.log("Response after trying to add user into the ZoneLink table: ", data);

        }, error => {
          console.log("Error after trying to add user into the ZoneLink table: ", error);
        })


      }
      else {
        // alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("Response after trying to auto approve the user: ", data);

    }, error => {
      console.log("Error after trying to auto approve the user: ", error);
    })


    //this is for acppeting the user into the department
    this.userPofileService.userGainsApproval(this.userProfileID).subscribe((data: any) => {
      this.UserList.splice(0, this.UserList.length);
      debugger;
      if (data.responseCode == 1) {

        //alert(data.responseMessage);
        console.log(data.responseMessage);
        this.getAllusersNotLinkedToDep();
      }
      else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("I think you got approval: ", data);

    }, error => {
      console.log("Error, maybe you didn't get approval: ", error);
    })
    this.getAccessGroups();
  }

  theirSubdepartmentID: any;
  theirSubdepartment: '';
  theirSelectedSubDepartment: any;
  theirSelectedZone: any;
  theirSelectedZoneName: string;
  theirName: '';
  theirSurname: '';
  theirCostCenterOwner: '';
  theirCostCenterNumber: '';
  theirPhoneNumber: '';
  theirEmail: '';
  TheirZonesList: ZonesList[] = [];
  async addToMoreZones(index: any, addToZones: any) {
    debugger;
    this.TheirZonesList.splice(0, this.TheirZonesList.length);
    //this.thisUserZoneInfo();
    /*get zone link information
    -userID and Subdepartment will be your in, then in that sub department ignore the accessgroups for a sec then get ZoneID
    --if they are linked to one zone in that subdepartment then all is well
    --
    */
    this.selectedUser = index;
    //this.selectedUserID = this.ZoneLinkList[index].userID;
    //this.selectedUserName = this.ZoneLinkList[index].fullName;

    this.selectedUserID = this.dataSourceZoneLink[index].userID;
    this.selectedUserName = this.dataSourceZoneLink[index].fullName;
    debugger;
    this.getZoneLinks(this.selectedUserID);
    //1. Search the UserProfileTable
    this.userPofileService.getUserProfileById(this.selectedUserID).subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const current = data.dateSet[0];
        this.theirEmail = current.email
        this.theirName = current.fullName.split(' ')[0];
        this.theirSurname = current.fullName.split(' ')[1];
        this.theirCostCenterNumber = current.costCenterNumber;
        this.theirCostCenterOwner = current.costCenterOwner;
        this.theirPhoneNumber = current.phoneNumber;
        this.theirSubdepartmentID = current.subDepartmentID;
        await this.getSubdepartmentName(current.subDepartmentID);
        //2. Create the Zones drop down
        await this.getZones(current.subDepartmentID).subscribe((data: any) => {
          if (data.responseCode == 1) {
            //this.selectedDepartmentID = data.dateSet.departmentID;
            for (let i = 0; i < data.dateSet.length; i++) {
              const tempTheirZonesList = {} as ZonesList;
              const current = data.dateSet[i];
              tempTheirZonesList.ZoneID = current.zoneID;
              tempTheirZonesList.ZoneName = current.zoneName;
              tempTheirZonesList.DepartmentID = current.departmentID;
              tempTheirZonesList.SubDepartmentID = current.subDepartmentID;
              this.TheirZonesList.push(tempTheirZonesList);
            }
          } else {
            //alert(data.responseMessage);
            console.log(data.responseMessage);
          }
        }, error => {
          console.log("ZonesList error: ", error);
        });

        console.log("Please tell me that the data I need to add a user to more zones is here", data);
        console.log(data.responseMessage);
      } else {
        console.log(data.responseMessage);
      }
      console.log("All I want is the DepartmentName: ", data);
    }, error => {
      console.log("Error: ", error);
    });


    this.modalService.open(addToZones, { centered: true, size: 'lg' });
  }
  //isZoneInList: any;
  TheirZoneLinkDetailsList: ZoneLinkList[] = [];

  thisUserZoneInfo(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.zoneLinkService.getBySubAndUserID(this.theirSubdepartmentID, this.selectedUserID).subscribe(
        (data: any) => {
          if (data.responseCode == 1) {
            for (let i = 0; i < data.dateSet.length; i++) {
              const tempTheirZoneLinkDetailsList = {} as ZoneLinkList;
              const current = data.dateSet[i];
              tempTheirZoneLinkDetailsList.ZoneID = current.zoneID;
              tempTheirZoneLinkDetailsList.zoneName = current.zoneName;
              this.TheirZoneLinkDetailsList.push(tempTheirZoneLinkDetailsList);
            }
            console.log("I want to know which zones they are in: ", data);
            console.table(this.TheirZoneLinkDetailsList);
            console.log(data.responseMessage);
            resolve(); // Resolve the promise when data is processed
          } else {
            console.log(data.responseMessage);
            reject("Data retrieval error");
          }
        },
        (error) => {
          console.log("Error: ", error);
          reject("Data retrieval error");
        }
      );
    });
  }

  async addToMoreZones2(viewDepartmentPerson: any) {
    debugger;
    try {
      await this.thisUserZoneInfo();

      // 4. Check if selected zone matches a zone they are already linked to
      if (this.theirSelectedZone === null || this.theirSelectedZone === undefined) {
        console.log("Selected zone is null.");
        alert("Selected zone is null.");
      } else {
        console.log("This is the selectedZone", this.theirSelectedZone);

        if (this.checkZoneInTheirZoneLink(this.theirSelectedZone)) {
          alert("The user is already in the selected zone, consider editing access groups.");
          console.log(`Zone ${this.theirSelectedZone} exists in TheirZoneLinkDetailsList.`);
        } else {
          console.log(`Zone ${this.theirSelectedZone} does not exist in TheirZoneLinkDetailsList.`);
          // 5. This is when you can add them to that Zone
          await this.internalInOtherZoneOrDpt();
          this.linkToAnotherZone(viewDepartmentPerson);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }


  getAccessGroupIdByName(targetName: string): number | null {
    const accessGroup = this.AccessGroupList.find(group => group.AccessGroupName === targetName);
    if (accessGroup) {
      return accessGroup.AccessGroupID;
    } else {
      return null; // Return null if not found
    }
  }

  async linkToAnotherZone(viewDepartmentPerson: any) {

    //await this.getZoneLinks(this.selectedUserID);
    const ReviewerID = this.getAccessGroupIdByName("Reviewer");
    this.theirSelectedZoneName = await this.getZoneByZoneId(this.theirSelectedZone);

    console.log("What is my user profile ID: ", this.createdUPID)
    // TODO: FIX THE LAST ARGUMENT
    this.accessGroupsService.addUpdateAccessGroupUserLink(0, ReviewerID, this.selectedUserID, this.CurrentUser.appUserId, this.theirSelectedZone, this.theirSubdepartmentID, this.createdUPID).subscribe((data: any) => {
      ;
      if (data.responseCode == 1) {
        //alert(data.responseMessage);
        console.log(data.responseMessage);

        debugger;
        this.newAcessGroupUserLinkID = data.dateSet.accessGroupUserLinkID;
        debugger;
        //Note: that I decided that the default access group is reviewer.

        this.zoneLinkService.addUpdateZoneLink(0, this.theirSelectedZone, this.theirSelectedZoneName, this.theDepartmentID, this.theirSubdepartmentID, this.theSubDepartmentName, this.selectedUserID,
          null, this.CurrentUser.appUserId, false, false, this.newAcessGroupUserLinkID, "Reviewer").subscribe(async (zoneLinkData: any) => {
            if (zoneLinkData.responseCode == 1) {
              await this.getZoneLinks(this.selectedUserID);
              //NEED TO GET ZONE INFOMATION!!!
              this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
              console.log(zoneLinkData.responseMessage);
            } else {

              console.log(zoneLinkData.responseMessage);
            }
            console.log("response", zoneLinkData);
          }, error => {
            // Handle errors that may occur during the zone link update.
            console.log("Error: ", error);
          });
      }
      else {
        // alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("Response after trying to auto approve the user via zone link: ", data);

    }, error => {
      console.log("Error after trying to auto approve the user via zone link: ", error);
    })

  }

  getZoneLinks(userID: any) {
    debugger;
    this.zoneLinkService.getAllUserLinks(userID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        console.log(data.responseMessage);
      } else {

        console.log(data.responseMessage);
      }
      console.log("My person's ZoneLink info:", data);
    }, error => {
      // Handle errors that may occur during the zone link update.
      console.log("Error: ", error);
    });
  }
  checkZoneInTheirZoneLink(zoneId: number): boolean {
    // Assuming ZoneLinkList has a property named ZoneID
    debugger;
    // Use Array.some() to check if the zoneId exists in the TheirZoneLinkDetailsList
    return this.TheirZoneLinkDetailsList.some((zoneLink: ZoneLinkList) => {
      return zoneLink.ZoneID === zoneId;
    });
  }
  nameToUnlink: string = '';
  zoneToUnlinkFrom: string = '';
  async removeUserFromDPT(index: any, allUsers: any) {
    //this is to remove a person from a zone

    debugger;
    this.selectedUserIndex = this.dataSourceZoneLink[index].userProfileID;
    this.nameToUnlink = this.dataSourceZoneLink[index].fullName;
    this.zoneToUnlinkFrom = this.dataSourceZoneLink[index].zoneName;

    const isConfirmed = window.confirm("Are you sure you want to remove " + this.nameToUnlink + " from " + this.zoneToUnlinkFrom + "?");

    if (!isConfirmed) {
      return; // Do nothing if the user cancels the confirmation
    }

    await this.userPofileService.deleteUserProfile(this.selectedUserIndex).subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        debugger;
        console.log(data.responseMessage);

        await this.showLinkedUsers()
          .then(() => {
            this.dataSourceZoneLink = [...this.ZoneLinkList];
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });

      } else {

        console.log(data.responseMessage);
      }
      console.log("I'm just trying to unlink a user AKA delete a userprofile:", data);

    }, error => {
      // Handle errors that may occur during the zone link update.
      console.log("Error: ", error);
    })
    //I should probably "remove" accessgroup links while I'm at it no?
    this.accessGroupsService.deleteUserAGZoneLinks(this.selectedUserIndex).subscribe(async (data: any) => {
      if (data.responseCode == 1) {

        await this.openAllUsersModal(allUsers);
      } else {

        console.log(data.responseMessage);
      }
      console.log("I'm just trying to unlink a user from a zone and revoke acess group privileges:", data);

    }, error => {
      // Handle errors that may occur during the zone link update.
      console.log("Error: ", error);
    })

  }

  FilterBtn: boolean = false;
  DepartFilter: boolean = false;
  FilterValue = "";

  multiFilter: boolean = false;

  openFilterModal(moreFilter: any) {
    this.getAllSubdepartments();
    this.modalService.dismissAll();
    this.openFilterSettingsModal(moreFilter);
  }

  //selectZone = 0;
  selectAG: number | 'all' = 0;

  onAccessGroupChange() {
    if (this.selectAG === 'all') {
      // User selected "Select All," set selectAG to an array of all AccessGroupIDs
      const allAccessGroupIDs = this.AccessGroupList.map(access => access.AccessGroupID);
      // You might want to perform additional logic here if needed
      console.log('All Access Groups selected:', allAccessGroupIDs);
      this.selectAG = 'all';
    } else {
      //? Do I even need this?
    }
  }

  resetFilterSelections(): void {
    this.selectedSubdepartment = null;
    this.selectedZone = null;
    this.selectAG = null;
  }

  async onMultiFilterChoices(allUsers: any) {
    this.multiFilter = true;

    console.log('selectedSubdepartment:', this.selectedSubdepartment);
    console.log('selectedZone:', this.selectedZone);
    console.log('selectAG:', this.selectAG);
    console.log('Subdepartment list yaka:', this.AllSubDepartmentList);
    console.log('Zone list yaka:', this.ZonesList);
    console.log('Access Group list yaka:', this.AccessGroupList);

    if (!this.selectedSubdepartment || this.selectedZone === 0 || this.selectAG === 0) {

      console.log('Please select a valid option for all fields.');
      return; // Exit the function
    }

    let subDepartment = this.AllSubDepartmentList
      .find(department => department.SubDepartmentID === Number(this.selectedSubdepartment));

    let zone = this.ZonesList
      .find(zone => zone.ZoneID === Number(this.selectedZone));

    console.log('Found Subdepartment:', subDepartment);
    console.log('Found Zone:', zone);

    let subDepartmentName = subDepartment ? subDepartment.SubDepartmentName : '';
    let zoneName = zone ? zone.ZoneName : '';


    if (this.selectAG == 'all') {

      this.FilterValue = "You Are Currently Viewing All " + zoneName + " " + subDepartmentName + " Users";
      const data: any = await this.accessGroupLinkService.getPeopleByZone(this.selectedZone).toPromise();

      const userPIDs = data.dateSet.map((item: any) => item.userProfileID);
      console.log("These are the userProfileIDs that match my zone search:", userPIDs);
      this.zoneFilterList = this.ZoneLinkList.filter(user => userPIDs.includes(user.userProfileID));

      this.dataSourceZoneLink = [...this.zoneFilterList];
      this.ZoneDepTable?.renderRows();


    }
    else {
      let accessGroup = this.AccessGroupList
        .find(access => access.AccessGroupID === Number(this.selectAG));
      console.log('Found Access Group:', accessGroup);
      let accessGroupName = accessGroup ? accessGroup.AccessGroupName : '';
      this.FilterValue = `You are currently viewing ${zoneName} ${accessGroupName}s of the ${subDepartmentName} subdepartment`;

      const data: any = await this.accessGroupLinkService.getPeopleByAccessGroupAndZone(this.selectAG, this.selectedZone, null).toPromise();
      const userPIDs = data.dateSet.map((item: any) => item.userProfileID);
      console.log("These are the userProfileIDs that match my zone search:", userPIDs);
      this.zoneFilterList = this.ZoneLinkList.filter(user => userPIDs.includes(user.userProfileID));

      this.dataSourceZoneLink = [...this.zoneFilterList];
      this.ZoneDepTable?.renderRows();
    }
    this.resetFilterSelections();
    this.modalService.dismissAll();
    this.openAllUsersModal(allUsers);
  }
  getAllDepartments() {
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          this.DepartmentList.push(tempDepartmentList);

        }

        console.log("These are the wayleave departments:", this.DepartmentList);
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

  onUnselection() {
    this.selectedUserID = null;
    this.userProfileID = null;
    this.selectedUserName = null;
    this.subDeptID = null;
    this.theirSubdepartmentID = null;
    this.zoneId = null;
    this.ZoneName = null;
    this.subDeptName = null;
    console.log("WHO IS SELECTED? NOBODY")
  }
  onFilterButtonClick() {
    this.DepartFilter = false;
    this.multiFilter = false;
    this.isAGFilter = false;
    this.isZoneFilter = false;
    this.dataSourceZoneLink = [...this.ZoneLinkList];
  }
  filterID: any;
  newList = [];
  newFilterList = [];
  onFilterByDepartment(selectedDept: any): void {
    this.DepartFilter = true;
    this.FilterValue = selectedDept.departmentName;
    this.filterID = selectedDept.departmentID;
    console.log("The selected filter-by department is:", this.FilterValue);

    debugger;

    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.filterID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const subDepartmentIDs = data.dateSet.map(item => item.subDepartmentID);

        /*for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          debugger;
          tempDepartmentList.SubDepartmentID = current.subDepartmentID;
          tempDepartmentList.SubDepartmentName = current.subDepartmentName;
          tempDepartmentList.DepartmentID = current.departmentID;
          this.SubDepartmentList.push(tempDepartmentList);
        }*/

        this.newFilterList = this.ZoneLinkList.filter(user => subDepartmentIDs.includes(user.subDepartmentID));

        console.log("Filtered result:", this.newFilterList);

        this.dataSourceZoneLink = [...this.newFilterList];
        this.ZoneDepTable?.renderRows();
        console.log("This is the filtered list:", this.dataSourceZoneLink);
        console.log("These are the wayleave subdepartments:", this.DepartmentList);
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

  applyFilter(event: Event): string[] {
    const filterValue = (event.target as HTMLInputElement).value.trim().toUpperCase();
    if (filterValue === "") {

      // If the filter is empty, reset the dataSource to the original data
      //TODO: Make sure filter is applied to current list

      if (this.DepartFilter == false) {
        this.dataSourceZoneLink = [...this.ZoneLinkList];
      }
      else if (this.DepartFilter == true) {
        this.dataSourceZoneLink = [...this.newFilterList];
      }
      else if (this.multiFilter == true) {
        this.dataSourceLinkUsers = [...this.zoneFilterList];
      }

      this.newList = [];
      this.ZoneDepTable?.renderRows();
      return this.dataSourceZoneLink.map(user => user.fullName || "");

      ;
    } else {

      const sanitizedFilterValue = filterValue.replace(/[^\w\s]/g, '');
      const regex = new RegExp(sanitizedFilterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      // Render the rows after applying the filter

      // Apply the filter to the dataSource based on the internal user's FULL NAME property
      if (this.DepartFilter == false) {
        this.dataSourceZoneLink = this.ZoneLinkList.filter(user => {

          const sanitizedname = (user.fullName || '').replace(/[^\w\s]/g, '');
          return regex.test(sanitizedname.toUpperCase());
        });
      }
      else if (this.DepartFilter == true) {
        this.dataSourceZoneLink = this.newFilterList.filter(user => {

          const sanitizedname = (user.fullName || '').replace(/[^\w\s]/g, '');
          return regex.test(sanitizedname.toUpperCase());
        });
      }
      else if (this.multiFilter == true) {
        this.dataSourceZoneLink = this.zoneFilterList.filter(user => {

          const sanitizedname = (user.fullName || '').replace(/[^\w\s]/g, '');
          return regex.test(sanitizedname.toUpperCase());
        });
      }


      this.ZoneDepTable?.renderRows();
      this.newList = [...this.dataSourceZoneLink];
      console.log(this.newList);
      // Extract and return the filtered names
      return this.newList.map(user => user.fullName || "");
    }
  }
  showAccessGroups() {

  }
  intFullName: string = '';
  intEmail: string = '';
  intPhone: any = '';
  intZoneName: string = 'Zone Name';
  intSubDeptID: number = 0;


  kyleSubDptIDs: any[] = []
  kyleZoneIDs: any[] = []
  allZoneIDs: any[] = []

  async addUserToAlles(index: any) {
    this.getAllAccessGroup();
    await this.getAllSubdepartments();

    this.selectedUserID = this.dataSourceZoneLink[index].userID;
    this.userProfileID = this.dataSourceZoneLink[index].userProfileID;
    this.thisUSERPID = this.dataSourceZoneLink[index].userProfileID;

    const data: any = await this.userPofileService.getUserProfileById(this.selectedUserID).toPromise();
    console.log("This is what I got about the selected user", data.dateSet);
    let userProfileID, zoneId, subDeptID, fullName, email, name, surname, phoneNumber;
    if (data.dateSet && data.dateSet.length > 0) {
      for (let i = 0; i < data.dateSet.length; i++) {

        const current = data.dateSet[i];
        userProfileID = current.userProfileID;
        zoneId = current.zoneID;
        subDeptID = current.subDepartmentID;

        fullName = current.fullName;
        email = current.email;
        name = current.name;
        surname = current.surname;
        phoneNumber = current.phoneNumber;

        this.kyleSubDptIDs.push(subDeptID);
        this.kyleZoneIDs.push(zoneId);

        
        //FINDING ACCESSGROUPS THEY ARE NOT A PART OF IN THE ZONES THEY ARE IN
        const agData: any = await this.accessGroupLinkService.getAccessGroupsByUserProfileID(userProfileID).toPromise();
        if (agData.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const tempAccessList = {} as TheirAccessGroupList;
            const current = data.dateSet[i];
            debugger;
            tempAccessList.AccessGroupUserLinkID = current.accessGroupUserLinkID;
            tempAccessList.AccessGroupID = current.accessGroupID;
            tempAccessList.ZoneID = current.zoneID;
            console.table(tempAccessList);
            this.ThisUserAGList.push(tempAccessList);
          }

          const thisUserAGIDs = this.ThisUserAGList.map(entry => entry.AccessGroupID);
          const differenceAGIDs = this.AccessGroupList.filter(accessGroup => !thisUserAGIDs.includes(accessGroup.AccessGroupID));

          for (const ag of differenceAGIDs) {
            this.accessGroupsService.addUpdateAccessGroupUserLink(0, ag.AccessGroupID, this.selectedUserID, this.CurrentUser.appUserId, zoneId, subDeptID, userProfileID).subscribe((data: any) => {
              if (data.responseCode == 1) {
                console.log("Adding user to the remaining accessgroups in the zone they are already in", data);
              }
            })
          }

          console.log("Zone specific access group info: ", agData);
        } else {
          console.log(agData.responseMessage);
          throw new Error(`Error: ${data.responseMessage}`);
        }
      }

      console.log("These are all the subdepartments kyle is in", this.kyleSubDptIDs);

      let allKyleZoneIDs;
      for (const kyleSubDptID of this.kyleSubDptIDs) {
        const data: any = await this.zoneService.getZonesBySubDepartmentsID(kyleSubDptID).toPromise();

        if (data.dateSet && data.dateSet.length > 0) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            allKyleZoneIDs = current.zoneID;

            this.allZoneIDs.push(allKyleZoneIDs);
            console.log("These are all the zones kyle should be in", current);
          }

        }
      }

      //ZONES THEY ARE NOT A PART OF...

      const differenceZoneIDs = this.allZoneIDs.filter(zoneID => !this.kyleZoneIDs.includes(zoneID));

      for (const zone of differenceZoneIDs) {
        const data: any = await this.zoneService.getZoneByZoneID(zone).toPromise();
        if (data.dateSet && data.dateSet.length > 0) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const zoneID = current.zoneID;
            const zoneName = current.zoneName;
            const departmentID = current.departmentID;
            const subDepartmentID = current.subDepartmentID;

            await this.getDepartmentName(current.departmentID); // this.theDepartmentName
            await this.getSubdepartmentName(current.subDepartmentID);

            this.userPofileService.addUpdateUserProfiles(0, this.selectedUserID, fullName, email, phoneNumber, true, null, null, null, null, this.theDepartmentName, departmentID, subDepartmentID, null, (8888).toString(), "Mass Add",
              null, this.CurrentUser.appUserId, null, zoneID, null, null, null, true, true, this.theSubDepartmentName, null, null, name, surname, this.theDepartmentName, zoneName, false, null, true).subscribe(async (data: any) => {
                if (data.responseCode == 1) {
                  console.log("This is my new profile info", data);
                  const UPID = await data.dateSet.userProfileID;
                  console.log("My new profile ID", UPID)
                  this.createdUPID = UPID;
                  this.userPofileService.userGainsApproval(UPID).subscribe((data: any) => {
                    if (data.responseCode == 1) {

                      for (let j = 0; j < this.AccessGroupList.length; j++) {
                        const accessgroupID = this.AccessGroupList[j].AccessGroupID;
                        // Perform your action with accessGroupsService here
                        this.accessGroupsService.addUpdateAccessGroupUserLink(0, accessgroupID, this.selectedUserID, this.CurrentUser.appUserId, zoneID, subDeptID, UPID).subscribe((data: any) => {
                          if (data.responseCode == 1) {
                            console.log("The selected user is being added to ALL access groups in the zones they DIDN'T already belong to", data);
                          }
                        });
                      }
                      console.log("Finished processing Access Groups");
                    } else {
                      console.log("No data or empty dateSet");
                    }
                  });

                }
                else {

                }
              });
          }

        } else {
          //No zones?
        }
        
      }

     
      const differenceSubDptIDs = this.AllSubDepartmentList
        .map(subDept => subDept.SubDepartmentID)
        .filter(subDeptID => !this.kyleSubDptIDs.includes(subDeptID));

      //SUBDEPARTMENTS THEY ARE NOT A PART OF...
      //START WITH THE SUBDEPARTEMENTS WHERE THERE ARE NO LINKS AT ALL
      /*1. New user Profile ID for each zone in subdepartment
        2. Gain approval
        3. AG link */
      for (const subDeptID of differenceSubDptIDs) {

        await this.getDepartmentID(subDeptID); //this.theDepartmentID

        await this.getDepartmentName(this.theDepartmentID); // this.theDepartmentName

        // Get the subdepartment information using the subdepartment ID
        const subDeptInfo: any = await this.subDepartmentService.getSubDepartmentBySubDepartmentID(subDeptID).toPromise();

        // Get the zones for the current subdepartment
        const zones: any = await this.zonesService.getZonesBySubDepartmentsID(subDeptID).toPromise();

        // Perform any additional actions or logging based on the obtained information
        console.log("Subdepartment ID:", subDeptID);
        console.log("Department ID:", this.theDepartmentID);
        console.log("Department Name:", this.theDepartmentName);
        console.log("Subdepartment Info:", subDeptInfo.dateSet);
        console.log("Zones:", zones.dateSet);

        subDeptInfo.dateSet.forEach((subdept) => {

          const subDeptName = subdept.subDepartmentName;

          zones.dateSet.forEach((zone) => {
            const zoneName = zone.zoneName;
            const zoneID = zone.zoneID;

            console.log("ZoneName:", zoneName);
            console.log("ZoneID:", zoneID);


            this.userPofileService.addUpdateUserProfiles(0, this.selectedUserID, fullName, email, phoneNumber, true, null, null, null, null, this.theDepartmentName, this.theDepartmentID, subDeptID, null, (8888).toString(), "Mass Add",
              null, this.CurrentUser.appUserId, null, zoneID, null, null, null, true, true, subDeptName, null, null, name, surname, this.theDepartmentName, zoneName, false, null, true).subscribe(async (data: any) => {
                if (data.responseCode == 1) {
                  console.log("This is my new profile info", data);
                  const UPID = await data.dateSet.userProfileID;
                  console.log("My new profile ID", UPID)
                  this.createdUPID = UPID;
                  this.userPofileService.userGainsApproval(UPID).subscribe((data: any) => {
                    if (data.responseCode == 1) {

                      for (let j = 0; j < this.AccessGroupList.length; j++) {
                        const accessgroupID = this.AccessGroupList[j].AccessGroupID;
                        // Perform your action with accessGroupsService here
                        this.accessGroupsService.addUpdateAccessGroupUserLink(0, accessgroupID, this.selectedUserID, this.CurrentUser.appUserId, zoneID, subDeptID, UPID).subscribe((data: any) => {
                          if (data.responseCode == 1) {
                            console.log("The selected user is being added to ALL access groups in the subdepartments they DIDN'T already belong to", data);
                          }
                        });
                      }
                      console.log("Finished processing Access Groups");
                    } else {
                      console.log("No data or empty dateSet");
                    }
                  });

                }
                else {

                }
              });

          });

        });
      }
    }
    else {
      console.log("No data or empty dateSet");
    }
  }

 
    
  //When a person already has a wayleave profile then everytime they are added to a different zone or department they must get a new userProfile ID with that information - create with official work email perhaps?
  async internalInOtherZoneOrDpt() {
    debugger;
    await this.zoneService.getZoneByZoneID(this.theirSelectedZone).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;

          this.intZoneName = current.zoneName;
          this.intSubDeptID = current.subDepartmentID;
          this.getSubdepartmentName(current.subDepartmentID);

          console.log("THISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONES", current);

          this.userPofileService.getUserProfileById(this.selectedUserID).subscribe((data: any) => {
            debugger;
            if (data.responseCode == 1) {
              //the goal is to get "BASE" information
              const current = data.dateSet[0];
              console.log("All about this user: ", current);

              this.intFullName = current.fullName;
              this.intEmail = current.email;
              this.intPhone = current.phoneNumber;

              const fullNameArray = this.intFullName.split(' ');
              const firstName = fullNameArray[0];
              const lastName = fullNameArray[1];

              //this.zoneService.getZoneByZoneID(this.theirSelectedZone).toPromise();

              //No matter how many profiles a user has if they are made correctly this will be the same
              const directorate = this.CurrentUserProfile[0].directorate;
              const deptName = this.CurrentUserProfile[0].departmentName;
              const newZoneDeptID = this.CurrentUserProfile[0].departmentID;

              //#region things I need to yet push
              //const newZoneSubDeptID = 0;
              //const subDeptName = "Sub-Department Name"

              const zoneID = this.theirSelectedZone;
              //const zoneName = "Zone Name"
              //#endregion

              //by default people are
              const isDeptAdmin = false;
              const isZoneAdmin = false;

              //fake values ngoba angazi
              const ccNumber = 12345;
              const ccName = "Test Cost Center Name"

              this.userPofileService.addUpdateUserProfiles(0, this.selectedUserID, this.intFullName, this.intEmail, this.intPhone, true,
                null, null, null, null, directorate, newZoneDeptID, this.intSubDeptID, null, ccNumber.toString(), ccName, null, this.CurrentUser.appUserId, null, zoneID, null, null, null, isDeptAdmin, isZoneAdmin,
                this.theSubDepartmentName, null, null, firstName, lastName, deptName, this.intZoneName, false, null).subscribe(async ( data: any) => {

                  if (data.responseCode == 1) {
                    console.log("I have created a new user profile for an existing user", data);
                    const UPID = await data.dateSet.userProfileID;
                    console.log("My new profile ID", UPID)
                    this.createdUPID = UPID;
                    this.userPofileService.userGainsApproval(UPID).subscribe((data: any) => { { } })
                  }
                })
            }
            else {
              console.log("What happened?")
            }
          })


        }
      }
    });


  }

  LoggedInUserDptZones: ZonesList[] = [];
  AccessGroupsForFilter: AccessGroupList[] = [];
  //WHENTHELOGGEDINUSERISNOTEMB
  getMatMenuDetails() {

    this.accessGroupsService.getAllAccessGroups().subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAGList = {} as AccessGroupList;
          const current = data.dateSet[i];
          tempAGList.AccessGroupID = current.accessGroupID;
          tempAGList.AccessGroupName = current.accessGroupName;

          this.AccessGroupsForFilter.push(tempAGList);
        }
      }
      else {
        console.log("Welp, I couldn't get them ACCESS GROUPS?")
      }
    })
    //okay - so there needs to be a way to get all the sub-department IDs related to this user's department ID
    this.getRelevantZones();
  }

  getRelevantZones() {
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.loggedInUsersDepartmentID).subscribe((data: any) => {
      debugger;

      if (data.responseCode == 1) {
        debugger;

        this.selectedDepartmentID = data.dateSet.departmentID;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.SubDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.SubDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.DepartmentID = current.departmentID;
          this.SubDepartmentList.push(tempSubDepartmentList);
        }

        console.log("SubDepartmentList", this.SubDepartmentList);

        // Fetch zones for each subdepartment inside the success callback of getSubDepartmentsByDepartmentID
        for (const subdepartment of this.SubDepartmentList) {
          this.getZones(subdepartment.SubDepartmentID).subscribe((zoneData: any) => {
            if (zoneData.responseCode == 1) {
              this.selectedDepartmentID = zoneData.dateSet.departmentID;
              for (let i = 0; i < zoneData.dateSet.length; i++) {
                const tempZonesList = {} as ZonesList;
                const current = zoneData.dateSet[i];
                tempZonesList.ZoneID = current.zoneID;
                tempZonesList.ZoneName = current.zoneName;
                tempZonesList.DepartmentID = current.departmentID;
                tempZonesList.SubDepartmentID = current.subDepartmentID;
                this.LoggedInUserDptZones.push(tempZonesList);
              }
            } else {
              // Handle the error case here
              console.log(zoneData.responseMessage);
            }
          }, error => {
            console.log("ZonesList: ", error);
          });
        }
      } else {
        // Handle the error case here
        console.log(data.responseMessage);
      }
    }, error => {
      console.log("SubDepartmentList: ", error);
    });
  }

  isZoneFilter: boolean = false;
  selectedZoneF: string = '';
  coincidentallySelectedSubDept: string = '';
  zoneFilterList: any = [];

  async onFilterByZone(zone:any) {
    this.isZoneFilter = true;
    this.isAGFilter = false;
    this.selectedZoneF = zone.ZoneName;

    const subData: any = await this.subDepartmentService.getSubDepartmentBySubDepartmentID(zone.SubDepartmentID).toPromise();
    console.log("SUBDATA??????????????????????", subData);
    this.coincidentallySelectedSubDept = subData.dateSet[0].subDepartmentName;
    console.log("YOu SELected:" + this.coincidentallySelectedSubDept);

    const data: any = await this.accessGroupLinkService.getPeopleByZone(zone.ZoneID).toPromise();

    /*const userIDs = data.dateSet.map((item: any) => item.userID);
    console.log("These are the userIDs that match my zone search:", userIDs);
    this.zoneFilterList = this.ZoneLinkList.filter(user => userIDs.includes(user.userID));*/

    const userPIDs = data.dateSet.map((item: any) => item.userProfileID);
    console.log("These are the userProfileIDs that match my zone search:", userPIDs);
    this.zoneFilterList = this.ZoneLinkList.filter(user => userPIDs.includes(user.userProfileID));

    this.dataSourceZoneLink = [...this.zoneFilterList];
    this.ZoneDepTable?.renderRows();
  }

  agFilterList: any = [];
  isAGFilter: boolean = false;
  selectedAG: string = '';

  async onFilterByAccessGroup(group: any) {
    debugger;
    this.isAGFilter = true;
    this.isZoneFilter = false;
    this.selectedAG = group.AccessGroupName;
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);

    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.loggedInUsersDepartmentID).subscribe((data: any) => {
      debugger;

      if (data.responseCode == 1) {
        debugger;

        this.selectedDepartmentID = data.dateSet.departmentID;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.SubDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.SubDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.DepartmentID = current.departmentID;
          this.SubDepartmentList.push(tempSubDepartmentList);
        }

        console.log("SubDepartmentList", this.SubDepartmentList);

        // Continue with your logic here, inside the subscription
        this.processSubDepartments(group);
      } else {
        // Handle the error case here
        console.log(data.responseMessage);
      }
    }, error => {
      console.log("SubDepartmentList: ", error);
    });
  }

  async processSubDepartments(group: any) {
    debugger;
    const aggregatedData = [];
    for (const subdepartment of this.SubDepartmentList) {
      debugger;

      const data: any = await this.accessGroupLinkService.getPeopleByAccessGroupAndSubDept(group.AccessGroupID, subdepartment.SubDepartmentID).toPromise();

      //NB: It's important to note that a person, who has a particular USERID might have different priviledges in different zones therefore one must chase userprofileID
      const userPIDs = data.dateSet.map((item: any) => item.userProfileID);
      console.log("These are the userProfileIDs that match my access group search:", userPIDs);

      debugger;
      console.log("This is the zoneLinkList before the access group filter filters", this.ZoneLinkList);
      this.agFilterList = this.ZoneLinkList.filter(user => userPIDs.includes(user.userProfileID));

      console.log("Filtered result, as per access group:", this.agFilterList);
      // Accumulate the filtered data for this subdepartment
      aggregatedData.push(...this.agFilterList);
    }
    this.dataSourceZoneLink = aggregatedData;
    this.ZoneDepTable?.renderRows();
  }

  nameToReject: string = '';
  emailToReject: string = '';
  rejectUser(index: number) {
    this.selectedUserIndex = this.UserList[index].userProfileID;
    this.nameToReject = this.UserList[index].fullName;
    this.emailToReject = this.UserList[index].email;
    const isReject = confirm("You're about to remove " + this.nameToReject + " from this list.")

    if (isReject == true) {

      this.userPofileService.noApproval(this.selectedUserIndex).subscribe((data: any) => {
        this.UserList.splice(0, this.UserList.length);

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllusersNotLinkedToDep();

          //SEND NOTIFICATION TO REJECTED USER?
          const rejectionContent =
          `<html>
          <head>
            <style>
              body {
                    font-family: Arial, sans-serif;
              }
             .email-content {
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
            }
            .footer {
                  margin-top: 20px;
                  color: #777;
            }
            .footer-logo {
                  display: inline-block;
                  vertical-align: middle;
            }
          </style>
          </head>
          <body>
           <div class="email-content">
            <p>Dear ${this.nameToReject},</p>
            <p>A department head declined your request to link your Wayleave profile to the department you selected during setup. <a href="https://wayleave.capetown.gov.za/">Login</a> and update your department selection.
            If necessary, please reach out to your department head to verify your subdepartment and zone before making your selection.</p>
            <p>Should you have any queries, please contact us at <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
          </div>
          <div class="footer">

            <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
            <p>Regards,<br>Wayleave Management System</p>
            <p>
              <a href="#">CCT Web</a> | <a href="#">Contacts</a> | <a href="#">Media</a> | <a href="#">Report a fault</a> | <a href="#">Accounts</a>
            </p>
          </body>
          </html>`;
          this.notificationService.sendEmail(this.emailToReject, "Department Response: Rejected", rejectionContent, rejectionContent);

 
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
    else {
      return;
    }
  }
}
