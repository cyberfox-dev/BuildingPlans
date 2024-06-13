import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../service/Roles/roles.service';
import { SharedService } from '../shared/shared.service';
import { MatTable } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { BPRolesService } from '../service/BPRoles/bproles.service';

export interface RolesList {
  RoleID: number;
  RoleName: string;
  RoleType: string;
  RoleDescription: string;
}



@Component({
  selector: 'app-bproles-config',
  templateUrl: './bproles-config.component.html',
  styleUrls: ['./bproles-config.component.css']
})
export class BPRolesConfigComponent implements OnInit {
  closeResult = '';
  check: boolean = false;
  CurrentUser: any;
  stringifiedData: any;


  RolesList: RolesList[] = [];
  forEditRole: RolesList[] = [];
  forEditIndex: any;




  public addRole = this.formBuilder.group({
    newRoleName: ['', Validators.required],
    newRoleType: ['', Validators.required],
    newRoleDescription: ['', Validators.required]

  })

  public editRole = this.formBuilder.group({
    editRoleName: ['', Validators.required],
    editRoleType: ['', Validators.required],
    editRoleDescription: ['', Validators.required]

  })

  constructor(private formBuilder: FormBuilder, private matdialog: MatDialog, private modalService: NgbModal, private shared: SharedService, private roleService: RolesService, private bproleService: BPRolesService) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllRoles();



  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  displayedColumns: string[] = ['RoleName', 'RoleType', 'RoleDescription', 'actions'];
  dataSource = this.RolesList;
  @ViewChild(MatTable) rolesTable: MatTable<RolesList> | undefined;

  getAllRoles() {

    this.RolesList.splice(0, this.RolesList.length);

    this.bproleService.getAllRoles().subscribe((data: any) => {

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
        this.dataSource = this.RolesList;
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



  linkUsers(linkUsersToRole: any) {
    this.modalService.open(linkUsersToRole, { centered: true, size: 'lg' });
  }

  toggle() {
    this.check != this.check;
  }

  onRoleCreate() {
    let newRoleName = this.addRole.controls["newRoleName"].value;
    let newRoleType = this.addRole.controls["newRoleType"].value;
    let newRoleDescription = this.addRole.controls["newRoleDescription"].value;

    this.RolesList.splice(0, this.RolesList.length);
    //, newRoleType, newRoleDescription, this.CurrentUser.appUserId
    this.bproleService.addUpdateRole(0, newRoleName, newRoleDescription,newRoleType, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllRoles();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  onRoleDelete(index: any) {
    console.log(this.RolesList[index].RoleName);
    if (confirm("Are you sure to delete " + this.RolesList[index].RoleName + "?")) {

      this.bproleService.deleteRoleByRoleID(this.RolesList[index].RoleID).subscribe((data: any) => {
        this.RolesList.splice(0, this.RolesList.length);
        debugger;
        if (data.responseCode == 1) {

          alert(data.responseMessage);
          debugger;
          this.getAllRoles();
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

  viewLinkedUsers(viewlinkedUsersToRole: any, index: any) {


    this.editRole.controls["editRoleName"].setValue(this.RolesList[index].RoleName);
    this.editRole.controls["editRoleType"].setValue(this.RolesList[index].RoleType);
    this.editRole.controls["editRoleDescription"].setValue(this.RolesList[index].RoleDescription);

    this.forEditIndex = index;

    console.log(index);



    //forEditRole.RoleID = "Engineer";
    //forEditRole.RoleName = "Engineer";
    //forEditRole.RoleType = this.editBpNoApplicant;
    //forEditRole.RoleDescription = this.editProfessionalRegNo;

    this.modalService.open(viewlinkedUsersToRole, { centered: true, size: 'lg' });
  }

  onRoleEdit() {



    let editRoleName = this.editRole.controls["editRoleName"].value;
    let editRoleType = this.editRole.controls["editRoleType"].value;
    let editRoleDescription = this.editRole.controls["editRoleDescription"].value;

    // , editRoleType, editRoleDescription, null

    //this.roleService.addUpdateRole(this.RolesList[this.forEditIndex].RoleID, editRoleName).subscribe((data: any) => {

    //  if (data.responseCode == 1) {
    //    alert(data.responseMessage);
    //    this.getAllRoles();
    //  }
    //  else {
    //    alert(data.responseMessage);
    //  }
    //  console.log("response", data);
    //}, error => {
    //  console.log("Error", error);
    //})

    /*    this.RolesList.splice(0, this.RolesList.length);
        const forEditRole = {} as RolesList;
        forEditRole.RoleID = "Engineer";
        forEditRole.RoleName = "Engineer";
        forEditRole.RoleType = this.editBpNoApplicant;
        forEditRole.RoleDescription = this.editProfessionalRegNo;*/

  }



}


