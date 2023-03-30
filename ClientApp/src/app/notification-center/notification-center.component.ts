import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  @ViewChild("internalOpt", { static: true }) content!: ElementRef;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {

    this.openSm(this.content);
  }
  openSm(internalOpt: any) {
    this.modalService.open(internalOpt, { size: 'lg' });
  }


}
