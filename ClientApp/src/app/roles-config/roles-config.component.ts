import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


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
  closeResult = '';

  constructor(private matdialog: MatDialog, private modalService: NgbModal) { }

  ngOnInit(): void {
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


  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;


  createSub() {

    /*this.matdialog.open(NewSubDepartmentComponent);*/
  }


  viewSub() {
    /*this.matdialog.open(SubDepartmentConfigComponent, { width: '60%' });*/
  }

}
