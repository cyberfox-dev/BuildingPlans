import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  CurrentUser: any;
  stringifiedData: any;  


  /*type of applicant*/
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

/*internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
  internalApplicantBranch = '';
  internalApplicantCostCenterNo = '';
  internalApplicantCostCenterOwner = '';


  //public currentUser = this.formBuilder.group({
  //  userID: ['', Validators.required],
  //})
  constructor(private userPofileService: UserProfileService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);


    this.getUserProfileByUserID();

  }
  //this.CurrentUser.appUserId

  getUserProfileByUserID() {





    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        debugger;
        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;

        if (currentUserProfile.isInternal == true) {

          this.toa = 'Internal User';
          this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.internalApplicantDirectorate = currentUserProfile.directorate;
          this.internalApplicantDepartment = currentUserProfile.directorate;
          this.internalApplicantTellNo = currentUserProfile.phoneNumber;
          this.internalApplicantBranch = currentUserProfile.branch;
          this.internalApplicantCostCenterNo = currentUserProfile.costCenterNumber;
          this.internalApplicantCostCenterOwner = currentUserProfile.costCenterOwner;
        }
        else {
          this.toa = 'External User';
          this.extApplicantBpNoApplicant = currentUserProfile.bP_Number;
          this.extApplicantCompanyName = currentUserProfile.companyName;
          this.extApplicantCompanyRegNo = currentUserProfile.companyRegNo;
          //this.extApplicantCompanyType = '';
          this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.extApplicantTellNo = currentUserProfile.phoneNumber;
          this.extApplicantEmail = currentUserProfile.email;
          this.extApplicantPhyscialAddress = currentUserProfile.physcialAddress;
         // this.extApplicantIDNumber = ''; todo chage the dto to include the id number
        }
       
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
