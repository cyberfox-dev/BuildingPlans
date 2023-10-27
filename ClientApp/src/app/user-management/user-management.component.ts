import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
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


export interface UserList {
  userProfileID: any;
  userId: any;
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

  UserList: UserList[] = [];
  UserProfile: UserProfile[] = [];
  AccessGroupList: AccessGroupList[] = [];
  ZoneList: ZoneList[] = [];

  SubDepartmentList: SubDepartmentList[] = [];
  AllSubDepartmentList: SubDepartmentList[] = [];
  ZonesList: ZonesList[] = [];

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

  constructor(private cdr: ChangeDetectorRef, private userService: UserService, private newProfileComponent: NewProfileComponent, private sharedService: SharedService,
    private userPofileService: UserProfileService, private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private zoneService: ZonesService, private zoneLinkService: ZoneLinkService, private subDepartmentService: SubDepartmentsService, private departmentService: DepartmentsService, private accessGroupLinkService: AccessGroupUserLinkServiceService, private zonesService: ZonesService) { }

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
    this.getDepartmentID(this.loggedInUsersSubDepartmentID);
    //this.showLinkedUsers();
    this.getAllusersNotLinkedToDep();
    this.getAllAccessGroups();
  }


  getUserProfiles() {
    //if (this.CurrentUserProfile.) {

    //}
  }



  openAssignModal(content, index: any) {

    this.selectedUserIndex = this.UserList[index].userProfileID;
    this.selectedUserZoneID = this.UserList[index].ZoneID;
    this.selectedUsersubDepID = this.UserList[index].SubDepartmentID;
    this.selectedUserID = this.UserList[index].userId;
    /* this.selectedUserAccessGroupID = this.AccessGroupList[0].AccessGroupID;*/
    /* this.getAllZonesByZoneID();*/

    this.modalService.open(content, { centered: true, size: 'lg' });
    console.log("FSDFJNISDFSDFJNISFDJNISFDSDFJISDF", this.selectedUsersubDepID, this.selectedUserZoneID);
  }
  openNewUserModal(newUser) {
    this.modalService.open(newUser, { centered: true, size: 'xl' });
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
    this.userPofileService.getAllUsersToLinkToDep(this.UserProfile[0].depID).subscribe(async (data: any) => {
      debugger;
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;
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


    //NOW WHAT?? - PUSH ZONEID AND SUBDEPARTMENTID

    this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.accessGroupID, this.selectedUserID, this.CurrentUser.appUserId, this.selectedUserZoneID, this.selectedUsersubDepID).subscribe((data: any) => {
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
  //displayedColumnsZoneLinks: string[] = ['fullName', 'departmentName', 'subdepartmentName', 'zoneName', 'isZoneAdmin', 'isDepartmentAdmin', 'actions'];
  displayedColumnsZoneLinks: string[] = ['fullName','subdepartmentName', 'zoneName', 'actions'];
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
      } else {
        //alert(subDepartmentsData.responseMessage);
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

  async editUserScope(index: any, viewDepartmentPerson: any)
  {
  
    debugger;

    this.ThisUserRolesList.splice(0, this.ThisUserRolesList.length);
    this.selectedUser = index;

    this.selectedUserID = this.ZoneLinkList[index].userID;
    this.userProfileID = this.ZoneLinkList[index].userProfileID;
    this.selectedUserName = this.ZoneLinkList[index].fullName;

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

    this.subDeptID = this.ZoneLinkList[index].subDepartmentID;
    this.zoneId = this.ZoneLinkList[index].ZoneID;
    this.ZoneName = this.ZoneLinkList[index].zoneName;
    this.subDeptName = this.ZoneLinkList[index].subdepartmentName;

    
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

    this.selectedUserID = this.ZoneLinkList[index].userID;
    this.userProfileID = this.ZoneLinkList[index].userProfileID;
    this.selectedUserName = this.ZoneLinkList[index].fullName;

    //this.selectedDepartmentID = this.ZoneLinkList[index].departmentID;

    console.log("Selected UserID: ", this.selectedUserID);
    console.log("Selected UserName: ", this.selectedUserName);

    this.subDeptID = this.ZoneLinkList[index].subDepartmentID;
    this.theirSubdepartmentID = this.ZoneLinkList[index].subDepartmentID;
    this.zoneId = this.ZoneLinkList[index].ZoneID;
    this.ZoneName = this.ZoneLinkList[index].zoneName;
    this.subDeptName = this.ZoneLinkList[index].subdepartmentName;

    this.ZonesList.splice(0, this.ZonesList.length);
    
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
        console.log("This is the relevant departmentID ", this.subDeptID);
        console.table(this.ZonesList);
      } else {
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
    }, error => {
      console.log("ZonesList error: ", error);
    });

    await this.getZoneLinks(this.selectedUserID);
    this.TheirZoneLinkDetailsList.splice(0, this.TheirZoneLinkDetailsList.length);
    await this.thisUserZoneInfo();//NB - won't know where user is linked without this

    await this.checkZoneLinkage();

    this.getAccessGroups();
    this.getZoneAccessGroups();

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
          console.table(tempAccessList);
          this.ThisUserAGList.push(tempAccessList);
        }

      } else {
        //alert(data.responseMessage);
      }
    }
    )
  }

  getZoneAccessGroups() {
    this.accessGroupLinkService.getAccessGroupsBySubDeptZoneAndUserID(this.selectedUserID, this.zoneId ,this.subDeptID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;

        console.log("I want zone specific access group info: ", data);
        console.log(data.responseMessage);
      } else {
        console.log(data.responseMessage);
      }
      console.log("I want zone specific access group info: ", data);
    }, error => {
      console.log("Error: ", error);
    })
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

  getSubdepartmentName(subDepartmentId: number) {
    debugger;
    this.subDepartmentService.getSubDepartmentBySubDepartmentID(subDepartmentId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.theSubDepartmentName = data.dateSet[0].subDepartmentName;

        console.log("All I want is the DepartmentName: ", data);
        console.log(data.responseMessage);
      } else {
        console.log(data.responseMessage);
      }
      console.log("All I want is the DepartmentName: ", data);
    }, error => {
      console.log("Error: ", error);
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
  tempAccessGroupDetailsArray: AccessGroupDetailsList[] = [];
  async addToAccessGroup(index: number, viewDepartmentPerson: any) {
    // You can use the index to access the selected access group in AccessGroupList
    const selectedAccessGroup = this.AccessGroupList[index];
    const accessGroupID = selectedAccessGroup.AccessGroupID;


    //this.selectedDepartmentID


    debugger;
    //NB: MAKE SURE THAT THOSE TWO NEW ARGUMENTS ARE ACCOUNTED FOR ACCORDINGLY!

    this.accessGroupsService.addUpdateAccessGroupUserLink(0, accessGroupID, this.selectedUserID, this.CurrentUser.appUserId, this.zoneId, this.subDeptID).subscribe((data: any) => {
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
    this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
  }

  removeFromAccessGroup(index: number) {
    // Get the selected access group
    const selectedAccessGroup = this.AccessGroupList[index];

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

  async verifyingTheAddition() {
    let internalSubdepartment = this.selectedSubdepartment;
    let internalZone = this.selectedZone;
    let internalName = this.newName;
    let internalSurname = this.newSurname;
    //let internalCostCenterOwner = this.newCostCenterOwner;
    //let internalCostCenterNumber = this.newCostCenterNumber;
    //let internalPhoneNumber = this.newPhoneNumber;
    let internalEmail = this.newEmail + "@capetown.gov.za";

    //choose to the option to be able to leave the cost centre things and phone number empty

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (internalSubdepartment !== null &&
      internalZone !== null &&
      internalName !== null &&
      internalSurname !== null &&
      internalEmail !== null) {

      //email
      if (!emailRegex.test(internalEmail)) {
        alert("Please enter a valid email address");
      }
      else {
        try {
          const exists = await this.userService.emailExists(internalEmail).toPromise();
          if (exists) {
            alert("Email already exists in wayleave system. Consider changing your password");
            this.validEmail = false;
          }
          else {
            this.validEmail = true;
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
      await this.verifyingTheAddition();
      await this.getSubdepartmentName(internalSubdepartment);
      if (this.validNames && this.validEmail) {
        //register the user and create a profile
        this.userService.register(internalName + " " + internalSurname, internalEmail, "12345").subscribe((data: any) => {
          if (data.responseCode == 1) {

            debugger;
            this.sharedService.userIDForWalkIn == data.dateSet.appUserId; //added to add access user ID, when trying to create new wayleave for new client?
      
            //link them to this department and zone - approve them too
            //then open access group link list!
            this.getDepartmentID(internalSubdepartment);
            //made directorate and departmentID null - is that okay?
            this.userPofileService.addUpdateUserProfiles(
              0, data.dateSet.appUserId, internalName + " " + internalSurname, internalEmail, internalPhoneNumber, true, null, null, null,
              null, null, this.theDepartmentID, internalSubdepartment, null, internalCostCenterNumber, internalCostCenterOwner, null, this.CurrentUser.appUserId, null, internalZone, null, null, null, null, null, this.theSubDepartmentName).subscribe(async (data: any) => {

                if (data.responseCode == 1) {
                  debugger;
                  //alert(data.responseMessage);
                  console.log(data.responseMessage);

                  this.selectedUserID = data.dateSet.userID;
                  this.userProfileID = data.dateSet.userProfileID;
                  this.subDeptID = data.dateSet.subDepartmentID;
                  this.zoneId = data.dateSet.zoneID;
                  this.subDeptName = data.dateSet.subDepartmentName;
                  debugger;
                  await this.getSubdepartmentName(data.dateSet.subDepartmentID);
                  this.ZoneName = await this.getZoneByZoneId(this.zoneId);
                 
                  console.log("DATADATADATADATADATA, this is related to a user being added via the department manager.", data);

                  this.selectedUserName = internalName + " " + internalSurname;
                  this.autoApproveNewUser();
                  this.getAccessGroups();
                  this.showLinkedUsers(); //I hope this will refresh the modal - it didn't
                  await this.getAccessGroups();
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  this.modalService.open(viewDepartmentPerson, { centered: true, size: 'lg' });
                }
                else {
                  //alert(data.responseMessage)
                  console.log(data.responseMessage);
                }}, error => {
                console.log("Error: ", error);
              })}
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
        
      }
      else {
        alert("There seem to be some verification issues.")
      }
    }
    catch (error)
    {
        console.error("Error while adding new user in department manager:", error);
    }
  }

  newUserAccessGroupID: number = 1002; //default access group is that of reviewer
  newUserAccessGroupName: any;
  newAcessGroupUserLinkID: any;

  autoApproveNewUser() {
    debugger;

    this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.newUserAccessGroupID, this.selectedUserID, this.CurrentUser.appUserId, this.zoneId, this.subDeptID).subscribe((data: any) => {
      ;
      if (data.responseCode == 1) {
        //alert(data.responseMessage);
        console.log(data.responseMessage);

        debugger;
        this.newAcessGroupUserLinkID = data.dateSet.accessGroupUserLinkID;
        debugger;
        //Note: that I decided that the default access group is reviewer.

    
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
  theirSelectedZone: any;
  theirSelectedZoneName: string;
  theirName: '';
  theirSurname: '';
  theirCostCenterOwner: '';
  theirCostCenterNumber: '';
  theirPhoneNumber: '';
  theirEmail: '';
  TheirZonesList: ZonesList[] =[];
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
   this.selectedUserID = this.ZoneLinkList[index].userID;
   this.selectedUserName = this.ZoneLinkList[index].fullName;
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

    this.accessGroupsService.addUpdateAccessGroupUserLink(0, ReviewerID, this.selectedUserID, this.CurrentUser.appUserId, this.theirSelectedZone, this.theirSubdepartmentID).subscribe((data: any) => {
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
    this.zoneLinkService.getAllUserLinks(userID).subscribe((data: any)=>{
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

  removeUserFromDPT(index: any) {

  }
}
