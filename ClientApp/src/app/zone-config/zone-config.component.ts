import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Water' },
  { name: 'IST' },
  { name: 'Energy' },
  { name: 'Fire' },
];

@Component({
  selector: 'app-zone-config',
  templateUrl: './zone-config.component.html',
  styleUrls: ['./zone-config.component.css']
})
export class ZoneConfigComponent implements OnInit {
  closeResult!: string;
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;

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


}
