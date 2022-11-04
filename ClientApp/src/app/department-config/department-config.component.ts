import { Component, OnInit, ViewChild } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewSubDepartmentComponent } from '../new-sub-department/new-sub-department.component';
import { SubDepartmentConfigComponent } from '../sub-department-config/sub-department-config.component';
import { DepartmentsService } from '../service/Departments/departments.service';
import { MatTable } from '@angular/material/table';

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
}

//const ELEMENT_DATA: DepartmentList[] = [
//  { name: 'Water'},
//  { name: 'IST' },
//  { name: 'Energy'},
//  { name: 'Fire' },
//];

@Component({
  selector: 'app-department-config',
  templateUrl: './department-config.component.html',
  styleUrls: ['./department-config.component.css']
})
export class DepartmentConfigComponent implements OnInit {
  DepartmentList: DepartmentList[] = [];
  displayedColumns: string[] = ['departmentID', 'departmentName', 'dateUpdated', 'dateCreated', 'actions'];
  dataSource = this.DepartmentList;
  @ViewChild(MatTable) table: MatTable<DepartmentList> | undefined;

 

  constructor( private matdialog: MatDialog,private departmentService : DepartmentsService) { }

  createSub() {

    this.matdialog.open(NewSubDepartmentComponent);
  }

  ngOnInit(): void {
    this.departmentService.getDepartmentsList().subscribe((data: any) => {
      debugger;
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

        this.table?.renderRows();






        this.DepartmentList = data.dateSet;
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
   // console.log("DepartmentList", this.DepartmentList);

  }

  ngDoCheck() {
    this.table?.renderRows();
  }
  viewSub() {
    this.matdialog.open(SubDepartmentConfigComponent, { width:'60%' });
  }





}
