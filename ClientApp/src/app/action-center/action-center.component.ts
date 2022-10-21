import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-action-center',
  templateUrl: './action-center.component.html',
  styleUrls: ['./action-center.component.css']
})
export class ActionCenterComponent implements OnInit {

  closeResult!: string;
  constructor(private offcanvasService: NgbOffcanvas, private modalService: NgbModal) { }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  ngOnInit(): void {
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }


  panelOpenState = false;
}
