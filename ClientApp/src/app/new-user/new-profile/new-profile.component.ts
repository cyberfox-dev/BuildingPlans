import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import Stepper from 'bs-stepper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';





export interface ExternalList {

    extApplicantBpNoApplicant:string;
  extApplicantCompanyName: string;
  extApplicantCompanyRegNo: string;
  extApplicantCompanyType: string;
  extApplicantName: string;
  extApplicantSurname: string;
  extApplicantTellNo: string;
  extApplicantEmail: string;
  extApplicantPhyscialAddress: string;
  extApplicantIDNumber: string;
  extApplicantIDUpload: string;

}
export interface InternalList {

  internalApplicantName: string;
  internalApplicantSurname: string;
  internalApplicantDirectorate: string;
  internalApplicantDepartment: string;
  internalApplicantTellNo: string;
  internalApplicantBranch: string;
  internalApplicantCostCenterNo: string;
  internalApplicantCostCenterOwner: string;

}

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
  ExternalUserProfileData: ExternalList[] = [];
  InternalUserProfileData: InternalList[] = [];


  constructor(private modalService: NgbModal, private shared: SharedService, private userPofileService: UserProfileService, private professionalService :ProfessionalService) { }
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

  ngDoCheck() {

    
   

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
    if (this.showInternal) {

     
      //newInternalUserProfile.internalApplicantName = this.internalApplicantName;
      //newInternalUserProfile.internalApplicantSurname = this.internalApplicantSurname;
      //newInternalUserProfile.internalApplicantDirectorate = this.internalApplicantDirectorate;
      //newInternalUserProfile.internalApplicantDepartment = this.internalApplicantDepartment;
      //newInternalUserProfile.internalApplicantTellNo = this.internalApplicantTellNo;
      //newInternalUserProfile.internalApplicantBranch = this.internalApplicantBranch;
      //newInternalUserProfile.internalApplicantCostCenterNo = this.internalApplicantCostCenterNo;
      //newInternalUserProfile.internalApplicantCostCenterOwner = this.internalApplicantCostCenterOwner;

      //this.userPofileService.addUpdateUserProfiles(null, this.CurrentUser.);


    }

    else {
      //const newExternalUserProfile = {} as ExternalList;
      //this.extApplicantBpNoApplicant;
      //this.extApplicantCompanyName;
      //this.extApplicantCompanyRegNo;
      //this.extApplicantCompanyType;
      //this.extApplicantName;
      //this.extApplicantSurname;
      //this.extApplicantTellNo;
      //this.extApplicantEmail;
      //this.extApplicantPhyscialAddress;
      //this.extApplicantIDNumber;
      //this.extApplicantIDUpload;
    }




  }


}
