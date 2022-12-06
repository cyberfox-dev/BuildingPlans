import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import Stepper from 'bs-stepper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { DepartmentsService } from '../../service/Departments/departments.service';

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
}



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

export interface ContractorList {

  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: number;
  CIBRating: string;
  idNumber?: string;

}

@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {

  DepartmentDropdown: DepartmentList[] = [];

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
  linkedContractors: ContractorList[] = [];


  constructor(private modalService: NgbModal, private shared: SharedService, private userPofileService: UserProfileService, private professionalService: ProfessionalService, private departmentService: DepartmentsService) { }
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
    this.forViewPopulateDepartmentDropDown();
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

      this.userPofileService.addUpdateUserProfiles(null, this.CurrentUser.appUserId, this.internalApplicantName + " " + this.internalApplicantSurname, this.CurrentUser.email, this.internalApplicantTellNo, this.showInternal, null, null, null, null, this.internalApplicantDirectorate, 1/*this.internalApplicantDepartment*/, 1, this.internalApplicantBranch, this.internalApplicantCostCenterNo, this.internalApplicantCostCenterOwner, null, this.CurrentUser.appUserId, null).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);

          debugger;
          const linkedContractors = this.shared.getContactorData();
          
         

          for (let i = 0; i < linkedContractors.length; i++) {
            const linkedContractor = this.shared.getContactorDataByIndex(i);

            this.professionalService.addUpdateProfessional(null, linkedContractor.ProfessinalType, linkedContractor.name + " " + linkedContractor.surname, linkedContractor.bpNumber, false, linkedContractor.email, linkedContractor.phoneNumber?.toString(), linkedContractor.professionalRegNo, this.CurrentUser.appUserId, linkedContractor.idNumber, this.CurrentUser.appUserId, linkedContractor.CIBRating)
              .subscribe((data: any) => {

                if (data.responseCode == 1) {

                  //alert(data.responseMessage);
                }
                else {
                  //alert("Invalid Email or Password");
                  alert(data.responseMessage);
                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
          }
        }

        else {
          
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })

      const linkedEngineers = this.shared.getEngineerData;
      //Engineer goes here

    }

    else {
      //const newExternalUserProfile = {} as ExternalList;
      //this.extApplicantBpNoApplicant;
      //this.extApplicantCompanyName;
      //this.extApplicantCompanyRegNo;
      //this.extApplicantCompanyType;
      //this.extApplicantName;
      //this.extApplicantSurname;
      //this.extApplicantTellNo;.
      //this.extApplicantEmail;
      //this.extApplicantPhyscialAddress;
      //this.extApplicantIDNumber;
      //this.extApplicantIDUpload;
    }




  }


  forViewPopulateDepartmentDropDown() {

    this.DepartmentDropdown.splice(0, this.DepartmentDropdown.length);
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;

          this.DepartmentDropdown.push(tempDepartmentList);

        }
        console.log("the derpartment thing works");

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }


}
