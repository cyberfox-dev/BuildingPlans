import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { async } from 'rxjs';

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


@Component({
  selector: 'app-access-groups-config',
  templateUrl: './access-groups-config.component.html',
  styleUrls: ['./access-groups-config.component.css']
})



export class AccessGroupsConfigComponent implements OnInit {


  AccessGroupList: AccessGroupList[] = [];

  public addAccessGroup = this.formBuilder.group({
    accessGroupName: ['', Validators.required],
    accessGroupDescription: ['', Validators.required]

  })
    stringifiedData: any;
  CurrentUser: any;
  InternalUserProfileList: InternalUserProfileList[] = [];





  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  async openAddUserToAccessGroup(addUserToAccessGroup: any, index: any) {
    

     this.modalService.open(addUserToAccessGroup, { centered: true, size: 'lg' });

    
  }
  constructor(private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    
  }

  displayedColumns: string[] = ['AccessGroupName','AccessGroupDescription' ,'actions'];
  dataSource = this.AccessGroupList;

  displayedColumnsAddUser: string[] = ['FullName', 'actions'];
  dataSourceAddUser = this.InternalUserProfileList;

  @ViewChild(MatTable) AccessGroupListTable: MatTable<AccessGroupList> | undefined;
  @ViewChild(MatTable) InternalUserProfileListTable: MatTable<InternalUserProfileList> | undefined;


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



  async getAllUsersForLink(index: any, addUserToAccessGroup:any) {
   
    this.InternalUserProfileList.splice(0, this.InternalUserProfileList.length);

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

  openAddrolesToAccessGroup(addRolesToAccessGroup) {
    this.modalService.open(addRolesToAccessGroup, { centered: true, size: 'xl' });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAddUser.filter(user => user.FullName.toLowerCase().includes(filterValue.trim().toLowerCase()));
    this.InternalUserProfileListTable?.renderRows();

    // console.log("this is what it is filtering", this.dataSourceLinkUsers.filter(user => user.fullName.toLowerCase().includes(filterValue.trim().toLowerCase())));
  }


}
