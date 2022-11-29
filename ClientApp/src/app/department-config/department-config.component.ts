import { Component, OnInit, ViewChild } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewSubDepartmentComponent } from '../new-sub-department/new-sub-department.component';
import { SubDepartmentConfigComponent } from '../sub-department-config/sub-department-config.component';
import { DepartmentsService } from '../service/Departments/departments.service';
import { MatTable } from '@angular/material/table';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZonesService } from '../service/Zones/zones.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { SelectionModel } from '@angular/cdk/collections';


export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
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
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}

export interface linkusersToZone {
  name: string;
}
const LinkUsersToZone: PeriodicElement[] = [
  { name: 'User 1' },
  { name: 'User 2' },
  { name: 'User 3' },
];

export interface ViewLinkUsersToZone {
  name: string;
}

const ViewLinkUsersToZone: PeriodicElement[] = [
  { name: 'User 1' },
  { name: 'User 2' },
  { name: 'User 3' },
];

export interface viewLinkedUsersToZone {
  name: string;
}

//const viewLinkedUsersToZone: PeriodicElement[] = [
//  { name: 'User 1' },
//  { name: 'User 2' },
//  { name: 'User 3' },
//];

export interface SubDepartmentDropdown {
  subDepartmentID: number;
  subDepartmentName: string ;
}
export interface ZoneDropdown {
  zoneID: number;
  zoneName: string;
}



export interface UserZoneList {
  id: string;
  fullName: string;
}

@Component({
  selector: 'app-department-config',
  templateUrl: './department-config.component.html',
  styleUrls: ['./department-config.component.css']
})
export class DepartmentConfigComponent implements OnInit {

  closeResult = '';
  check: boolean = false;
  CurrentDepartmentID: any;
  DepartmentList: DepartmentList[] = [];
  ZoneList: ZoneList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentDropdown: SubDepartmentDropdown[] = [];
  ZoneDropdown: ZoneDropdown[] = [];
  UserZoneList: UserZoneList[] = [];





  selection = new SelectionModel<UserZoneList>(true, []);
  CurrentUser: any;
  stringifiedData: any;
  showZone = false;
  showZone2 = false;
  showZoneUserTable = false;

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


  displayedColumns: string[] = [ 'departmentName', 'actions','actionsZone','actionsDep'];
  dataSource = this.DepartmentList;


    //Which is populated with subDepartments
  displayedColumnsSubDepartment: string[] = ['subDepartmentID', 'subDepartmentName', 'departmentID', 'dateUpdated', 'dateCreated', 'actions'  ];
  dataSourceSubDepartment = this.SubDepartmentList;

  displayedColumnsLinkUsers: string[] = ['fullName','actions'];
  dataSourceLinkUsers = this.UserZoneList;


  displayedColumnsViewLinkedSubZones: string[] = ['zoneName', 'actions'];
  dataSourceViewLinkedSubZones = this.ZoneList;

  displayedColumnsViewLinkedUsers: string[] = ['fullName', 'actions'];
  dataSourceViewLinkedUsers = this.UserZoneList;

  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;
  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;
  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;
  @ViewChild(MatTable) UserZoneListTable:  MatTable<UserZoneList> | undefined;
  

  newSub: any;

  constructor(private matdialog: MatDialog, private formBuilder: FormBuilder, private departmentService: DepartmentsService, private modalService: NgbModal, private zoneService: ZonesService, private subDepartment: SubDepartmentsService, private zoneLinkService: ZoneLinkService) { }

  openDialog() {
    this.matdialog.open(this.newSub);
  }
  openNewSubDep(newSub: any) {
    this.modalService.open(newSub, { centered: true });
  }

  openViewSubDep(viewSub: any) {
    this.modalService.open(viewSub, { centered: true, size: 'xl' });
  }
  openViewZones(viewlinkedZones:any) {
    this.modalService.open(viewlinkedZones, { centered: true, size: 'xl' });
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

  }

 


  getAllSubDepartments() {
    this.subDepartment.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.SubDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.SubDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);
           this.SubDepartmentListTable?.renderRows();
        }
      
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


  

  getSubDemartmentByDepartmentID(index: number, viewSub:any) {
    
 
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

            this.SubDepartmentList.push(tempSubDepartmentList);

          }
          console.log("this.SubDepartmentList", this.SubDepartmentList);


          this.openViewSubDep(viewSub);
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
    this.modalService.open(content, { size: 'lg' });
  }

  getAllDepartments() {
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          tempDepartmentList.dateUpdated = current.dateUpdated;
          tempDepartmentList.dateCreated = current.dateCreated;
          this.DepartmentList.push(tempDepartmentList);

        }
        this.DepartmentListTable?.renderRows();
        //this.DepartmentList = data.dateSet;

        
        console.log("DepartmentList", this.DepartmentList);
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





  onDepartmentCreate() {
    debugger;
    let newDepName = this.addDepartment.controls["newDepName"].value;



    this.departmentService.addUpdateDepartment(0, newDepName, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.getAllDepartments();
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


  setCurrentDepartmentID(index: any) {
    this.CurrentDepartmentID = this.DepartmentList[index].departmentID;


  }

  onSubDepartmentCreate() {
    
    let newSubDepName = this.addSubDepartment.controls["newSubDepName"].value;

    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    console.log("this.SubDepartmentList", this.SubDepartmentList);

    this.subDepartment.addUpdateSubDepartment(0, newSubDepName, this.CurrentDepartmentID,this.CurrentUser.appUserId).subscribe((data: any) => {

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
    if (confirm("Are you sure to delete " + this.DepartmentList[index].departmentName + "?")) {

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
  }

  onDeleteSubDepartment(index: any, viewSub:any) {
 
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
    debugger;
    if (newZoneSubDemartment != 0) {


      this.zoneService.addUpdateZone(0, newZoneName, this.DepartmentList[this.CurrentDepartmentID].departmentID, newZoneSubDemartment, this.CurrentUser.appUserId).subscribe((data: any) => {

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

  getAllUsersLinkedToZone(SubDepartmentID:any) {
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

  onZoneDelete(index: any, viewlinkedZones:any) {
    if (confirm("Are you sure to delete " + this.ZoneList[index].zoneName + "?")) {

      this.zoneService.deleteZone(this.ZoneList[index].zoneID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);

          this.onSelectToPopulateZoneTable(null, viewlinkedZones)
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

  populateSubDepartmentDropDown(index: any, newZone:any) {

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

  onSelectToPopulateZoneUserTable(event:any) {
    if (event.target.value > 0) {
      this.zoneService.getUsersLinkedByZoneID(Number(event.target.value)).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as UserZoneList;
            const current = data.dateSet[i];
            tempZoneList.id = current.id;
            tempZoneList.fullName = current.fullName;

            this.UserZoneList.push(tempZoneList);
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
  }

  onSelectToPopulateZoneDropDownView(event: any) {
    debugger;
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

      this.showZone2 = true;
    }
    else {
      this.showZone2 = false;
    }

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.SubDepartmentList = [];
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.SubDepartmentList = [];
      return 'by clicking on a backdrop';
    }
    else if (reason === 'Cross click') {
      this.SubDepartmentList = [];
      return 'by clicking on a backdrop';
    }
    else {
      this.SubDepartmentList = [];

      return `with: ${reason}`;
    }
    
  }


  onZoneUserLink() {
    debugger;
    let selectedSubDep = Number(this.userZoneLink.controls["selectedSubDep"].value);
    let selectedZone = Number(this.userZoneLink.controls["selectedZone"].value);
    

    for (let i = 0; i < this.selection.selected.length; i++) {      
      const current = this.selection.selected[i];
     
      this.zoneLinkService.addUpdateZoneLink(0, this.CurrentDepartmentID, selectedZone, selectedSubDep, current.id ,null,this.CurrentUser.appUserId,).subscribe((data: any) => {

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
    this.userZoneLink.controls["selectedSubDep"].setValue("0");
    this.userZoneLink.controls["selectedZone"].setValue("0");
    this.UserZoneList.splice(0, this.UserZoneList.length);

  }

  onSelectToPopulateZone(event:any) {
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

      this.showZone = true;
    }

    else {
      this.showZone = false;
    }

  }

  userSelectedForLink(user: any) {
    this.selection.toggle(user);
  }



  onSelectToPopulateZoneUsers(event: any, newUserLinkedToZone: any) {
    debugger;
    let selectedSubDep = this.userZoneLink.controls["selectedSubDep"].value;
    let selectedZone = this.userZoneLink.controls["selectedZone"].value;

    const tempSelectedSub = selectedSubDep;
    const tempSelectedZone = selectedZone; 
    this.UserZoneList.splice(0, this.UserZoneList.length);

    if (Number(selectedZone) !> 0) {

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
        this.UserZoneListTable?.renderRows();
        this.modalService.open(newUserLinkedToZone, { centered: true, size: 'xl' });
        this.userZoneLink.controls["selectedSubDep"].setValue(tempSelectedSub);
        this.userZoneLink.controls["selectedZone"].setValue(tempSelectedZone);
        this.showZoneUserTable = true;
      }
      else {
        this.showZoneUserTable = false;
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })

    

    this.UserZoneListTable?.renderRows();
  }

/*Sub dep*/




  /*new zone*/
  openNewZone(newZone: any) {
    this.modalService.open(newZone, { centered: true, size: 'lg' });
  }

  /*link sub dep to zone*/
  linkSubDep(linkSub:any) {
    this.modalService.open(linkSub, { centered: true,size: 'lg' });
  }

  /*view linked sub to zone*/
  viewLinkSubDep(ViewSublinkedZone: any) {
    this.modalService.open(ViewSublinkedZone, { centered: true, size: 'lg' });

  }

  openNewUserlinkedToZone(newUserLinkedToZone: any,index: any) {
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


    this.modalService.open(newUserLinkedToZone, { centered: true, size: 'xl' });
  }
  toggle() {
    this.check = !this.check;
    console.log("1")
  }

}
