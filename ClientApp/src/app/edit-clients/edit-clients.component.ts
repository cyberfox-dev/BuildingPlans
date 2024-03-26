import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { UserLinkToArchitectService } from '../service/UserLinkToArchitect/user-link-to-architect.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../service/User/user.service';
import { SharedService } from '../shared/shared.service';
import { NewProfileComponent } from '../new-user/new-profile/new-profile.component';
export interface ClientsList {
  UserLinkID: number;
  ClientUserID: string;
  ClientName: string;
  ClientAddress: string;
  ArchitectName: string;
  DateCreated: string;
}
@Component({
  selector: 'app-edit-clients',
  templateUrl: './edit-clients.component.html',
  styleUrls: ['./edit-clients.component.css']
})
export class EditClientsComponent implements OnInit {

  constructor(private userProfileService: UserProfileService, private UserLinkToArchitectService: UserLinkToArchitectService, private modalService: NgbModal, private userService: UserService, private sharedService: SharedService, private newProfileComponent: NewProfileComponent) { }
 
 

  ClientsList: ClientsList[] = [];

  @ViewChild(MatTable) ClientsTable: MatTable<ClientsList> | undefined;
  displayedColumns: string[] = ['ClientName', 'ClientAddress', 'DateCreated', 'actions'];
  dataSource = this.ClientsList;

  stringifiedData: any;
  CurrentUser: any;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any

  UserID: string;
  clientName: string;
  clientSurname: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientPhysicalAddress: string;
  clientFullName

  existingUser: boolean = false;
  validFullName: boolean = false;
  validEmail: boolean = false;
  noEmptyFields: boolean = false;
  linkedClient: boolean = false;

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.UserID = this.CurrentUser.appUserId;
    this.GetAllClientsForArchitect();
  }

  GetAllClientsForArchitect() {
    this.ClientsList.splice(0, this.ClientsList.length);
    this.UserLinkToArchitectService.getAllClientsForArchitect(this.UserID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempClient = {} as ClientsList;
          const current = data.dateSet[i];

          tempClient.UserLinkID = current.userLinkID;
          tempClient.ClientName = current.cLientFullName;
          tempClient.ClientUserID = current.clientUserId;
          tempClient.ClientAddress = current.address;
          tempClient.ArchitectName = current.architectName;
          tempClient.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));

          this.ClientsList.push(tempClient);
        }

        this.ClientsTable.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  DeleteClientLink(index: any) {
    const userLinkId = this.ClientsList[index].UserLinkID;

    this.UserLinkToArchitectService.deleteUserLinkToArchitect(userLinkId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.GetAllClientsForArchitect();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  openAddClient(addClient: any) {
    this.modalService.open(addClient, { centered: true, size: 'xl' });
  }
  CheckExistingClient() {
    if (this.existingUser == false) {
      this.existingUser = true;
    }
    else {
      this.existingUser = false;
    }
  }

  async validateClientInfo() {

    let clientEmail = this.clientEmail;
    let phoneNumber = this.clientPhoneNumber;
    let physicalAddress = this.clientPhysicalAddress;


    debugger;
    const nameRegex = /^[a-zA-Z]+$/;
    if (this.existingUser == false) {
      // Check if clientName is valid
      if (nameRegex.test(this.clientName)) {
        // Check if clientSurname is valid
        if (nameRegex.test(this.clientSurname)) {
          // Both clientName and clientSurname are valid, so concatenate them
          this.validFullName = true;
          this.clientFullName = this.clientName + ' ' + this.clientSurname;
          console.log("Full Name: " + this.clientFullName);
        } else {
          alert("Invalid surname. Please enter a single name with letters only.");
        }
      } else {
        alert("Invalid name. Please enter a single name with letters only.");
      }

      const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (clientEmail === null || !emailRegex.test(clientEmail)) {
        alert("Please enter a valid email address");
        this.validEmail = false;
      } else {
        this.validEmail = true;

        // Check if the email already exists in the wayleave system
        try {
          const exists = await this.userService.emailExists(clientEmail).toPromise();
          if (exists) {
            alert("Email already exists in wayleave system.");
            this.validEmail = false;
          } else {
            console.log("Testing BP Number");
            // Ensure bpNumber is not empty before validating it


          }

        } catch (error) {
          console.error("An error occurred: ", error);
          this.validEmail = false;

        }
      }

      console.log("Email is okay?" + this.validEmail);
     

      //What other validation must be done here?
      if (
        phoneNumber === undefined || phoneNumber.trim() === '' ||
        physicalAddress === undefined || physicalAddress.trim() === '' ||
        this.clientPhoneNumber === undefined || this.clientPhoneNumber.length !== 10 ||
        this.clientEmail === undefined
      ) {
        this.noEmptyFields = false;
        alert("Please fill out all the required fields.");
      } else {
        this.noEmptyFields = true;
      }
      //(this.noEmptyFields == true && this.validFullName == true && this.validEmail == true && this.externalWValidBP == true && this.validID == true)
      if (this.noEmptyFields == true && this.validFullName == true && this.validEmail == true && this.existingUser == false) {
        this.sharedService.errorForRegister = false;
        this.createNewClient();
      }
      else {

        return;

      }

    }
    else {
      debugger;
      if (this.clientName == "" || this.clientEmail == "" || this.clientSurname == "") {
        alert("Please ensure that you enter the existing client's name ,surname and email");
      }
      else {
        this.clientFullName = this.clientName + " " + this.clientSurname;
        this.checkingClientLink();

      }
    }


  }

  createNewClient() {
    try {
      debugger;
      this.userService.register(this.clientFullName, this.clientEmail, "Password@" + this.clientFullName).subscribe((data: any) => {
        if (data.responseCode == 1) {
          debugger;
          this.newProfileComponent.onNewProfileCreate(
            data.dateSet.appUserId,
            this.clientFullName,
            this.clientEmail,
            this.clientPhoneNumber,
            null,
           null,
           null,
            this.clientPhysicalAddress,
            null,
            null,
           null,
           null,
          )
          debugger;
        
          
          alert(this.clientFullName + " has been added as an external client.");
          
          this.UserLinkToArchitectService.addUpdateLinkedUser(0, this.CurrentUser.appUserId, this.CurrentUser.fullName, this.sharedService.clientUserID, this.clientFullName, this.CurrentUser.appUserId, this.clientPhysicalAddress).subscribe((data: any) => {
              if (data.responseCode == 1) {
                alert(data.responseMessage);
                this.GetAllClientsForArchitect();
              }
              else {
                alert(data.responseMessage);
              }
              console.log("response", data);
            }, error => {
              console.log("Error: ", error);
            })
          
          this.modalService.dismissAll();


          //I NEED TO STAY INSIDE THIS MAT-STEPPER
          //this.router.navigate(["/new-profile"]);
        }
      });
    }
    catch (e) {
      console.log("There has been an issue with registering new client: " + e);
    }

    //the part that is relevant is the conditional statement that has a userID of null
  }

  checkingClientLink() {
    debugger;
    for (let i = 0; i < this.ClientsList.length; i++) {
      debugger;
      const tempArchitectClient = this.ClientsList[i];
      if (this.clientFullName == tempArchitectClient.ClientName && this.CurrentUser.fullName == tempArchitectClient.ArchitectName) {
        debugger;
        this.linkedClient = true;
        alert("This User is already listed as one of your clients");
        this.modalService.dismissAll();
      }


    }

    if (this.linkedClient == false) {
      debugger;
      this.userProfileService.checkForExistingUser(this.clientFullName, this.clientEmail).subscribe((data: any) => {
        if (data.responseCode == 1) {
          debugger;
          const current = data.dateSet[0];
          this.UserLinkToArchitectService.addUpdateLinkedUser(0, this.CurrentUser.appUserId, this.CurrentUser.fullName, current.userID, this.clientFullName, this.CurrentUser.appUserId, current.physcialAddress).subscribe((data: any) => {
            if (data.responseCode == 1) {
              alert(data.responseMessage);
              this.modalService.dismissAll();
              this.GetAllClientsForArchitect();
            }
            else {
              alert(data.responseMessage);
            }
            console.log("response", data);
          }, error => {
            console.log("Error: ", error);
          })
        }
        else {
          alert(data.responseMessage);
        }
        console.log("response", data);
      }, error => {
        console.log("Error: ", error);
      })
    }
  }
}
