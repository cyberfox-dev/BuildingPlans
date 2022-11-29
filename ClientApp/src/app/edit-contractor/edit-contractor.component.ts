import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';

@Component({
  selector: 'app-edit-contractor',
  templateUrl: './edit-contractor.component.html',
  styleUrls: ['./edit-contractor.component.css']
})
export class EditContractorComponent implements OnInit {


  CurrentUser: any;
  stringifiedData: any; 

  constructor(private userPofileService: ProfessionalService) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }





  GetAllContractorsForCurrentUserID() {
    this.userPofileService.GetProfessionalsListByProfessionalType(this.CurrentUser.appUserId, "Contractor").subscribe((data: any) => {


      if (data.responseCode == 1) {

      
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
