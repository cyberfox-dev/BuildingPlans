import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { asyncScheduler } from 'rxjs';
import { UserProfileService } from '../service/UserProfile/user-profile.service';

export interface UserList {
  userId: any;
  idNumber: string;
  fullName: string;

}


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  UserList: UserList[] = [];

  displayedColumnsLinkUsers: string[] = ['idNumber', 'fullName', 'actions'];
  dataSourceLinkUsers = this.UserList;

  @ViewChild(MatTable) UserListTable: MatTable<UserList> | undefined;

  constructor(private userPofileService: UserProfileService,) { }

  ngOnInit(): void {
    this.getAllusersNotLinkedToDep();
  }

  async getAllusersNotLinkedToDep() {

     //this.UserList.splice(0, this.UserList.length);


    await this.userPofileService.getAllUsersToLinkToDep().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          
          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;



          this.UserList.push(tempZoneList);
        }
        this.UserListTable?.renderRows();
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
