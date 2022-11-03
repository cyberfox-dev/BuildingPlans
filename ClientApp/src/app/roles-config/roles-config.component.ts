import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Role 1' },
  { name: 'Role 2' },
  { name: 'Role 3' },
];

@Component({
  selector: 'app-roles-config',
  templateUrl: './roles-config.component.html',
  styleUrls: ['./roles-config.component.css']
})
export class RolesConfigComponent implements OnInit {


  constructor(private matdialog: MatDialog) { }

  ngOnInit(): void {
  }


  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;


  createSub() {

    /*this.matdialog.open(NewSubDepartmentComponent);*/
  }


  viewSub() {
    /*this.matdialog.open(SubDepartmentConfigComponent, { width: '60%' });*/
  }

}
