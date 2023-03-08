import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-gl-code-config',
  templateUrl: './gl-code-config.component.html',
  styleUrls: ['./gl-code-config.component.css']
})
export class GlCodeConfigComponent implements OnInit {

  public addGlCode = this.formBuilder.group({
    newGlCode: ['', Validators.required]

  })

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  openCreateNewGLCode(createNewGLCode:any) {
    this.modalService.open(createNewGLCode, { size: 'xl' });
  }

}
