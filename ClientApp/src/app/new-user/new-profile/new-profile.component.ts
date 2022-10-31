import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  public showExternal: boolean = false;
  public showInternal: boolean = false;
  public External: boolean = false;
  public Internal: boolean = false;
  public einfoactive: boolean = false;
  public step1div: boolean = true;
  public step2active: boolean = false;
  public step3active: boolean = false;
  public step4active: boolean = false;
  public step2label: boolean = false;
  public step3label: boolean = false;
  public step4label: boolean = false;
  public step2div: boolean = false;
  public step3div: boolean = false;
  public step4div: boolean = false;
  closeResult = '';

  //External
  //bpNoApplicant
  //companyName
  //CompanyRegNo
  //companyType
  //name
  //surname
  //applicantTellNo
  //applicantEmail
  //applicantPhyscialAddress
  //Upload

  //Internal




  constructor(private modalService: NgbModal) { }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


  ngOnInit(): void {

  }
  sInternal() {
    this.showInternal = true;
    this.showExternal = false;
    this.Internal = true;
    this.External = false;
  }

  sExternal() {
    this.showInternal = false;
    this.showExternal = true;
    this.Internal = false;
    this.External = true;
  }
  step1() {
    this.step1div = true;
    this.step2div = false;
    this.step3div = false;
    this.step4div = false;
  }
  step2() {
    this.step1div = false;
    this.step2active = true;
    this.step3div = false;
    this.step2label = true;
    this.step2div = true;
    this.step4div = false;

  }
  step3() {
    this.step1div = false;
    this.step2div = false;
    this.step3active = true;
    this.step3div = true;
    this.step3label = true;
    this.step4div = false;

  }
  step4() {
    this.step1div = false;
    this.step2div = false;
    this.step4active = true;
    this.step3div = false;
    this.step4div = true;
 
    this.step4label = true;

  }


  onNewProfileCreate() {

  }


}
