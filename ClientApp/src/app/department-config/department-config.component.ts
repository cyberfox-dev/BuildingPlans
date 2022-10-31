import { Component, OnInit } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewSubDepartmentComponent } from '../new-sub-department/new-sub-department.component';
import { SubDepartmentConfigComponent } from '../sub-department-config/sub-department-config.component';

export interface PeriodicElement {
  name: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Water'},
  { name: 'IST' },
  { name: 'Energy'},
  { name: 'Fire' },
];

@Component({
  selector: 'app-department-config',
  templateUrl: './department-config.component.html',
  styleUrls: ['./department-config.component.css']
})
export class DepartmentConfigComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;
  constructor(private modalService: NgbModal, private matdialog: MatDialog) { }

  createSub() {
 /*   this.modalService.open(NewSubDepartmentComponent);*/
    this.matdialog.open(NewSubDepartmentComponent);
  }

  ngOnInit(): void {
  }
  viewSub() {
    this.matdialog.open(SubDepartmentConfigComponent, { width:'60%' });
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal


}
