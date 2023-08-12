import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentsService } from '../service/Departments/departments.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  CurrentUser: any;
  stringifiedData: any;  


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
extApplicantVatNumber='';

/*internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
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


  /*EditForInternal*/

  internalApplicantNameEdit = '';
  internalApplicantSurnameEdit = '';
  internalApplicantDirectorateEdit = '';
  internalApplicantDepartmentEdit = '';
  internalApplicantTellNoEdit = '';
  internalApplicantBranchEdit = '';
  internalApplicantCostCenterNoEdit = '';
  internalApplicantCostCenterOwnerEdit = '';


  //public currentUser = this.formBuilder.group({
  //  userID: ['', Validators.required],
  //})
  constructor(private userPofileService: UserProfileService, private formBuilder: FormBuilder, private departmentService: DepartmentsService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
   /*this.getAllDepartments();*/

    this.getUserProfileByUserID();

  }
  //this.CurrentUser.appUserId

  getUserProfileByUserID() {
 
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
       
        
        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
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
    }

    this.modalService.open(userProfileEditModal,{ centered: true, size: 'lg' });
  }

  updateUserProfileDetails() {
    
    if (this.isInternal == true) {
      this.userPofileService.addUpdateUserProfiles(Number(this.userProfileID), this.CurrentUser.appUserId, this.internalApplicantNameEdit + " " + this.internalApplicantSurnameEdit, null, null, true, null, null, null, null, this.internalApplicantDirectorateEdit, null, null, this.internalApplicantBranchEdit, this.internalApplicantCostCenterNoEdit, this.internalApplicantCostCenterOwnerEdit, null, this.CurrentUser.appUserId, null, null).subscribe((data: any) => {

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
      this.userPofileService.addUpdateUserProfiles(Number(this.userProfileID), this.CurrentUser.appUserId, this.extApplicantNameEdit + " " + this.extApplicantSurnameEdit, this.extApplicantEmailEdit, this.extApplicantTellNoEdit, false, null, this.extApplicantCompanyNameEdit, this.extApplicantCompanyRegNoEdit, this.extApplicantPhyscialAddressEdit, null, null, null, null, null, null, null, this.CurrentUser.appUserId, null, null).subscribe((data: any) => {

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


}
