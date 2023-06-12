import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-permit-component',
  templateUrl: './permit-component.component.html',
  styleUrls: ['./permit-component.component.css']
})
export class PermitComponentComponent implements OnInit {

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

  }

  openPermitModal(content:any) {

    this.modalService.open(content, { size: 'lg' });
  }
}
