import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { MatTable } from '@angular/material/table';

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}


@Component({
  selector: 'app-action-center',
  templateUrl: './action-center.component.html',
  styleUrls: ['./action-center.component.css']

})
export class ActionCenterComponent implements OnInit {

  /*textfields*/
  serviceItemName = '';
  description = '';
  rate = '';
  quantity = '';
  total = '';
  checked: boolean = false;



  SubDepartmentList: SubDepartmentList[] = [];

  displayedColumnsSubDepartment: string[] = [ 'subDepartmentName', 'actions'];
  dataSourceSubDepartment = this.SubDepartmentList;

  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;


  closeResult!: string;
  constructor(private offcanvasService: NgbOffcanvas, private modalService: NgbModal, private _snackBar: MatSnackBar, private subDepartment: SubDepartmentsService) { }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  ngOnInit(): void {

  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  depositReqModal(deposit: any) {

    if (this.checked == true) {
      this.modalService.open(deposit, { size: 'xl' });
    }
    else {
      this.modalService.dismissAll();
    }

  }
  uncheck() {
    this.checked = false;
  }
  panelOpenState = false;


  getAllSubDepartments(assign: any) {

    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    
  this.subDepartment.getSubDepartmentsList().subscribe((data: any) => {

    if (data.responseCode == 1) {

      for (let i = 0; i < data.dateSet.length; i++) {
        const tempSubDepartmentList = {} as SubDepartmentList;
        const current = data.dateSet[i];
        tempSubDepartmentList.subDepartmentID = current.SubDepartmentID;
        tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
        tempSubDepartmentList.departmentID = current.departmentID;
        tempSubDepartmentList.dateUpdated = current.dateUpdated;
        tempSubDepartmentList.dateCreated = current.dateCreated;
        this.SubDepartmentList.push(tempSubDepartmentList);
        this.SubDepartmentListTable?.renderRows();
      }

      this.SubDepartmentListTable?.renderRows();
      this.modalService.open(assign, { size: 'xl' });
    }
    else {
      //alert("Invalid Email or Password");
      alert(data.responseMessage);
      this.SubDepartmentListTable?.renderRows();
      this.modalService.open(assign, { size: 'xl' });
    }
    console.log("reponse", data);

  }, error => {
    console.log("Error: ", error);
  })
  }



}





