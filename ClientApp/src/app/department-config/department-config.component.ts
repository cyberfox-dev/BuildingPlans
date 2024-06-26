import { Component, OnInit, ViewChild } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NewSubDepartmentComponent } from '../new-sub-department/new-sub-department.component';
import { SubDepartmentConfigComponent } from '../sub-department-config/sub-department-config.component';
import { DepartmentsService } from '../service/Departments/departments.service';
import { MatTable } from '@angular/material/table';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZonesService } from '../service/Zones/zones.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { SharedService } from "src/app/shared/shared.service"
import { BpConfirmModalComponent } from '../bp-confirm-modal/bp-confirm-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { BpAlertModalComponent } from '../bp-alert-modal/bp-alert-modal.component'; //BPDialogBoxes Sindiswa 24062024


export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
  hasSubDepartment: boolean;
  needsZXNumber: boolean; //zxNumberUpdate Sindiswa 01 March 2024
}




/*For viewing sub dep*/
export interface PeriodicElement {
  name: string;
}

/*const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Water' },
  { name: 'IST' },
  { name: 'Energy' },
  { name: 'Fire' },
];*/

/*Zone*/
export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
}
export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  mapLayerID: number;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  glCode: string;
  profitCenter: string;
  permitExpiration:number
  isSetForAutomaticDistribution: boolean;
}


export interface SubDepartmentDropdown {
  subDepartmentID: number;
  subDepartmentName: string;
  needsZXNumber: boolean;
  permitExpiration: number;
  wayleaveExpiration: number;
}
export interface ZoneDropdown {
  zoneID: number;
  zoneName: string;
}



export interface UserZoneList {
  id: string;
  fullName: string;
  zoneLinkID?: any;
}

export interface UserDepartmentAdminList {
  id: string;
  fullName: string;
  
}

@Component({
  selector: 'app-department-config',
  templateUrl: './department-config.component.html',
  styleUrls: ['./department-config.component.css']
})
export class DepartmentConfigComponent implements OnInit {

  public subHasDep: boolean = false;
  public hasSub: boolean = false;

  public addSubOption: boolean = true;
  public removeSubOption: boolean = false;
  public ifDepHasSubUserTable: boolean = false;
  public ifDepHasSubUserDropDown: boolean = true;

  addSubChecked = false;
  closeResult = '';
  check: boolean = false;
  CurrentDepartmentID: any;
  DepartmentList: DepartmentList[] = [];
  ZoneList: ZoneList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentDropdown: SubDepartmentDropdown[] = [];
  ZoneDropdown: ZoneDropdown[] = [];
  UserZoneList: UserZoneList[] = [];
  UserDepartmentAdminList: UserDepartmentAdminList[] = [];





  selection = new SelectionModel<UserZoneList>(true, []);
  selectionUserDepartmentAdminList = new SelectionModel<UserDepartmentAdminList>(true, []);

  CurrentUser: any;
  stringifiedData: any;
  showZone = false;
  showZoneTableUsers = false;
  showZone2 = false;
  showZoneUserTable = false;
  showZoneUsersLinkedTable = false;
  showViewSubLinkedToZone = false;
  subDepID: number;
  selectedSubDepartment: any;
  selectedDepartment: any;
 
  public addDepartment = this.formBuilder.group({
    newDepName: ['', Validators.required]

  })

  public addSubDepartment = this.formBuilder.group({
    newSubDepName: ['', Validators.required]

  })

  public addZone = this.formBuilder.group({
    newZoneName: ['', Validators.required],
    newZoneSubDemartment: ['', Validators.required]

  })

  public userZoneLink = this.formBuilder.group({
    selectedSubDep: ['', Validators.required],
    selectedZone: ['', Validators.required]

  })


  public viewZonesLinkedtoSub = this.formBuilder.group({
    viewSelectedSubDep: ['', Validators.required],
    viewSelectedSubDep2: ['', Validators.required],
    viewSelectedZone: ['', Validators.required],

  })

  public setSubAdmin = this.formBuilder.group({
    SetSubDemartmentAdmin: ['', Validators.required]
  })


  displayedColumns: string[] = ['departmentName', 'actions', 'actionsZone', 'actionsDep'];
  dataSource = this.DepartmentList;


  //Which is populated with subDepartments
  displayedColumnsSubDepartment: string[] = ['subDepartmentID', 'subDepartmentName', 'departmentID', 'dateUpdated', 'dateCreated', 'glCode', 'profitCenter', 'actions'];
  dataSourceSubDepartment = this.SubDepartmentList;

  
  displayedColumnsLinkUsers: string[] = ['fullName', 'actions'];
  dataSourceLinkUsers = this.UserDepartmentAdminList;


  displayedColumnsViewLinkedSubZones: string[] = ['zoneName', 'actions'];
  dataSourceViewLinkedSubZones = this.ZoneList;

  displayedColumnsViewLinkedUsers: string[] = ['fullName', 'actions'];
  dataSourceViewLinkedUsers = this.UserZoneList;

  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;
  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;
  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;
  @ViewChild(MatTable) UserZoneListTable: MatTable<UserZoneList> | undefined;

  header: any;
  newSub: any;

  tabIndex: Tabs = Tabs.View_linked_sub_departments;
  
 

  constructor(private matdialog: MatDialog, public dialog: MatDialog, private formBuilder: FormBuilder, private departmentService: DepartmentsService, private modalService: NgbModal, private zoneService: ZonesService, private subDepartment: SubDepartmentsService, private zoneLinkService: ZoneLinkService, private userProfileService: UserProfileService, public sharedService: SharedService) { }


  openNewSubDep(newSub: any, index: any,) {


    if (this.DepartmentList[index].hasSubDepartment == false) {
      //alert("This department cannot add sub departments");
      const dialogRef = this.dialog.open(BpAlertModalComponent, {
        data: { message: 'This department cannot add sub departments' }
      });
      return;
    }
    else {

      this.modalService.open(newSub, { backdrop: 'static', centered: true });
    }
  }
  //Kyle Gounder 08-01-24
  openPermitExpiration(permitExpiration: any) {
    this.modalService.dismissAll();
    this.modalService.open(permitExpiration, { backdrop: 'static', centered: true, size: 'xl' });
  }
  openGlCodeEdit(makeChanges: any) {
    this.modalService.open(makeChanges, { backdrop: 'static', centered: true, size: 'xl' });
  }

  openViewSubDep(viewSub: any) {
    this.modalService.open(viewSub, { backdrop: 'static', centered: true, size: 'xl' });
  }
  openViewZones(viewlinkedZones: any) {

    this.modalService.open(viewlinkedZones, { backdrop: 'static', centered: true, size: 'xl' });

  }

  setTab(tab: Tabs) {
    this.tabIndex = tab;
  }
  createSub() {

    this.matdialog.open(NewSubDepartmentComponent);
  }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllDepartments();

    this.addZone.controls["newZoneSubDemartment"].setValue("0");
    this.userZoneLink.controls["selectedSubDep"].setValue("0");
    this.userZoneLink.controls["selectedZone"].setValue("0");
    this.viewZonesLinkedtoSub.controls["viewSelectedSubDep2"].setValue("0");
    this.viewZonesLinkedtoSub.controls["viewSelectedSubDep"].setValue("0");
    this.viewZonesLinkedtoSub.controls["viewSelectedZone"].setValue("0");

    this.getAllUsersForDepartmentAdminLink();
  }

  display = 'none';

  onChange(value: MatSlideToggleChange, content: any) {
    this.openXl(content)

  }
  openModal() {
    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
  }

  showthing() {
    console.log(this.addSubChecked);
  }


  getAllUsersForDepartmentAdminLink() {
    this.userProfileService.getInternalUsers().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempInternalList = {} as UserDepartmentAdminList;
          const current = data.dateSet[i];
          tempInternalList.id = current.userID;
          tempInternalList.fullName = current.fullName;



          this.UserDepartmentAdminList.push(tempInternalList);
        }

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }


  onDepartmentUserLink() {

    let SubDemartmentID = Number(this.setSubAdmin.controls["SetSubDemartmentAdmin"].value);
    if (SubDemartmentID != 0) {

      for (let i = 0; i < this.selectionUserDepartmentAdminList.selected.length; i++) {
        const current = this.selectionUserDepartmentAdminList.selected[i];

        this.subDepartment.addDepartmentAdmin(SubDemartmentID, current.id).subscribe((data: any) => {

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
      }
    } else {

      alert("Please select a sundepartment");
    }


    // this..controls["selectedZone"].setValue("0");


  }



  getAllSubDepartments() {

    this.subDepartment.getSubDepartmentsList().subscribe((data: any) => {
      this.sharedService.subDepartmentList.splice(0, this.sharedService.subDepartmentList.length);

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.mapLayerID = current.mapLayerID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          tempSubDepartmentList.glCode = current.glCode;
          tempSubDepartmentList.profitCenter = current.profitCenter;
          tempSubDepartmentList.permitExpiration = current.permitExpiration;
          tempSubDepartmentList.isSetForAutomaticDistribution = current.isSetForAutomaticDistribution;
          this.SubDepartmentList.push(tempSubDepartmentList);
          this.SubDepartmentListTable?.renderRows();
        }

        //Writes to the shared service
        this.sharedService.subDepartmentList = this.SubDepartmentList;
        this.SubDepartmentListTable?.renderRows();
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
        this.SubDepartmentListTable?.renderRows();
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  closemodal() {

    /*this is for viewing linked users to reset*/
    this.viewZonesLinkedtoSub.controls["viewSelectedSubDep2"].setValue("0");
    this.viewZonesLinkedtoSub.controls["viewSelectedZone"].setValue("0");
    this.showZoneTableUsers = false;
    this.showZone2 = false;

    /*this is for linking new users to reset*/
    this.showZoneUserTable = false;
    this.userZoneLink.controls["selectedSubDep"].setValue("0");
    this.userZoneLink.controls["selectedZone"].setValue("0");
    this.showZone = false;


    /*the other viewing one*/
    this.showViewSubLinkedToZone = false;
    this.viewZonesLinkedtoSub.controls["viewSelectedSubDep"].setValue("0");
  }




  getSubDepsForDep(index: number) {
    if (this.SubDepartmentList.length > 0) {
      if (this.DepartmentList[index].departmentName == this.SubDepartmentList[0].subDepartmentName) {
        this.subHasDep = false;
      }
      else if (this.SubDepartmentList[0].subDepartmentName == undefined) {
        this.subHasDep = true;
      }
      else {
        this.subHasDep = true;
      }
    }
    else {
      this.subHasDep = true;
    }

  }

  linkDepAdmin(index: any, linkDepAdminModal: any) {
    ;
    this.setSubAdmin.controls["SetSubDemartmentAdmin"].setValue("0");


    if (this.DepartmentList[index].hasSubDepartment == false) {
      this.ifDepHasSubUserDropDown = false;
      this.ifDepHasSubUserTable = false;
    }
    else {
      this.ifDepHasSubUserDropDown = true;
      this.ifDepHasSubUserTable = true;

    }


    this.SubDepartmentDropdown.splice(0, this.SubDepartmentDropdown.length);
    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentDropdown;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;

          this.SubDepartmentDropdown.push(tempSubDepartmentList);

        }
        this.modalService.open(linkDepAdminModal, { backdrop: 'static', centered: true, size: 'xl' });

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })



  }



  getSubDemartmentByDepartmentID(index: number, viewSub: any) {



    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    
    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      console.log("Got SubDepartments", data.dateSet);
      if (data.responseCode == 1) {
        this.SubDepartmentListTable?.renderRows();
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          tempSubDepartmentList.glCode = current.glCode;
          tempSubDepartmentList.profitCenter = current.profitCenter;

          this.SubDepartmentList.push(tempSubDepartmentList);

        }
        console.log("this.SubDepartmentList", this.SubDepartmentList);


        this.getSubDepsForDep(index);

        if (this.DepartmentList[index].hasSubDepartment == false) {
          alert("This department cannot view sub departments");
        }
        else {
          this.openViewSubDep(viewSub);
        }
        /*          if (this.SubDepartmentList.length > 0) {
                    if ( this.DepartmentList[index].departmentName == this.SubDepartmentList[0].subDepartmentName) {
                      alert("This department cannot view sub departments");
                    }
                    else if (this.SubDepartmentList[0].subDepartmentName == undefined) {
                      this.openViewSubDep(viewSub);
                    }
                    else {
                      this.openViewSubDep(viewSub);
                    }
                  }
                  else {
                    this.openViewSubDep(viewSub);
                  }*/
        this.SubDepartmentListTable?.renderRows();




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

  /*modal*/
  openXl(content: any) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg' });
  }

  getAllDepartments() {
    
    this.DepartmentList.splice(0, this.DepartmentList.length);
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {
        

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          tempDepartmentList.dateUpdated = current.dateUpdated;
          tempDepartmentList.dateCreated = current.dateCreated;
          tempDepartmentList.hasSubDepartment = current.hasSubDepartment;
          tempDepartmentList.needsZXNumber = current.needsZXNumber;//zxNumberUpdate Sindiswa 01 March 2024
          this.DepartmentList.push(tempDepartmentList);

        }
        this.DepartmentListTable?.renderRows();
        //this.DepartmentList = data.dateSet;


        console.log("DepartmentListh", this.DepartmentList);
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


  hasSubDep() {
    this.hasSub = true;
    this.addSubOption = false;
    this.removeSubOption = true;

  }
  hasNoSubDep() {
    this.hasSub = false;
    this.addSubOption = true;
    this.removeSubOption = false;

  }
  resetHasDep() {
    this.hasSub = false;
    this.addSubOption = true;
    this.removeSubOption = false;
  }


  onDepartmentCreate() {



    let newDepName = this.addDepartment.controls["newDepName"].value;



    if (this.hasSub == true) {
      this.departmentService.addUpdateDepartment(0, newDepName, this.hasSub, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          //alert(data.responseMessage);

          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: { message: data.responseMessage }
          });
          this.getAllDepartments();
          return;

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

      this.departmentService.addUpdateDepartment(0, newDepName, this.hasSub, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllDepartments();



          let newSubDepName = this.addDepartment.controls["newDepName"].value;
          let GlCode = this.SubDepartmentList["GlCode"].value;
          let ProfitCenter = this.subDepartment["ProfitCenter"].value;



          this.subDepartment.addUpdateSubDepartment(0, newSubDepName, data.dateSet.departmentID, this.CurrentUser.appUserId, GlCode, ProfitCenter,null,null, null).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              this.DepartmentList.splice(0, this.DepartmentList.length);
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
        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })


    }

  }


  setCurrentDepartmentID(index: any) {
    ;
    this.CurrentDepartmentID = this.DepartmentList[index].departmentID;
    console.log("IM USING THIS CODE", this.CurrentDepartmentID);
    this.header = this.DepartmentList[index].departmentName;
  }
  



  onSubDepartmentCreate() {

    this.getSubDepsForDep(this.CurrentDepartmentID);





    let newSubDepName = this.addSubDepartment.controls["newSubDepName"].value;


    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    console.log("this.SubDepartmentList", this.SubDepartmentList);

    this.subDepartment.addUpdateSubDepartment(0, newSubDepName, this.CurrentDepartmentID, this.CurrentUser.appUserId, null, null,null,null, null).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);

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


  onDeleteDepartment(index: any) {


    const dialogRef = this.dialog.open(BpConfirmModalComponent, {
      data: { message: "Are you sure to delete " + this.DepartmentList[index].departmentName + "?" }
    });
    //if (confirm("Are you sure to delete " + this.DepartmentList[index].departmentName + "?")) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
      this.departmentService.deleteDepartment(this.DepartmentList[index].departmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllDepartments();
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })

      }
    })

    
  }

  onDeleteSubDepartment(index: any, viewSub: any) {

    if (confirm("Are you sure to delete " + this.SubDepartmentList[index].subDepartmentName + "?")) {

      this.subDepartment.deleteSubDepartment(this.SubDepartmentList[index].subDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.SubDepartmentList.splice(index, 1);
          this.SubDepartmentListTable?.renderRows();
          //this.openViewSubDep("viewSub");
          alert(data.responseMessage);


          this.openViewSubDep(viewSub);
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
  }


  /*Zones*/
  onZoneCreate() {

    let newZoneName = this.addZone.controls["newZoneName"].value;
    let newZoneSubDemartment = Number(this.addZone.controls["newZoneSubDemartment"].value);

    if (newZoneSubDemartment != 0) {


      this.zoneService.addUpdateZone(0, newZoneName, this.CurrentDepartmentID, newZoneSubDemartment, this.CurrentUser.appUserId).subscribe((data: any) => {

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
    } else {
      alert("Please Select a Sub Department");

    }

  }

  getAllUsersLinkedToZone(SubDepartmentID: any) {
    this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
    this.zoneService.getZonesBySubDepartmentsID(SubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneDropdown;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;

          this.ZoneDropdown.push(tempZoneList);

        }


      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  forViewPopulateSubDepartmentDropDown(index: any, viewlinkedZones: any) {

    this.SubDepartmentDropdown.splice(0, this.SubDepartmentDropdown.length);
    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentDropdown;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;

          this.SubDepartmentDropdown.push(tempSubDepartmentList);

        }
        this.openViewZones(viewlinkedZones);

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }
  onSelectToPopulateZoneTable(event: any, viewlinkedZones: any) {

    let viewSelectedSubDep = Number(this.viewZonesLinkedtoSub.controls["viewSelectedSubDep"].value);
    this.ZoneList.splice(0, this.ZoneList.length);
    this.zoneService.getZonesBySubDepartmentsID(viewSelectedSubDep).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;

          this.ZoneList.push(tempZoneList);


        }
        this.setTab(Tabs.View_linked_sub_departments);
        this.openViewZones(viewlinkedZones);
        this.showViewSubLinkedToZone = true;

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })

  }

  onZoneDelete(index: any, viewlinkedZones: any) {
    if (confirm("Are you sure to delete " + this.ZoneList[index].zoneName + "?")) {

      this.zoneService.deleteZone(this.ZoneList[index].zoneID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);

          this.onSelectToPopulateZoneTable(null, viewlinkedZones);
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

  onUserUnlinkFromZone(index: any, viewlinkedZones: any) {
    if (confirm("Are you sure to delete " + this.UserZoneList[index].fullName + "?")) {
      this.viewZonesLinkedtoSub.controls["viewSelectedSubDep2"].setValue("0");
      this.viewZonesLinkedtoSub.controls["viewSelectedZone"].setValue("0");


      this.showZone2 = false;
      this.showZoneTableUsers = false;
      this.zoneLinkService.deleteZoneLink(this.UserZoneList[index].zoneLinkID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);

        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);
        this.UserZoneListTable?.renderRows();
        this.setTab(Tabs.View_linked_users);
        this.UserZoneList.splice(0, this.UserZoneList.length);

        this.openViewZones(viewlinkedZones);
        this.UserZoneListTable?.renderRows();

      },
        error => {
          console.log("Error", error);
        })
    }
  }


  populateSubDepartmentDropDown(index: any, newZone: any) {

    this.SubDepartmentDropdown.splice(0, this.SubDepartmentDropdown.length);
    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentDropdown;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;

          this.SubDepartmentDropdown.push(tempSubDepartmentList);

        }
        this.openNewZone(newZone);

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  onSelectToPopulateZoneUserTable(event: any, viewlinkedZones: any) {
    this.UserZoneList.splice(0, this.UserZoneList.length);
    
    if (event.target.value > 0) {
      console.log(event.target.value);
      this.zoneService.getUsersLinkedByZoneID(Number(event.target.value)).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as UserZoneList;
            const current = data.dateSet[i];
            tempZoneList.id = current.id;
            tempZoneList.fullName = current.fullName;
            tempZoneList.zoneLinkID = current.zoneLinkID;


            this.UserZoneList.push(tempZoneList);
          }
          console.log("sovghigiwsgvlp;wsfvg", this.UserZoneList);
          this.setTab(Tabs.View_linked_users);
          this.openViewZones(viewlinkedZones);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);



      }, error => {
        console.log("Error: ", error);
      })
      this.showZoneTableUsers = true;
    }
    else {
      /*      this.viewZonesLinkedtoSub.controls["viewSelectedSubDep2"].setValue("0");
            this.viewZonesLinkedtoSub.controls["viewSelectedZone"].setValue("0");*/

      alert("Please Select a Zone");
      this.showZone2 = false;
      this.showZoneTableUsers = false;
      this.openViewZones(viewlinkedZones);
    }
  }

  onSelectToPopulateZoneDropDownView(event: any, viewlinkedZones: any) {
    this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
    if (event.target.value > 0) {


      this.zoneService.getZonesBySubDepartmentsID(event.target.value).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneDropdown;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;

            this.ZoneDropdown.push(tempZoneList);

          }
          this.setTab(Tabs.View_linked_users);
          this.openViewZones(viewlinkedZones);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })

      this.showZone2 = true;
      this.showZoneTableUsers = false;
    }
    else {
      this.viewZonesLinkedtoSub.controls["viewSelectedZone"].setValue("0");
      alert("Please Select a sub department");
      this.showZone2 = false;
      this.showZoneTableUsers = false;
      this.openViewZones(viewlinkedZones);

    }

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      console.log("ESC");
      this.SubDepartmentList = [];
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("BACKDROP_CLICK");
      this.SubDepartmentList = [];
      return 'by clicking on a backdrop';
    }
    else if (reason === 'Cross click') {
      console.log("Cross click");
      this.SubDepartmentList = [];
      return 'by clicking on a backdrop';
    }
    else {
      this.SubDepartmentList = [];
      console.log("555");
      return `with: ${reason}`;
    }

  }


  onZoneUserLink() {
    ;
    let selectedSubDep = Number(this.userZoneLink.controls["selectedSubDep"].value);
    let selectedZone = Number(this.userZoneLink.controls["selectedZone"].value);

    console.log("this.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selected", this.selection.selected);


    for (let i = 0; i < this.selection.selected.length; i++) {
      const current = this.selection.selected[i];

      this.zoneLinkService.getAllRecordsByUserIdIfDeleted(current.id).subscribe((data: any) => {

        if (data.responseCode == 1) {
          if (data.dateSet.length > 0) {

            
            this.zoneLinkService.addUpdateZoneLink(data.dateSet[0].zoneLinkID, this.ZoneDropdown[selectedZone].zoneID, this.ZoneDropdown[selectedZone].zoneName, this.CurrentDepartmentID, this.SubDepartmentDropdown[selectedSubDep].subDepartmentID, this.SubDepartmentDropdown[selectedSubDep].subDepartmentName, current.id, null, this.CurrentUser.appUserId,false,false, null, null).subscribe((data: any) => {
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
          }
          else {
            this.zoneLinkService.addUpdateZoneLink(0, this.ZoneDropdown[selectedZone].zoneID, this.ZoneDropdown[selectedZone].zoneName, this.CurrentDepartmentID, this.SubDepartmentDropdown[selectedSubDep].subDepartmentID, this.SubDepartmentDropdown[selectedSubDep].subDepartmentName, current.id, null, this.CurrentUser.appUserId, false, false, null, null).subscribe((data: any) => {

              if (data.responseCode == 1) {
                alert(data.responseMessage);


              }
              else {
                alert(data.responseMessage);
              }
              console.log("reponse", data);


            }, error => {
              alert(data.responseMessage);
              console.log("Error: ", error);
            })
          }



        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);


      }, error => {
        alert("Error");
        console.log("Error: ", error);
      })








    }
    this.UserZoneList.splice(0, this.UserZoneList.length);
    this.userZoneLink.controls["selectedSubDep"].setValue("0");
    this.userZoneLink.controls["selectedZone"].setValue("0");


  }

  onSelectToPopulateZone(event: any) {
    
    if (event.target.value > 0) {

      this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
      this.zoneService.getZonesBySubDepartmentsID(event.target.value).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          
          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneDropdown;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;
            
            this.ZoneDropdown.push(tempZoneList);
            
          }


        }
        else {
          
          alert(data.responseMessage);
        }

        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })
      this.userZoneLink.controls["selectedZone"].setValue("0");
      this.showZone = true;
    }

    else {
      this.showZone = false;
      this.showZoneUserTable = false;

    }

  }

  userSelectedForLink(user: any) {

    this.selection.toggle(user);

  }
  userSelectedForDepartmentLink(user: any) {
    this.selectionUserDepartmentAdminList.clear();
    this.selectionUserDepartmentAdminList.select(user);


    //if (this.selectionUserDepartmentAdminList.selected.length < 1) {
    //  this.selectionUserDepartmentAdminList.toggle(user);

    //}
    //for (let i = 0; i < this.selectionUserDepartmentAdminList.selected.length; i++) {
    //  const current = this.selectionUserDepartmentAdminList.selected[i];

    //  if (current.id == user.id) {
    //    this.selectionUserDepartmentAdminList.toggle(user);
    //  }
    //  else {
    //    if (this.selectionUserDepartmentAdminList.selected.length >=1) {
    //      alert("You can Only link a single user!");
    //    }
    //  }


    //}

  }



  onSelectToPopulateZoneUsers(event: any, newUserLinkedToZone: any) {

    if (event.target.value > 0) {

      let selectedSubDep = this.userZoneLink.controls["selectedSubDep"].value;
      let selectedZone = this.userZoneLink.controls["selectedZone"].value;

      const tempSelectedSub = selectedSubDep;
      const tempSelectedZone = selectedZone;
      this.UserZoneList.splice(0, this.UserZoneList.length);

      if (Number(selectedZone)! > 0) {

      }
      this.zoneLinkService.getUsersNotLinkedByUserID(Number(selectedZone)).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as UserZoneList;
            const current = data.dateSet[i];
            tempZoneList.id = current.id;
            tempZoneList.fullName = current.fullName;

            this.UserZoneList.push(tempZoneList);

          }

          this.modalService.dismissAll(newUserLinkedToZone);

          this.modalService.open(newUserLinkedToZone, { backdrop: 'static', centered: true, size: 'xl' });
          this.userZoneLink.controls["selectedSubDep"].setValue(tempSelectedSub);
          this.userZoneLink.controls["selectedZone"].setValue(tempSelectedZone);
          this.showZoneUserTable = true;


        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })



      this.UserZoneListTable?.renderRows();
      this.userZoneLink.controls["selectedSubDep"].setValue("0");
      this.userZoneLink.controls["selectedZone"].setValue("0");
    }
    else {
      this.showZoneUserTable = false;
    }
  }

  /*Sub dep*/




  /*new zone*/
  openNewZone(newZone: any) {
    this.modalService.open(newZone, { backdrop: 'static', centered: true, size: 'lg' });
  }

  /*link sub dep to zone*/
  linkSubDep(linkSub: any) {
    this.modalService.open(linkSub, { backdrop: 'static', centered: true, size: 'lg' });
  }

  /*view linked sub to zone*/
  viewLinkSubDep(ViewSublinkedZone: any) {
    this.modalService.open(ViewSublinkedZone, { backdrop: 'static', centered: true, size: 'lg' });

  }

  openNewUserlinkedToZone(newUserLinkedToZone: any, index: any) {
    
    this.SubDepartmentDropdown.splice(0, this.SubDepartmentDropdown.length);
    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        

        for (let i = 0; i < data.dateSet.length; i++) {
          
          const tempSubDepartmentList = {} as SubDepartmentDropdown;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;

          this.SubDepartmentDropdown.push(tempSubDepartmentList);

        }


      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })

    
    this.modalService.open(newUserLinkedToZone, { backdrop: 'static', centered: true, size: 'xl' });
  }
  toggle() {
    this.check = !this.check;
    console.log("1")
  }
  

  getSubDemartmentBySubDepartmentID(subDepID:number ) {
    
    this.subDepartment.getSubDepartmentBySubDepartmentID( subDepID).subscribe((data: any) => {
     
      console.log("Got SubDepartment", data.dateSet);
     

      if (data.responseCode == 1) {
        
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[0];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.glCode = current.glCode;
        tempSubDepartmentList.profitCenter = current.profitCenter;
        tempSubDepartmentList.permitExpiration = current.permitExpiration;
          this.selectedSubDepartment = tempSubDepartmentList;
          

        
       
          console.log("this.SubDepartSource", this.SubDepartmentList);
      
      }
      else {
        
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })

  }
  onSaveForEditGlCodeAndProfitCenter(selectedSubDepartment:any )
  {
    
    this.subDepartment.addUpdateSubDepartment(selectedSubDepartment.subDepartmentID, selectedSubDepartment.subDepartmentName, null, null, selectedSubDepartment.glCode, selectedSubDepartment.profitCenter,null,null, null).subscribe((data: any) => {
     
      if (data.responseCode == 1) {
        
        alert("Update for " + selectedSubDepartment.subDepartmentName+ " Successful");

      }
      else {
        
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  //Kyle Gounder 08-01-24
  onSavePermitExpiration(selectedSubDepartment) {
    this.subDepartment.addUpdateSubDepartment(selectedSubDepartment.subDepartmentID, selectedSubDepartment.subDepartmentName, null, null, null,null,selectedSubDepartment.permitExpiration, null, null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        
        alert("Update for " + selectedSubDepartment.subDepartmentName + " Successful");
        this.modalService.dismissAll();
      }
      else {
        
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  //#region zxNum Sindiswa 08 February 2024
  selectedDepartmentName: string;
  SubdepartmentZXList: SubDepartmentDropdown[] = [];

  displayedColumnsZX: string[] = ['name', 'zxBool'];
  dataSourceZX = this.SubdepartmentZXList;
  @ViewChild(MatTable) subDepartmentsTable: MatTable<SubDepartmentDropdown> | undefined;

  onViewSetZXNumber(index: number, zxNumberModal: any) {
    this.selectedDepartmentName = this.DepartmentList[index].departmentName;
    this.SubDepartmentDropdown.splice(0, this.SubDepartmentDropdown.length);
    this.SubdepartmentZXList.splice(0, this.SubdepartmentZXList.length);
    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentDropdown;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.needsZXNumber = current.needsZXNumber;

          this.SubDepartmentDropdown.push(tempSubDepartmentList);
          this.SubdepartmentZXList.push(tempSubDepartmentList);

        }
        this.subDepartmentsTable.renderRows();
        this.modalService.open(zxNumberModal, { backdrop: 'static', centered: true, size: 'lg' });

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })

  }
  selectedZXSubdepartmentID: number;
  selectedZXSubdepartmentName: string;
  selectedZXneedsZXNumber: boolean;
  //onSelectSubDepartment(subDepID, zxNumberSubDptModal) {
  onSelectSubDepartment(selectedSubDepartment, zxNumberSubDptModal) {

    this.selectedZXSubdepartmentID = selectedSubDepartment.subDepartmentID;
    this.selectedZXSubdepartmentName = selectedSubDepartment.subDepartmentName;
    this.selectedZXneedsZXNumber = selectedSubDepartment.needsZXNumber;
    this.modalService.open(zxNumberSubDptModal, { backdrop: 'static', centered: true, size: 'lg' });
  }

  onSaveZXNumberBool() {
    const confirm = window.confirm("Are you sure you want to change this setting?");

    if (confirm) {
      this.subDepartment.addUpdateSubDepartment(this.selectedZXSubdepartmentID, this.selectedZXSubdepartmentName, null, null, null, null, null, null, this.selectedZXneedsZXNumber).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert("Configuration has been changed accordingly.");
          this.getAllSubDepartments();

          this.selectedZXSubdepartmentID = null ;
          this.selectedZXSubdepartmentName = null;
          this.selectedZXneedsZXNumber = null;
        }
        else {
          alert(data.responseMessage);
        }
        console.log("Saving ZX Number things", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
  }
  // #endregion


  //#region zxNumberUpdate Sindiswa 01 March 2024
  selectedZXDepartmentID: number;
  selectedHasSubdepartment: boolean;

  onViewSetZXNumber2(index: number, zxNumberDptModal: any) {
    
    this.selectedDepartmentName = this.DepartmentList[index].departmentName;
    this.selectedZXneedsZXNumber = this.DepartmentList[index].needsZXNumber;
    this.selectedZXDepartmentID = this.DepartmentList[index].departmentID;
    this.selectedHasSubdepartment = this.DepartmentList[index].hasSubDepartment;
    this.modalService.open(zxNumberDptModal, { backdrop: 'static', centered: true, size: 'lg' });

  }

  onSaveZXNumberBool2() {
    
    const confirm = window.confirm("Are you sure you want to change this setting?");

    if (confirm) {
      this.departmentService.addUpdateDepartment(this.selectedZXDepartmentID, this.selectedDepartmentName, this.selectedHasSubdepartment, null, this.selectedZXneedsZXNumber).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert("Configuration has been changed accordingly.");
          this.getAllDepartments();

          this.selectedZXDepartmentID = null;
          this.selectedDepartmentName = null;
          this.selectedZXneedsZXNumber = null;
          this.selectedHasSubdepartment = null;
        }
        else {
          alert(data.responseMessage);
        }
        console.log("Saving ZX Number things", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
  }
  //#endregion

  //#region
  SubdepartmentExpiryList: SubDepartmentDropdown[] = [];
  selectedExpirySubdepartmentName: string;
  selectedExpirySubdepartmentID: number;

  displayedColumnsExpiry: string[] = ['name', 'wayleaveExpiry', 'permitExpiry', 'actions'];
  dataSourceExpiry = this.SubdepartmentExpiryList;
  @ViewChild(MatTable) subDepartmentsExpiryTable: MatTable<SubDepartmentDropdown> | undefined;



  onViewSetExpiration(index: number, expirationDays: any) {
    this.selectedDepartmentName = this.DepartmentList[index].departmentName;
    this.SubDepartmentDropdown.splice(0, this.SubDepartmentDropdown.length);
    this.SubdepartmentExpiryList.splice(0, this.SubdepartmentExpiryList.length);

    this.subDepartment.getSubDepartmentsByDepartmentID(this.DepartmentList[index].departmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentDropdown;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.needsZXNumber = current.needsZXNumber;
          tempSubDepartmentList.permitExpiration = current.permitExpiration;
          tempSubDepartmentList.wayleaveExpiration = current.wayleaveExpiration;

          this.SubDepartmentDropdown.push(tempSubDepartmentList);
          this.SubdepartmentExpiryList.push(tempSubDepartmentList);

        }
        this.subDepartmentsExpiryTable.renderRows();
        this.modalService.open(expirationDays, { backdrop: 'static', centered: true, size: 'xl' });

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  selectedWayleaveExpiration: number;
  selectedPermitExpiration: number;
  onSelectExpirationSubdepartment(index: number, expirationSubDptDays: any ) {

    this.selectedExpirySubdepartmentID = this.SubdepartmentExpiryList[index].subDepartmentID;
    this.selectedExpirySubdepartmentName = this.SubdepartmentExpiryList[index].subDepartmentName;
    this.selectedWayleaveExpiration = this.SubdepartmentExpiryList[index].permitExpiration;
    this.selectedPermitExpiration = this.SubdepartmentExpiryList[index].wayleaveExpiration;
    this.modalService.open(expirationSubDptDays, { backdrop: 'static', centered: true, size: 'lg' });
  }

  onSaveExpiarationDays() {

    if (this.selectedPermitExpiration === null || this.selectedPermitExpiration === undefined || this.selectedWayleaveExpiration === null || this.selectedWayleaveExpiration === undefined) {
      alert("Inputs can't be null.");
    }
    else { 

      //const confirm = window.confirm("Are you sure you want to update the expiration day settings?");
      const dialogRef = this.matdialog.open(BpConfirmModalComponent, {
        data: { message: "Are you sure you want to update the expiration day settings?" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
      //if (confirm) {
        this.subDepartment.addUpdateSubDepartment(this.selectedExpirySubdepartmentID, this.selectedExpirySubdepartmentName, null, null, null, null, this.selectedPermitExpiration, this.selectedWayleaveExpiration, null).subscribe((data: any) => {
          if (data.responseCode == 1) {
            alert("Expiration configurations has been changed accordingly.");
            this.getAllSubDepartments();

            this.selectedExpirySubdepartmentID = null;
            this.selectedExpirySubdepartmentName = null;
            this.selectedWayleaveExpiration = null;
            this.selectedPermitExpiration = null;
          }
          else {
            alert(data.responseMessage);
          }
          console.log("Saving Expiartion day things", data);

        }, error => {
          console.log("Error: ", error);
        })
        }
      });
    }
  }
  //#endregion
}
enum Tabs {
  View_linked_sub_departments = 0,
  View_linked_users = 1
}
