import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-zone',
  templateUrl: './new-zone.component.html',
  styleUrls: ['./new-zone.component.css']
})
export class NewZoneComponent implements OnInit {
  closeResult!: string;
  constructor(private modalService: NgbModal) { }

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
