import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-sub-department',
  templateUrl: './new-sub-department.component.html',
  styleUrls: ['./new-sub-department.component.css']
})
export class NewSubDepartmentComponent implements OnInit {
  closeResult = '';

  constructor(private modalService: NgbModal) { }
  @ViewChild("newSubDep", { static: true }) content!: ElementRef;
  ngOnInit(): void {
 
  }

  

  openXl(newSubDep: any) {
    this.modalService.open(newSubDep, { size: 'lg' });
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
