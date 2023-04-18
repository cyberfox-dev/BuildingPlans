import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';

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

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  openAddUserToAccessGroup(addUserToAccessGroup :any) {
    this.modalService.open(addUserToAccessGroup, { centered:true,size: 'lg' });
  }
  constructor(private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAllAccessGroup();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    
  }

  displayedColumns: string[] = ['AccessGroupName','AccessGroupDescription' ,'actions'];
  dataSource = this.AccessGroupList;

  displayedColumnsAddUser: string[] = ['name', 'actions'];
  dataSourceAddUser = LinkUsersToZone;

  @ViewChild(MatTable) AccessGroupListTable: MatTable<AccessGroupList> | undefined;


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


}
