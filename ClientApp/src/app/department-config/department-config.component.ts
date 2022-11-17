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

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Water' },
  { name: 'IST' },
  { name: 'Energy' },
  { name: 'Fire' },
];

/*Zone*/
export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
  dateUpdated: any;
  dateCreated: any;
}
export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}



@Component({
  selector: 'app-department-config',
  templateUrl: './department-config.component.html',
  styleUrls: ['./department-config.component.css']
})
export class DepartmentConfigComponent implements OnInit {

  closeResult = '';
  DepartmentList: DepartmentList[] = [];
  ZoneList: ZoneList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];

  CurrentUser: any;
  stringifiedData: any;
  public addDepartment = this.formBuilder.group({
    newDepName: ['', Validators.required]

  })
  displayedColumns: string[] = ['departmentID', 'departmentName', 'dateUpdated', 'dateCreated', 'actions'];
  dataSource = this.DepartmentList;


    /*Zone*/ //Which is populated with subDepartments
  displayedColumnsZone: string[] = ['subDepartmentID', 'subDepartmentName' ,'actions'];
  dataSourceZone = ELEMENT_DATA;

  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;
  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;
  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;


  newSub: any;

  constructor(private matdialog: MatDialog, private formBuilder: FormBuilder, private departmentService: DepartmentsService, private modalService: NgbModal, private zoneService: ZonesService, private subDepartment: SubDepartmentsService) { }

  openDialog() {
    this.matdialog.open(this.newSub);
  }
  openNewSubDep(newSub: any) {
    this.modalService.open(newSub, { centered: true });
  }

  openViewSubDep(viewSub: any) {
    this.modalService.open(viewSub, { centered: true, size: 'xl' });
  }


  createSub() {

    this.matdialog.open(NewSubDepartmentComponent);
  }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);


    this.getAllDepartments();

    //this.zoneService.getZonesList().subscribe((data: any) => {

    //  if (data.responseCode == 1) {

    //    // Todo Zones
    //    for (let i = 0; i < data.dateSet.length; i++) {
    //      const tempZoneList = {} as ZoneList;
    //      const current = data.dateSet[i];
    //      tempZoneList.zoneID = current.ZoneID;
    //      tempZoneList.zoneName = current.ZoneName;
    //      tempZoneList.departmentID = current.departmentID;
    //      tempZoneList.subDepartmentID = current.SubDepartmentID;
    //      tempZoneList.dateUpdated = current.dateUpdated;
    //      tempZoneList.dateCreated = current.dateCreated;
    //      this.ZoneList.push(tempZoneList);

    //    }
    //    this.ZoneListTable?.renderRows();
    //   // this.ZoneList = data.dateSet;
    //    console.log("ZoneList", this.ZoneList);
    //  }
    //  else {
    //    //alert("Invalid Email or Password");
    //    alert(data.responseMessage);
    //  }
    //  console.log("reponse", data);

    //}, error => {
    //  console.log("Error: ", error);
    //})

  

  
  }
  getAllSubDepartmentsByDepartment(index: any) {

    this.subDepartment.getSubDepartmentsList().subscribe((data: any)=>{
      for (let i = 0; i < data.dateSet.length; i++) {

      }

    })
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

        }
        this.ZoneListTable?.renderRows();
        // this.ZoneList = data.dateSet;

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

  onDeleteDepartment(index: any) {
    if (confirm("Are you sure to delete " + this.DepartmentList[index].departmentName + "?")) {

      this.departmentService.deleteDepartment(this.DepartmentList[index].departmentID).subscribe((data: any) => {

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

  ngDoCheck() {
    
  }


/*Sub dep*/
  displayedColumnsSub: string[] = ['name', 'actions'];
  dataSourceSub = ELEMENT_DATA;




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

}
