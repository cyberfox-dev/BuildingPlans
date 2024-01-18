import { Component, OnInit, ViewChild } from '@angular/core';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentsService } from '../service/Departments/departments.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../service//User/user.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
}


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})

 

export class UserSettingsComponent implements OnInit {

  DepartmentDropdown: DepartmentList[] = [];

  public department = this.formBuilder.group({
    typeOfDepartment: ['', Validators.required],
    internalApplicantName: ['', Validators.required],
    internalApplicantSurname: ['', Validators.required],
    internalApplicantBranch: ['', Validators.required],
    internalApplicantCostCenterNo: ['', Validators.required],
    internalApplicantCostCenterOwner: ['', Validators.required],
  })

  @ViewChild("placesRef")
  placesRef: GooglePlaceDirective | undefined;
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  } as unknown as Options

  CurrentUser: any;
  stringifiedData: any;  
  hide = true;

  /*type of applicant*/
  isInternal:boolean ;
  toa = '';
  /*external*/
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
  extApplicantVatNumber = '';
  extApplicantEmailAlt = '';
  extApplicantTellNoAlt = '';

  externalApplicantICASANumber = ''; //icasadetails Sindiswa 10 January 2024
  telecomms: boolean = false; //icasadetails Sindiswa 10 January 2024

/*internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';

  internalApplicantTellNo = '';
  internalApplicantTellNoAlt = '';
  internalApplicantEmailAlt = '';
  internalApplicantEmail = '';

  internalApplicantBranch = '';
  internalApplicantCostCenterNo = ''; 
  internalApplicantCostCenterOwner = '';
    DepartmentList: any;

  userProfileID = '';

  /*EditForExternal*/
  extApplicantBpNoApplicantEdit = '';
  extApplicantCompanyNameEdit = '';
  extApplicantCompanyRegNoEdit = '';
  extApplicantCompanyTypeEdit = '';
  extApplicantNameEdit = '';
  extApplicantSurnameEdit = '';
  extApplicantTellNoEdit = '';
  extApplicantEmailEdit = '';
  extApplicantPhyscialAddressEdit = '';
  extApplicantIDNumberEdit = '';
  extApplicantVatNumberEdit = '';

  extApplicantEmailAltEdit = '';
  extApplicantTellNoAltEdit = '';

  externalApplicantICASANumberEdit = ''; //icasadetails Sindiswa 10 January 2024
  /*EditForInternal*/

  internalApplicantNameEdit = '';
  internalApplicantSurnameEdit = '';
  internalApplicantDirectorateEdit = '';
  internalApplicantDepartmentEdit = '';

  internalApplicantTellNoEdit = '';
  internalApplicantTellNoAltEdit = '';
  internalApplicantEmailAltEdit = '';
  internalApplicantEmailEdit = '';

  internalApplicantBranchEdit = '';
  internalApplicantCostCenterNoEdit = '';
  internalApplicantCostCenterOwnerEdit = '';


  //Passwords
  currentPassword = '';
  newPassword = '';
  newReEnterPassword = '';
  stringifiedDataUserProfile: any;

  //public currentUser = this.formBuilder.group({
  //  userID: ['', Validators.required],
  //})
  constructor(private userPofileService: UserProfileService, private formBuilder: FormBuilder, private departmentService: DepartmentsService, private modalService: NgbModal, private userService: UserService) { }

  ngOnInit(): void {




    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
   /*this.getAllDepartments();*/

    this.getUserProfileByUserID();

  }
  //this.CurrentUser.appUserId

  getUserProfileByUserID() {
 
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
       
        
        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        console.log("Hey Sindiswa! These are the current user's details: ", this.CurrentUserProfile);
        const fullname = currentUserProfile.fullName;

        if (currentUserProfile.isInternal == true) {

          this.toa = 'Internal User';
          this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.internalApplicantDirectorate = currentUserProfile.directorate;
          this.internalApplicantDepartment = currentUserProfile.departmentName;
          this.internalApplicantTellNo = currentUserProfile.phoneNumber;
          this.internalApplicantBranch = currentUserProfile.branch;
          this.internalApplicantCostCenterNo = currentUserProfile.costCenterNumber;
          this.internalApplicantCostCenterOwner = currentUserProfile.costCenterOwner;

          this.internalApplicantEmail = currentUserProfile.email;
          this.internalApplicantTellNoAlt = currentUserProfile.alternativePhoneNumber;
          this.internalApplicantEmailAlt = currentUserProfile.alternativeEmail;

          this.isInternal = true;

          console.log("THIS IS THE USERPROFILEID", this.userProfileID);
        }
        else {
          this.toa = 'External User';
          this.extApplicantBpNoApplicant = currentUserProfile.bP_Number;
          this.extApplicantCompanyName = currentUserProfile.companyName;
          this.extApplicantCompanyRegNo = currentUserProfile.companyRegNo;
          this.extApplicantCompanyType = currentUserProfile.companyType;
          this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.extApplicantTellNo = currentUserProfile.phoneNumber;
          this.extApplicantEmail = currentUserProfile.email;
          this.extApplicantPhyscialAddress = currentUserProfile.physcialAddress;
          /*this.extApplicantCompanyType = currentUserProfile.idNumber;*/
          this.extApplicantIDNumber = currentUserProfile.idNumber;
          this.extApplicantVatNumber = currentUserProfile.vatNumber;
         /* this.extApplicantIDNumber = currentUserProfile.;*/
          this.isInternal = false;

          this.extApplicantEmailAlt = currentUserProfile.alternativeEmail;
          this.extApplicantTellNoAlt = currentUserProfile.alternativePhoneNumber;

          this.externalApplicantICASANumber = currentUserProfile.icasaLicense; //icasadetails Sindiswa 10 January 2024
          this.telecomms = this.externalApplicantICASANumber !== null && this.externalApplicantICASANumber !== undefined && this.externalApplicantICASANumber !== ''; //icasadetails Sindiswa 10 January 2024
        }
        this.userProfileID = currentUserProfile.userProfileID;
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  openEditModal(userProfileEditModal: any) {
    
    if (this.isInternal == true) {
      this.internalApplicantNameEdit = this.internalApplicantName;
      this.internalApplicantSurnameEdit = this.internalApplicantSurname;
      this.internalApplicantDirectorateEdit = this.internalApplicantDirectorate;
      this.internalApplicantDepartmentEdit = this.internalApplicantDepartment;
      this.internalApplicantTellNoEdit = this.internalApplicantTellNo;
      this.internalApplicantBranchEdit = this.internalApplicantBranch;
      this.internalApplicantCostCenterNoEdit = this.internalApplicantCostCenterNo;
      this.internalApplicantCostCenterOwnerEdit = this.internalApplicantCostCenterOwner;
      this.internalApplicantSurnameEdit = this.internalApplicantSurname;

      this.internalApplicantEmailEdit = this.internalApplicantEmail;
      this.internalApplicantEmailAltEdit = this.internalApplicantEmailAlt;
      this.internalApplicantTellNoAltEdit = this.internalApplicantTellNoAlt;
    }
    if (this.isInternal == false) {
      this.extApplicantBpNoApplicantEdit = this.extApplicantBpNoApplicant;
      this.extApplicantCompanyNameEdit = this.extApplicantCompanyName;
      this.extApplicantCompanyRegNoEdit = this.extApplicantCompanyRegNo;
      this.extApplicantCompanyTypeEdit = this.extApplicantCompanyType;
      this.extApplicantNameEdit = this.extApplicantName;
      this.extApplicantSurnameEdit = this.extApplicantSurname;
      this.extApplicantTellNoEdit = this.extApplicantTellNo;
      this.extApplicantEmailEdit = this.extApplicantEmail;
      this.extApplicantPhyscialAddressEdit = this.extApplicantPhyscialAddress;
      this.extApplicantIDNumberEdit = '';

      this.extApplicantEmailAltEdit = this.extApplicantEmailAlt;
      this.extApplicantTellNoAltEdit = this.extApplicantTellNoAlt;
      this.externalApplicantICASANumberEdit = this.externalApplicantICASANumber; //icasadetails Sindiswa 10 January 2024
    }

    this.modalService.open(userProfileEditModal,{ centered: true, size: 'lg' });
  }


  openEditPasswordModal(passwordEditModal:any) {
    this.modalService.open(passwordEditModal, { centered: true, size: 'lg' });
  }

  openNewPasswordModal(newPasswordModal:any) {
    this.modalService.open(newPasswordModal, { centered: true, size: 'lg' });
  }

  updateUserProfileDetails() {
    
    if (this.isInternal == true) {
        this.userPofileService.addUpdateUserProfiles(Number(this.userProfileID), this.CurrentUser.appUserId, this.internalApplicantNameEdit + " " + this.internalApplicantSurnameEdit, null,
        this.internalApplicantTellNoEdit, true, null, null, null, null, this.internalApplicantDirectorateEdit, null, null, this.internalApplicantBranchEdit, this.internalApplicantCostCenterNoEdit,
        this.internalApplicantCostCenterOwnerEdit, null, this.CurrentUser.appUserId, null, null, null, null, null, null, null, null, this.internalApplicantEmailAltEdit, this.internalApplicantTellNoAltEdit, this.internalApplicantNameEdit,
        this.internalApplicantSurnameEdit).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);
          
          this.getUserProfileByUserID();
        }

        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
    if (this.isInternal == false) {
      this.userPofileService.addUpdateUserProfiles(Number(this.userProfileID), this.CurrentUser.appUserId, this.extApplicantNameEdit + " " + this.extApplicantSurnameEdit, this.extApplicantEmailEdit, this.extApplicantTellNoEdit, false, null, this.extApplicantCompanyNameEdit, this.extApplicantCompanyRegNoEdit,
        this.extApplicantPhyscialAddressEdit, null, null, null, null, null, null, null, this.CurrentUser.appUserId, null, null, null, null, null, null, null, null, this.extApplicantEmailAltEdit, this.extApplicantTellNoAltEdit, this.extApplicantNameEdit,
        this.extApplicantSurnameEdit, /* icasadetails Sindiswa 10 January 2024 - the arguments on the right of this comment have been recently added */ null, null, null, this.externalApplicantICASANumberEdit).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.getUserProfileByUserID();
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


  CurrentUserProfile: any;
  loggedInUsersEmail = '';
  updatePassword(newPasswordModal:any) {
    this.loggedInUsersEmail = this.CurrentUserProfile[0].email;

    const email = this.loggedInUsersEmail;
    const password = this.currentPassword;

    this.userService.login(email, password).subscribe((data: any) => {

      if (data.responseCode == 1) {

  
        this.modalService.dismissAll();
        this.modalService.open(newPasswordModal, { centered: true, size: 'lg' });
      }

      else {
        alert(data.responseMessage);
  
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


  }

  changePassword() {

    if (this.newPassword === this.newReEnterPassword) {


      this.userService.updatePassword(this.loggedInUsersEmail, this.newPassword).subscribe((data: any) => {
        
        if (data.responseCode === 1) {


          this.modalService.dismissAll();
          alert("Password Changed Successfully");
          this.newPassword = '';
          this.newReEnterPassword = '';
          this.currentPassword = '';

        }

        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }

    else if (this.newPassword !== this.newReEnterPassword && this.newPassword != null || this.newReEnterPassword != null) {
      alert("The passwords do not match");
    }
    else {
      alert("Please enter in both fields");
    }
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    // You can implement your phone number validation logic here
    // For example, you can use regular expressions to validate the format
    const phoneNumberPattern = /^\d{10}$/; // Example: 1234567890

    return phoneNumberPattern.test(phoneNumber);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format pattern

    return emailPattern.test(email);
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    this.extApplicantPhyscialAddress = address.formatted_address;

  }

}
