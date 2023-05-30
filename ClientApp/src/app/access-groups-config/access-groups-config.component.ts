import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { async } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { RolesService } from '../service/Roles/roles.service';

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

}

@Component({
  selector: 'app-access-groups-config',
  templateUrl: './access-groups-config.component.html',
  styleUrls: ['./access-groups-config.component.css']
})



export class AccessGroupsConfigComponent implements OnInit {


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
  LinkedUsersList: LinkedUsersList[] = [];


  selection = new SelectionModel<LinkedUsersList>(true, []);
  roleSelection = new SelectionModel<RolesList>(true, []);
    currentAGID: number;


  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  async openAddUserToAccessGroup(addUserToAccessGroup: any, index: any) {
    

     this.modalService.open(addUserToAccessGroup, { centered: true, size: 'lg' });

    
  }
  constructor(private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private formBuilder: FormBuilder, private rolesService: RolesService) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    
  }

  displayedColumns: string[] = ['AccessGroupName','AccessGroupDescription' ,'actions'];
  dataSource = this.AccessGroupList;

  displayedColumnsAddUser: string[] = ['FullName', 'actions'];
  dataSourceAddUser = this.InternalUserProfileList;

  displayedColumnsLinkedUser: string[] = ['FullName', 'actions'];
  dataSourceLinkedUser = this.LinkedUsersList;

  displayedColumnsAddRole: string[] = ['RoleName', 'RoleDescription' ,'actions'];
  dataSourceAddRole = this.RolesList;

  displayedColumnsLinkedRole: string[] = ['RoleName', 'RoleDescription','actions'];
  dataSourceLinkedRole = this.RolesNotLinkedList;

  @ViewChild(MatTable) AccessGroupListTable: MatTable<AccessGroupList> | undefined;
  @ViewChild(MatTable) InternalUserProfileListTable: MatTable<InternalUserProfileList> | undefined;
  @ViewChild(MatTable) LinkedUsersListTable: MatTable<LinkedUsersList> | undefined;


  onAccessGroupCreate() {
    let accessGroupName = this.addAccessGroup.controls["accessGroupName"].value;
    let accessGroupDescription = this.addAccessGroup.controls["accessGroupDescription"].value;

    this.accessGroupsService.addUpdateAccessGroup(0, accessGroupDescription, accessGroupName,this.CurrentUser.appUserId).subscribe((data: any) => {

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


  async getAllUsersForLink(index: any, addUserToAccessGroup:any) {
   
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
  }


  // Get all linked users 
  async getAllUsersLinkedUsers() {
    
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
    for (let i = 0; i < this.selection.selected.length; i++) {
      const current = this.selection.selected[i];

      this.accessGroupsService.addUpdateAccessGroupUserLink(0, this.currentAGID, current.UserID, this.CurrentUser.appUserId).subscribe((data: any) => {

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

      this.accessGroupsService.addUpdateAccessGroupRoleLink(0, this.currentAGID, current.RoleID,current.RoleName ,this.CurrentUser.appUserId).subscribe((data: any) => {

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

    this.selection.toggle(user);

  }

  roleSelectedForLink(role: any) {

    this.roleSelection.toggle(role);

  }
}
