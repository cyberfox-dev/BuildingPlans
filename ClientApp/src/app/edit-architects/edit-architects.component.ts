import { Component, OnInit ,ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { UserLinkToArchitectService } from '../service/UserLinkToArchitect/user-link-to-architect.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '../service/UserProfile/user-profile.service';

export interface ArchitectsList {
  UserLinkID: number;
  ArchitectName: string;
  ArchitectUserId: string;
  DateCreated: any;
}
@Component({
  selector: 'app-edit-architects',
  templateUrl: './edit-architects.component.html',
  styleUrls: ['./edit-architects.component.css']
})
export class EditArchitectsComponent implements OnInit {

  stringifiedData: any;
  CurrentUser: any;

  CurrentUserProfile: any;
  stringifiedDataUserProfile: any;

  UserID: string;

  ArchitectsList: ArchitectsList[] = [];
  architectName: string;
  architectEmail: string;
  architectUserID: string;
  

  validArchitect: boolean = false;
  validName: boolean = false;
  validEmail: boolean = false;
 

  constructor(private UserLinkToArchitectService: UserLinkToArchitectService, private modalService: NgbModal, private userProfileService: UserProfileService) { }

  @ViewChild(MatTable) ArchitectsTable: MatTable<ArchitectsList> | undefined;
  displayedColumns: string[] = ['ArchitectName','DateCreated', 'actions'];
  dataSource = this.ArchitectsList;

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.UserID = this.CurrentUser.appUserId;
    this.GetAllAchitectsForUser();
  }

  GetAllAchitectsForUser() {
    debugger;
    this.ArchitectsList.splice(0, this.ArchitectsList.length);
    this.UserLinkToArchitectService.getArchitectsForUser(this.UserID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempArchitect = {} as ArchitectsList;
          const current = data.dateSet[i];
          debugger;
          tempArchitect.UserLinkID = current.userLinkID;
          tempArchitect.ArchitectName = current.architectName;
          tempArchitect.ArchitectUserId = current.architectUserID;
          tempArchitect.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          this.ArchitectsList.push(tempArchitect);
        }
        this.ArchitectsTable.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);



    }, error => {
      console.log("Error: ", error);
    })
  }

  openAddArchitect(addArchitect: any) {
    this.modalService.open(addArchitect, { centered: true, size: 'xl' });
  }

  ValidateArchitectInfo() {
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    

    if (this.architectName == undefined || this.architectName.trim() == "" || this.architectEmail == undefined || this.architectEmail.trim() == "")
       {
      alert("Please fill in all required fields")
    }

    else {
      let name = this.architectName.substring(0, this.architectName.indexOf(" "));
      let surname = this.architectName.substring(this.architectName.indexOf(" ") + 1);
      let email = this.architectEmail;
     

      if (nameRegex.test(name)) {
        if (nameRegex.test(surname)) {
          this.validName = true;

        }
        else {
          alert("Please make sure you enter architects name and surname containing letters only");
        }

      }
      else {
        alert("Please make sure you enter architects name and surname containing letters only");
      }

      if (emailRegex.test(email)) {
        this.validEmail = true;
      }
      else {
        alert("Please enter a valid email address");
      }
      
    }

    if (this.validName == true && this.validEmail == true ) {
      this.FindArchitect()
    }
    
      
    
   
  }

  FindArchitect() {
    this.userProfileService.getAllArchitects().subscribe((data: any) => {
      if (data.responseCode == 1) {
        let found = false;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];

          if (this.architectName == current.fullName && this.architectEmail == current.email ) {
            found = true;
            debugger;
            this.architectUserID = current.userID;
            break;
          }
        }
        if (found == true) {
          this.LinkArchitectToClient();
        }
        else {
          alert("Architect does not exist on database")
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
    })
  }

  LinkArchitectToClient() {
    let existingLink = false;
    for (let i = 0; i < this.ArchitectsList.length; i++) {
      const current = this.ArchitectsList[i];

      if (this.architectUserID == current.ArchitectUserId && this.architectName == current.ArchitectName) {
        existingLink = true;
        break;
      }
    }

    if (existingLink == false) {
      debugger;
      this.UserLinkToArchitectService.addUpdateLinkedUser(0, this.architectUserID, this.architectName, this.CurrentUser.appUserId, this.CurrentUser.fullName,this.CurrentUser.appUserId, this.CurrentUserProfile[0].physcialAddress).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.GetAllAchitectsForUser();
          this.modalService.dismissAll();
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);
      })
    }
  }

  DeleteUserlinkToArchitect(index: any) {
    const userLinkID = this.ArchitectsList[index].UserLinkID;

    this.UserLinkToArchitectService.deleteUserLinkToArchitect(userLinkID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        debugger;
        this.GetAllAchitectsForUser();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
    })
  }
 
}
