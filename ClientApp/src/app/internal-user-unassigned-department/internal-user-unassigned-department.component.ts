import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";


export interface UserList {
  userID: number;
  fullName: string;
  isInternal: boolean;
  depConfirmation: boolean;
}


@Component({
  selector: 'app-internal-user-unassigned-department',
  templateUrl: './internal-user-unassigned-department.component.html',
  styleUrls: ['./internal-user-unassigned-department.component.css']
})



export class InternalUserUnassignedDepartmentComponent implements OnInit {
  UserList: UserList[] = [];

  CurrentUser: any;
  stringifiedData: any;
  constructor(private userPofileService: UserProfileService, private router: Router) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.onCheckIfUserHasAccess();
  }


  onCheckIfUserHasAccess() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        const tempUserList = {} as UserList
        const current = data.dateSet[0]
        tempUserList.userID = current.userID;
        tempUserList.depConfirmation = current.depConfirmation;
        this.UserList.push(tempUserList);

        if (tempUserList.depConfirmation == true) {
          this.router.navigate(["/home"]);
        }
        else {

        }
        console.log("SUBVIKSBJVKJSVNJSV", data.dateSet);
       
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
