import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import Stepper from 'bs-stepper';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {

  @ViewChild("placesRef")
  placesRef: GooglePlaceDirective | undefined;
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  } as unknown as Options


  public showExternal: boolean = false;
  public showInternal: boolean = false;
  public External: boolean = false;
  public Internal: boolean = false;
  public einfoactive: boolean = false;

  closeResult = '';

  /*External*/
  extApplicantBpNoApplicant = '';
  extApplicantCompanyName = '';
  extApplicantCompanyRegNo = '';
  extApplicantCompanyType = '';
  extApplicantName = '';
  extApplicantSurname = '';
  extApplicantTellNo = '';
  extApplicantEmail = '';
  extApplicantPhyscialAddress = '';
  extApplicantIDNumber = '';
  extApplicantIDUpload = '';


  /*Internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
  internalApplicantBranch = '';
  internalApplicantCostCenterNo = '';
  internalApplicantCostCenterOwner = '';

  CurrentUser: any;
  stringifiedData: any;  


  constructor(private modalService: NgbModal) { }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    console.log("Address", address);
    console.log("Address", address);
    console.log("Address", address);
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
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    const fullname = this.CurrentUser.fullName;

    this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
    this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);

    this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
    this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
    this.extApplicantEmail = this.CurrentUser.email; 

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


  onNewProfileCreate() {

  }


}
