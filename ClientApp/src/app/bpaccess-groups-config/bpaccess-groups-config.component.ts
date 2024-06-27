
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BPAccessGroupsService } from '../service/BPAccessGroups/bpaccess-groups.service';
import { BPRolesService } from '../service/BPRoles/bproles.service';
import { BPAccessGroupRoleLinkService } from '../service/BPAcessGroupRoleLink/bpaccess-group-role-link.service';

export interface AccessGroupList {
  AccessGroupID: number;
  AccessGroupName: string;
  AccessGroupDescription: string;
  CreatedByID: string;
  DateCreated: any;
  DateUpdated: any;
}
export interface RolesList {
  RoleID: number;
  RoleName: string;
  RoleType: string;
  RoleDescription: string;
  isLinked: boolean;
  AccessGroupRoleLinkID: number;
  isActive: boolean;
}
@Component({
  selector: 'app-bpaccess-groups-config',
  templateUrl: './bpaccess-groups-config.component.html',
  styleUrls: ['./bpaccess-groups-config.component.css']
})
export class BPAccessGroupsConfigComponent implements OnInit {

  constructor(private bpAccessGroupsService: BPAccessGroupsService, private modalService: NgbModal, private bpRoleService: BPRolesService, private bpAccessGroupRoleLinkService: BPAccessGroupRoleLinkService) { }

  AccessGroupsList: AccessGroupList[] = [];
  RolesList: RolesList[] = [];

  @ViewChild(MatTable) AccessGroupsTable: MatTable<AccessGroupList> | undefined;
  accessDataSource: MatTableDataSource<AccessGroupList> = new MatTableDataSource<AccessGroupList>();
  displayedColumns: string[] = ['AccessGroupName', 'AccessGroupDescription', 'actions'];

  newAccessGroup: string;
  newAccessGroupDes: string;

  
  accessGroupId: number;
  accessGroupName: string;
  accessGroupDescription: string;

  oldAccessGroupName: string;
  oldAccessGroupDescription: string;

  stringifiedData: any;
  CurrentUser; any;

  functionalArea: string;
  
  ngOnInit(): void {
    this.GetAllAccessGroups();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }

  openAddAccessgroup(addAccessGroup: any) {
    this.modalService.open(addAccessGroup, { centered: true, size: 'xl' });
  }

  openEditAccessGroup(editAccessGroup) {
    this.modalService.open(editAccessGroup, { centered: true, size: 'xl' });
  }
  GetAllAccessGroups() {
    
    this.AccessGroupsList.splice(0, this.AccessGroupsList.length);
    this.bpAccessGroupsService.getAllAccessgroups().subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAccessGroup = {} as AccessGroupList;
          const current = data.dateSet[i];

          tempAccessGroup.AccessGroupID = current.accessGroupID;
          tempAccessGroup.AccessGroupName = current.accessGroupName;
          tempAccessGroup.AccessGroupDescription = current.accessGroupDescription;
          tempAccessGroup.CreatedByID = current.createdById;
          tempAccessGroup.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempAccessGroup.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.AccessGroupsList.push(tempAccessGroup);
        }

        this.accessDataSource.data = this.AccessGroupsList;
        this.AccessGroupsTable.renderRows();
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AddAccessGroup() {
    
    let accessGroupName = this.newAccessGroup;
    let accessGroupDes = this.newAccessGroupDes
    if (accessGroupName == undefined || accessGroupName.trim() == "" || accessGroupDes == undefined || accessGroupDes.trim() == "") {
      alert("Please fill in all required fields");
    }
    else {
      this.bpAccessGroupsService.addUpdateAccessGroup(0, accessGroupName, accessGroupDes, this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.modalService.dismissAll();
          alert(data.responseMessage);
          this.GetAllAccessGroups();
          this.ClearData();
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

  GetAccessGroupForEdit(index: any, editAccessGroup:any) {
    this.accessGroupId = this.AccessGroupsList[index].AccessGroupID;

    this.bpAccessGroupsService.getAccessGroupByAccessGroupID(this.accessGroupId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];

        this.accessGroupId = current.accessGroupID;
        this.accessGroupName = current.accessGroupName;
        this.oldAccessGroupName = current.accessGroupName;
        this.accessGroupDescription = current.accessGroupDescription;
        this.oldAccessGroupDescription = current.accessGroupDescription;

        this.openEditAccessGroup(editAccessGroup);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  SaveEdittedAccessGroup() {
    
    if (this.oldAccessGroupName == this.accessGroupName && this.oldAccessGroupDescription == this.accessGroupDescription) {
      alert("No changes were made to access group information")
    }

    else {
      
      this.bpAccessGroupsService.addUpdateAccessGroup(this.accessGroupId, this.accessGroupName, this.accessGroupDescription, this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.GetAllAccessGroups();
          this.modalService.dismissAll();
          this.ClearData();
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

  ClearData() {
    this.newAccessGroup = "";
    this.newAccessGroupDes = "";
    this.accessGroupId = 0;
    this.accessGroupName = "";
    this.accessGroupDescription="";
    this.oldAccessGroupName = "";
    this.oldAccessGroupDescription = "";
  }
  selectedAccessGroup: string;
  selectedAccessGroupID: number;

  getAllBPRoles(linkrole: any) {
   

    this.RolesList.splice(0, this.RolesList.length);

    this.bpRoleService.getAllRolesAndAccessGroupLinks(this.selectedAccessGroup).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempRole = {} as RolesList;
          
          tempRole.RoleID = current.roleID;
          tempRole.RoleName = current.roleName;
          tempRole.RoleDescription = current.roleDescription;
          tempRole.AccessGroupRoleLinkID = current.accessGroupRoleLinkID;
          tempRole.isActive = current.isActive;

          if (current.accessGroupRoleLinkID != null && current.isActive == true) {
            tempRole.isLinked = true;
          }
          else {
            tempRole.isLinked = false;
          }
          this.RolesList.push(tempRole);
        }
        this.modalService.open(linkrole, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  }
 
  onLinkRoleToAccessGroup(index: any,linkrole:any) {
    let roleLink = this.RolesList[index];

    if (roleLink.AccessGroupRoleLinkID == null) {
      roleLink.AccessGroupRoleLinkID = 0;
    }

    this.bpAccessGroupRoleLinkService.addUpdateAccessGroupRoleLink(roleLink.AccessGroupRoleLinkID, this.selectedAccessGroup, roleLink.RoleName, this.CurrentUser.appUserId, this.selectedAccessGroupID, roleLink.RoleID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        alert(data.responseMessage);
        this.getAllBPRoles(linkrole);
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  }

  onSelectAccessGroup(index: any,linkrole:any) {
    this.selectedAccessGroup = this.AccessGroupsList[index].AccessGroupName;
    this.selectedAccessGroupID = this.AccessGroupsList[index].AccessGroupID;

    this.getAllBPRoles(linkrole);
  }

  onUnlinkRoleFromAccessGroup(index: any, linkrole: any) {
    let roleLink = this.RolesList[index];

    this.bpAccessGroupRoleLinkService.deleteAccessGroupRoleLinkByID(roleLink.AccessGroupRoleLinkID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        alert(data.responseMessage);
        this.getAllBPRoles(linkrole);


      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })

  }
}
