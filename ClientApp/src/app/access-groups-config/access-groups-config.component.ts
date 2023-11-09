import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, async, catchError, tap, throwError } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { RolesService } from '../service/Roles/roles.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { ZonesService } from '../service/Zones/zones.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserProfileService } from '../service/UserProfile/user-profile.service';



export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'ESU' },
  { name: 'Department Admin' },
  { name: 'External User' },
];
export interface linkusersToZone {
  name: string;
}
const LinkUsersToZone: PeriodicElement[] = [
  { name: 'User 1' },
  { name: 'User 2' },
  { name: 'User 3' },
];

export interface RolesList {
  RoleID: number;
  RoleName: string;
  RoleType: string;
  RoleDescription: string;
}

export interface AccessGroupList {
  AccessGroupID: number,
  AccessGroupDescription: string,
  AccessGroupName: string,
  //CreatedById: string,
  DateCreated: string,
  DateUpdated: string,
}

export interface InternalUserProfileList {

  UserID: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Directorate: string;
  SubDepartmentID: string;

  DepartmentID: string;
  Branch: string;

  selectedSubdepartment: any | null; // Default to null
  selectedZone: any | null; // Default to null
  zones: ZonesList[] | null; 

}

export interface AllInternalUserProfileList {

  UserID: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Directorate: string;
  SubDepartmentID: string;

  DepartmentID: string;
  Branch: string;

  selectedSubdepartment: any | null; // Default to null
  selectedZone: any | null; // Default to null
  zones: ZonesList[] | null;

}

export interface LinkedUsersList {

  UserID: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Directorate: string;
  SubDepartmentID: string;
  DepartmentID: string;
  Branch: string;

  selectedSubdepartment: any | null;
  selectedZone: any | null;
}

export interface ZonesList {
  ZoneID: number;
  ZoneName: string;
  DepartmentID: number;
  SubDepartmentID: number;
}

export interface SubDepartmentList {
  SubDepartmentID: number;
  SubDepartmentName: string;
  DepartmentID: number;
}
@Component({
  selector: 'app-access-groups-config',
  templateUrl: './access-groups-config.component.html',
  styleUrls: ['./access-groups-config.component.css']
})



export class AccessGroupsConfigComponent implements OnInit {

  ZonesList: ZonesList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  //subdepartmentZonesMap: { [key: string]: ZonesList[] } = {};

  AccessGroupList: AccessGroupList[] = [];
  RolesList: RolesList[] = [];
  RolesNotLinkedList: RolesList[] = [];

  @ViewChild(MatTable) rolesTable: MatTable<RolesList> | undefined;




  public addAccessGroup = this.formBuilder.group({
    accessGroupName: ['', Validators.required],
    accessGroupDescription: ['', Validators.required]

  })
  stringifiedData: any;
  CurrentUser: any;
  InternalUserProfileList: InternalUserProfileList[] = [];
  AllInternalUserProfileList: AllInternalUserProfileList[] = [];
  LinkedUsersList: LinkedUsersList[] = [];


  selection = new SelectionModel<LinkedUsersList>(true, []);
  roleSelection = new SelectionModel<RolesList>(true, []);
  currentAGID: number;
  currentAGName: string;

  loggedInUsersDepartmentID: number;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  async openAddUserToAccessGroup(addUserToAccessGroup: any, index: any) {


    this.modalService.open(addUserToAccessGroup, { centered: true, size: 'lg' });


  }
  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private formBuilder: FormBuilder, private rolesService: RolesService, private subDepartmentService: SubDepartmentsService, private zonesService: ZonesService, private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.loggedInUsersDepartmentID = this.CurrentUserProfile[0].departmentID;
    //this.getSubdepartments();
    this.getAllSubdepartments();

  }

  displayedColumns: string[] = ['AccessGroupName', 'AccessGroupDescription', 'actions'];
  dataSource = this.AccessGroupList;

  displayedColumnsAddUser: string[] = ['FullName', 'subdepartment', 'zone', 'actions'];
  //dataSourceAddUser = this.InternalUserProfileList;
  dataSourceAddUser = this.AllInternalUserProfileList;

  displayedColumnsLinkedUser: string[] = ['FullName', 'actions'];
  dataSourceLinkedUser = this.LinkedUsersList;

  displayedColumnsAddRole: string[] = ['RoleName', 'RoleDescription', 'actions'];
  dataSourceAddRole = this.RolesList;

  displayedColumnsLinkedRole: string[] = ['RoleName', 'RoleDescription', 'actions'];
  dataSourceLinkedRole = this.RolesNotLinkedList;

  @ViewChild(MatTable) AccessGroupListTable: MatTable<AccessGroupList> | undefined;
  @ViewChild(MatTable) InternalUserProfileListTable: MatTable<InternalUserProfileList> | undefined; //do I still need this?
  @ViewChild(MatTable) AllInternalUserProfileListTable: MatTable<AllInternalUserProfileList> | undefined;
  @ViewChild(MatTable) LinkedUsersListTable: MatTable<LinkedUsersList> | undefined;


  onAccessGroupCreate() {
    let accessGroupName = this.addAccessGroup.controls["accessGroupName"].value;
    let accessGroupDescription = this.addAccessGroup.controls["accessGroupDescription"].value;

    this.accessGroupsService.addUpdateAccessGroup(0, accessGroupDescription, accessGroupName, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.getAllAccessGroup();
        this.addAccessGroup.controls["accessGroupName"].setValue("");
        this.addAccessGroup.controls["accessGroupDescription"].setValue("");

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
          tempAccessGroupList.AccessGroupDescription = current.accessGroupDescription;
          tempAccessGroupList.AccessGroupName = current.accessGroupName;
          tempAccessGroupList.DateUpdated = current.dateUpdated;
          tempAccessGroupList.DateCreated = current.dateCreated;
          this.AccessGroupList.push(tempAccessGroupList);

        }
        this.AccessGroupListTable?.renderRows();



        console.log("AccessGroupList", this.AccessGroupList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }


  getAllRoles() {

    this.RolesList.splice(0, this.RolesList.length);

    this.rolesService.getAllRoles().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;
          tempRolesList.RoleType = current.roleType;
          tempRolesList.RoleDescription = current.roleDescription;

          this.RolesList.push(tempRolesList);

        }
        this.rolesTable?.renderRows();
        console.log("GetAllRoles", data.dateSet);
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


  /*async getAllUsersForLink(index: any, addUserToAccessGroup:any) {
   
    this.InternalUserProfileList.splice(0, this.InternalUserProfileList.length);
    
    this.currentAGID = this.AccessGroupList[index].AccessGroupID;
    await this.accessGroupsService.getAllNotLinkedUsers(this.AccessGroupList[index].AccessGroupID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempInternalUserProfileList = {} as InternalUserProfileList;
          const current = data.dateSet[i];
          tempInternalUserProfileList.UserID = current.userID;
          tempInternalUserProfileList.FullName = current.fullName;
          tempInternalUserProfileList.SubDepartmentID = current.subDepartmentID;
          tempInternalUserProfileList.Email = current.email;
          tempInternalUserProfileList.Directorate = current.directorate;
          tempInternalUserProfileList.Branch = current.branch;
          tempInternalUserProfileList.DepartmentID = current.departmentID;
          tempInternalUserProfileList.PhoneNumber = current.phoneNumber;

          // Set default values for selectedSubdepartment and selectedZone
          tempInternalUserProfileList.selectedSubdepartment = null;
          tempInternalUserProfileList.selectedZone = null;

          this.InternalUserProfileList.push(tempInternalUserProfileList);

        }
        // this.getAllUsersLinkedUsers();
        this.InternalUserProfileListTable?.renderRows();
        

        this.modalService.open(addUserToAccessGroup, { centered: true, size: 'xl' });

        console.log("InternalUserProfileListInternalUserProfileListInternalUserProfileListInternalUserProfileListInternalUserProfileList", this.InternalUserProfileList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }*/


  async getAllUsers(index: any, addUserToAccessGroup: any) {
    debugger;
    this.currentAGID = this.AccessGroupList[index].AccessGroupID;
    this.currentAGName = this.AccessGroupList[index].AccessGroupName;

    this.AllInternalUserProfileList.splice(0, this.AllInternalUserProfileList.length);

    const data: any = await this.userProfileService.getInternalUsers().toPromise();

    if (data.responseCode == 1) {
      for (let i = 0; i < data.dateSet.length; i++) {
        const current = data.dateSet[i];
        const tempAllInternalUserProfileList: AllInternalUserProfileList = {
          UserID: current.userID,
          FullName: current.fullName,
          SubDepartmentID: current.subDepartmentID,
          Email: current.email,
          Directorate: current.directorate,
          Branch: current.branch,
          DepartmentID: current.departmentID,
          PhoneNumber: current.phoneNumber,
          selectedSubdepartment: null, // Set default value to null
          selectedZone: null, // Set default value to null
          zones: null,
        };

        this.AllInternalUserProfileList.push(tempAllInternalUserProfileList);
      }

      // Render the table
      this.AllInternalUserProfileListTable?.renderRows();

      // Open the modal
      this.modalService.open(addUserToAccessGroup, { centered: true, size: 'xl' });

      console.log("InternalUserProfileList", this.AllInternalUserProfileList);
    } else {
      alert(data.responseMessage);
    }
    console.log("Response", data);
  } catch(error) {
    console.log("Error:", error);
  }
  async getAllUsersForLink(index: any, addUserToAccessGroup: any) {
    try {
      this.InternalUserProfileList.splice(0, this.InternalUserProfileList.length);

      this.currentAGID = this.AccessGroupList[index].AccessGroupID;
      this.currentAGName = this.AccessGroupList[index].AccessGroupName;

      const data: any = await this.accessGroupsService.getAllNotLinkedUsers(this.AccessGroupList[index].AccessGroupID).toPromise();

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempInternalUserProfileList: InternalUserProfileList = {
            UserID: current.userID,
            FullName: current.fullName,
            SubDepartmentID: current.subDepartmentID,
            Email: current.email,
            Directorate: current.directorate,
            Branch: current.branch,
            DepartmentID: current.departmentID,
            PhoneNumber: current.phoneNumber,
            selectedSubdepartment: null, // Set default value to null
            selectedZone: null, // Set default value to null
            zones: null,
          };

          this.InternalUserProfileList.push(tempInternalUserProfileList);
        }

        // Render the table
        this.InternalUserProfileListTable?.renderRows();

        // Open the modal
        this.modalService.open(addUserToAccessGroup, { centered: true, size: 'xl' });

        console.log("InternalUserProfileList", this.InternalUserProfileList);
      } else {
        alert(data.responseMessage);
      }
      console.log("Response", data);
    } catch (error) {
      console.log("Error:", error);
    }
  }



  // Get all linked users 
  async getAllUsersLinkedUsers() {
    debugger;
    this.LinkedUsersList.splice(0, this.LinkedUsersList.length);

    await this.accessGroupsService.getAllLinkedUsers(this.currentAGID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempInternalUserProfileList = {} as LinkedUsersList;
          const current = data.dateSet[i];
          tempInternalUserProfileList.UserID = current.userID;
          tempInternalUserProfileList.FullName = current.fullName;
          tempInternalUserProfileList.SubDepartmentID = current.subDepartmentID;
          tempInternalUserProfileList.Email = current.email;
          tempInternalUserProfileList.Directorate = current.directorate;
          tempInternalUserProfileList.Branch = current.branch;
          tempInternalUserProfileList.DepartmentID = current.departmentID;
          tempInternalUserProfileList.PhoneNumber = current.phoneNumber;
          this.LinkedUsersList.push(tempInternalUserProfileList);

        }
        this.LinkedUsersListTable?.renderRows();



        console.log("LinkedUsersList", this.InternalUserProfileList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("LinkedUsersListReponse", data);

    }, error => {
      console.log("LinkedUsersListError: ", error);
    })
  }


  onLinkUser() {
    debugger;
    //When a user is linked - the the LinkUserAcessGroupTable must be updated
    for (let i = 0; i < this.selection.selected.length; i++) {
      const current = this.selection.selected[i];
      const zoneID = current.selectedZone;
      const subdepartmentID = current.selectedSubdepartment;
      // TODO work on the 6th argument
      this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.currentAGID, current.UserID, this.CurrentUser.appUserId, zoneID, subdepartmentID, null).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.LinkedUsersListTable?.renderRows();

          console.log("LinkedUsersList", this.InternalUserProfileList);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("LinkedUsersListReponse", data);

      }, error => {
        console.log("LinkedUsersListError: ", error);
      })

    }

  }



  async getAllUsersNotLinkedRoles(index: any, addRolesToAccessGroup: any) {

    this.RolesNotLinkedList.splice(0, this.RolesNotLinkedList.length);
    this.currentAGID = this.AccessGroupList[index].AccessGroupID;
    await this.accessGroupsService.getAllNotLinkedRoles(this.currentAGID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesListList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesListList.RoleID = current.roleID;
          tempRolesListList.RoleDescription = current.roleDescription;
          tempRolesListList.RoleName = current.roleName;
          tempRolesListList.RoleType = current.roleType;

          this.RolesNotLinkedList.push(tempRolesListList);

        }
        this.LinkedUsersListTable?.renderRows();
        this.modalService.open(addRolesToAccessGroup, { centered: true, size: 'xl' });


      }
      else {
        alert(data.responseMessage);
      }
      console.log("LinkedUsersListReponse", data);

    }, error => {
      console.log("LinkedUsersListError: ", error);
    })
  }
  // Get all linked Roles
  async getAllUsersLinkedRoles() {

    //this.RolesList.splice(0, this.RolesList.length);

    await this.accessGroupsService.getAllLinkedRoles(this.currentAGID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesListList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesListList.RoleID = current.roleID;
          tempRolesListList.RoleDescription = current.roleDescription;
          tempRolesListList.RoleName = current.roleName;
          tempRolesListList.RoleType = current.roleType;

          this.RolesList.push(tempRolesListList);

        }
        this.LinkedUsersListTable?.renderRows();



      }
      else {
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesError: ", error);
    })
  }

  onRoleLink() {
    for (let i = 0; i < this.roleSelection.selected.length; i++) {
      const current = this.roleSelection.selected[i];

      this.accessGroupsService.addUpdateAccessGroupRoleLink(0, this.currentAGID, current.RoleID, current.RoleName, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.LinkedUsersListTable?.renderRows();
          alert(data.responseMessage);

        }
        else {
          alert(data.responseMessage);
        }
        console.log("LinkedUsersListReponse", data);

      }, error => {
        console.log("LinkedUsersListError: ", error);
      })

    }
  }

  openAddrolesToAccessGroup(addRolesToAccessGroup) {
    this.modalService.open(addRolesToAccessGroup, { centered: true, size: 'xl' });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAddUser.filter(user => user.FullName.toLowerCase().includes(filterValue.trim().toLowerCase()));
    this.InternalUserProfileListTable?.renderRows();

    // console.log("this is what it is filtering", this.dataSourceLinkUsers.filter(user => user.fullName.toLowerCase().includes(filterValue.trim().toLowerCase())));
  }


  userSelectedForLink(user: any) {
    debugger;
    this.selection.toggle(user);

  }

  roleSelectedForLink(role: any) {

    this.roleSelection.toggle(role);

  }

  //should I only be able to link people into my department?
  getSubdepartments() {
    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.loggedInUsersDepartmentID).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
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
        alert(data.responseMessage);
      }
      console.log("SubDepartmentList", data);

    }, error => {
      console.log("SubDepartmentList: ", error);
    })
  }

 //or should I be able to link people to ANY subdepartement?
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
          this.SubDepartmentList.push(tempSubDepartmentList);

        }

        console.log("Where are they??? SubDepartmentList", this.SubDepartmentList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("SubDepartmentList", data);

    }, error => {
      console.log("SubDepartmentList: ", error);
    })
  }

 /* getZones(subDeptID: any) {
    debugger;
    console.log('subDeptID:', subDeptID);
    this.ZonesList = [];
    this.zonesService.getZonesBySubDepartmentsID(subDeptID).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZonesList = {} as ZonesList;
          const current = data.dateSet[i];
          tempZonesList.ZoneID = current.zoneID;
          tempZonesList.ZoneName = current.zoneName;
          tempZonesList.DepartmentID = current.DepartmentID;
          tempZonesList.SubDepartmentID = current.SubDepartmentID;
          this.ZonesList.push(tempZonesList);

        }

        console.log("ZonesList", this.ZonesList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("ZonesList", data);

    }, error => {
      console.log("ZonesList: ", error);
    })
  }*/
  getZones(subDeptID: any): Observable<any> { // Change the return type to Observable<any>
    debugger;
    console.log('subDeptID:', subDeptID);
    this.ZonesList = [];
    return this.zonesService.getZonesBySubDepartmentsID(subDeptID) // Return the observable here
      .pipe(
        tap((data: any) => {
          if (data.responseCode == 1) {
            this.ZonesList = data.dateSet.map(current => ({
              ZoneID: current.zoneID,
              ZoneName: current.zoneName,
              DepartmentID: current.DepartmentID,
              SubDepartmentID: current.SubDepartmentID
            }));
            console.log("ZonesList", this.ZonesList);
          } else {
            alert(data.responseMessage);
          }
          console.log("ZonesList", data);
        }),
        catchError(error => {
          console.log("ZonesList: ", error);
          return throwError(error);
        })
      );
  }


  onSubdepartmentChange(element: InternalUserProfileList) {
    // Update data or perform actions based on the selected subdepartment
    this.getZones(element.selectedSubdepartment).subscribe((data: any) => {
      if (data.responseCode == 1) {
        element.zones = [];
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZonesList = {} as ZonesList;
          const current = data.dateSet[i];
          tempZonesList.ZoneID = current.zoneID;
          tempZonesList.ZoneName = current.zoneName;
          tempZonesList.DepartmentID = current.DepartmentID;
          tempZonesList.SubDepartmentID = current.SubDepartmentID;
          element.zones.push(tempZonesList);
        }
        console.log("ZonesList for element", element.zones);
      } else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("ZonesList error: ", error);
    });

    // Trigger change detection to update the template
    this.cdr.detectChanges();
  }


  // Function to handle zone selection change || does it even need handling?
  onZoneChange(element: InternalUserProfileList) {
    // Update data or perform actions based on the selected zone
    // You can also add more logic here if needed
    // ...
  }


}
