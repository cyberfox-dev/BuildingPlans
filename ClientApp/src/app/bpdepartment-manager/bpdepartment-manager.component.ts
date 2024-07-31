import { Component, OnInit ,ViewChild} from '@angular/core';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { BPAccessGroupUserLinkService } from '../service/BPAccessGroupsUserLink/bpaccess-group-user-link.service';
import { BPAccessGroupsService } from '../service/BPAccessGroups/bpaccess-groups.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { BpDepartmentsService } from '../service/BPDepartments/bp-departments.service';
import { UserService } from '../service/User/user.service';

export interface UserProfileList {
  UserProfileID: number;
  UserID: string;
  FullName: string;
  Email: string;
  FunctionalArea: string;
  SubDepartmentName: string;
  PhoneNumber: string;
 
}

export interface AccessGroupsList {
  AccessGroupID: number;
  AccessGroupName: string;
  AccessGroupDescription: string;
  isLinked: boolean;
  AccessGroupUserLinkID: number;
}
export interface BPFunctionalAreaList {
  FunctionalAreaID: number;
  FAName: string;

}
export interface DepartmentsList {
  DepartmentID: number;
  DepartmentName: string;
  hasSubDepartment: boolean;

}
@Component({
  selector: 'app-bpdepartment-manager',
  templateUrl: './bpdepartment-manager.component.html',
  styleUrls: ['./bpdepartment-manager.component.css']
})
export class BPDepartmentManagerComponent implements OnInit {

  constructor(private userProfileService: UserProfileService, private bpaccessGroupUserLinkService: BPAccessGroupUserLinkService, private bpAccessGroupService: BPAccessGroupsService, private modalService: NgbModal, private bpFunctionalAreaService: BPFunctionalAreasService, private bpDepartmentsService: BpDepartmentsService, private userService: UserService) { }

  internalUserList: UserProfileList[] = [];
  AllUsers: UserProfileList[] = [];
  accessGroupList: AccessGroupsList[] = [];
  functionalAreasList: BPFunctionalAreaList[] = [];
  departmentsList: DepartmentsList[] = [];

  stringifiedData: any;
  CurrentUser: any;

  @ViewChild(MatTable) linkedUsersTable: MatTable<UserProfileList> | undefined;
  displayedColumns: string[] = ['userName', 'subDepartmentName', 'actions'];
  dataSource = this.internalUserList;

  @ViewChild(MatTable) allUsersTable: MatTable<UserProfileList> | undefined;
  displayedColumnsUser: string[] = ['userName', 'functionalArea', 'subDepartmentName', 'actions'];
  dataSourceUser = this.internalUserList;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  functionalArea: string;
  subDepartmentName: string;

  selectedFunctionalArea: any;
  selectedDepartment: any;
  selectedUser; any;
  accessGroupUserLinkID: number;

  firstName: string = "";
  surname: string = "";
  emailAddress: string = "";
  phoneNumber: string = "";


  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.functionalArea = this.CurrentUserProfile[0].departmentName;
    this.subDepartmentName = this.CurrentUserProfile[0].subDepartmentName;

    this.getAllFunctionalAreas();
  }

  openNewUser(newUser: any) {
    this.modalService.open(newUser, { centered: true, size: 'xl' });
  }
  GetAllInternalUsers(allUsers: any) {
    this.AllUsers.splice(0, this.AllUsers.length);
    this.userProfileService.getInternalUsers().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempUser = {} as UserProfileList;

          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;
          tempUser.FunctionalArea = current.departmentName;
          tempUser.SubDepartmentName = current.subDepartmentName;
          tempUser.PhoneNumber = current.phoneNumber;

          this.AllUsers.push(tempUser);
        }

        this.dataSourceUser = this.AllUsers;
        this.allUsersTable?.renderRows();

        this.modalService.open(allUsers, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })
  }
  onselectUser(index: any, accessGroups: any) {
    this.selectedUser = this.internalUserList[index];
    this.GetAllAccessGroupsAndUserLinks(accessGroups);
  }

  GetAllAccessGroupsAndUserLinks(accessGroups: any) {

    this.accessGroupList.splice(0, this.accessGroupList.length);
    this.bpAccessGroupService.getAllAccessGroupsAndUserLinks(this.selectedUser.UserProfileID, this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempAccessGroup = {} as AccessGroupsList;

          tempAccessGroup.AccessGroupID = current.accessGroupID;
          tempAccessGroup.AccessGroupName = current.accessGroupName;
          tempAccessGroup.AccessGroupDescription = current.accessGroupDescription;
          tempAccessGroup.AccessGroupUserLinkID = current.accessGroupUserLinkID;

          if (current.accessGroupUserLinkID == null || current.isActive == false) {
            tempAccessGroup.isLinked = false;
          }
          else {
            tempAccessGroup.isLinked = true;
          }
          this.accessGroupList.push(tempAccessGroup);

        }

        this.modalService.open(accessGroups, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })
  }

  getAllUsersForFunctionalArea(linkedUsers: any) {

    this.internalUserList.splice(0, this.internalUserList.length);
    this.userProfileService.getUsersForDepartmentAndSubDepartment(this.functionalArea, this.subDepartmentName).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempUser = {} as UserProfileList;

          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;
          tempUser.SubDepartmentName = this.subDepartmentName;

          this.internalUserList.push(tempUser);
        }

        this.dataSource = this.internalUserList;
        this.linkedUsersTable?.renderRows();
        this.modalService.open(linkedUsers, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })

  }

  linkUserToAccessgroup(index: any, accessGroups: any) {

    const accessGroup = this.accessGroupList[index];

    if (accessGroup.AccessGroupUserLinkID == null) {

      this.accessGroupUserLinkID = 0;
    }
    else {

      this.accessGroupUserLinkID = accessGroup.AccessGroupUserLinkID;
    }

    if (accessGroup.AccessGroupName == "Admin") {
      this.userProfileService.updateAdminBool(this.selectedUser.UserProfileID, true, true, null).subscribe((data: any) => {
        if (data.responseCode == 1) {

        }
        else {
          alert(data.responseMessage);
        }
      })
    }
    this.bpaccessGroupUserLinkService.addUpdateAccessGroupUserLink(this.accessGroupUserLinkID, accessGroup.AccessGroupID, accessGroup.AccessGroupName, null, null, this.subDepartmentName, this.selectedUser.UserID, this.CurrentUser.appUserId, this.functionalArea, this.subDepartmentName, this.selectedUser.UserProfileID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        alert(data.responseMessage);
        this.GetAllAccessGroupsAndUserLinks(accessGroups);
      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log(error);

    })
  }

  unlinkUserFromAccessGroup(index: any, accessGroups: any) {
    const accessGroup = this.accessGroupList[index];

    this.bpaccessGroupUserLinkService.deleteUserFromAccessGroup(accessGroup.AccessGroupUserLinkID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        alert(data.responseMessage);
        this.GetAllAccessGroupsAndUserLinks(accessGroups);
      }
      else {
        alert(data.responseMessage);

      }
    }, error => {
      console.log(error);

    })
  }

  getAllFunctionalAreas() {
    this.bpFunctionalAreaService.getAllFunctionalAreas().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempFunctionalArea = {} as BPFunctionalAreaList;

          tempFunctionalArea.FunctionalAreaID = current.functionalAreaID;
          tempFunctionalArea.FAName = current.faName;

          this.functionalAreasList.push(tempFunctionalArea);
        }

      
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })
  }


  validEmail: boolean = false;
  fullName: string;
  async validateNewUserInfo(accessGroups: any) {
    let name = this.firstName;
    let surname = this.surname;
    let email = this.emailAddress;
    let phoneNumber = this.phoneNumber;
    let functionalArea = this.functionalArea;
    let department = this.subDepartmentName;

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const nameRegex = /^[A-Za-z]+$/;
    const numberRegex = /^[0-9]+$/;


    let nameLength = name.split(' ');
    let surnameLength = surname.split(' ');

    if (name != null && name != "" && nameRegex.test(name) && surname != null && surname != "" && nameRegex.test(surname)) {
      if (nameLength.length > 1 || surnameLength.length > 1) {
        alert("Enter a single Name and Surname");
      }
      else {
        this.fullName = name + " " + surname;
        if (phoneNumber != null && phoneNumber != "" && numberRegex.test(phoneNumber) && phoneNumber.length == 10) {
          const SANumber = this.isSouthAfricanPhoneNumber(phoneNumber);

          if (SANumber) {
            if (email != null && email != "" && emailRegex.test(email)) {
              const emailExist = await this.userService.emailExists(email).toPromise();

              if (emailExist) {
                alert("This email address is already exists");
              }
              else {
                this.RegisterUser(this.fullName, email, accessGroups);
              }

            }
            else {
              alert("Enter a valid Email Address");
            }
          }
          else {
            alert("Enter a valid South African Number");
          }
        }
        else {
          alert("Enter a 10 digit Phone Number");
        }




      }
    }
    else {
      alert("Enter a Name and Surname");
    }

  }
  isSouthAfricanPhoneNumber(phoneNumber: string): boolean {
    const mobilePattern = /^(?:\+27|0)[678][0-9]{8}$/;
    const landlinePattern = /^(?:\+27|0)[0-9]{9,10}$/;

    if (mobilePattern.test(phoneNumber)) {
      return true//"Valid South African mobile number";
    } else if (landlinePattern.test(phoneNumber)) {
      return true;//"Valid South African landline number";
    } else {
      return false;//"Invalid phone number";
    }
  }

  RegisterUser(fullName: string, email: string, accessGroups: any) {
    this.userService.register(fullName, email, "12345").subscribe((data: any) => {
      if (data.responseCode == 1) {
        const userID = data.dateSet.appUserId;
        this.addUserProfile(userID, accessGroups)
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })
  }

  async getDepartmentID(subDepartmentName: string, functionalArea:string): Promise<number> {
    try {
      const data: any = await this.bpDepartmentsService.getDepartmentByDepartmentName(subDepartmentName,functionalArea).toPromise();
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        return current.departmentID;
      }
      else {
        throw new Error(data.responseMessage);
      }
    }
    catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }

  async getFunctionalAreaID(functionalArea: any): Promise<number> {
    try {

      const data: any = await this.bpFunctionalAreaService.getFunctionalAreaByFunctionalAreaName(functionalArea).toPromise();

      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        return current.functionalAreaID;
      }
      else {
        throw new Error(data.responseMessage);
      }
    }
    catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }
  async addUserProfile(userID: any, accessGroups: any) {

    const functionalAreaId: number = await this.getFunctionalAreaID(this.selectedFunctionalArea);
    const departmentID: number = await this.getDepartmentID(this.selectedDepartment, this.selectedFunctionalArea);

    this.userProfileService.addUpdateUserProfiles(0, userID, this.fullName, this.emailAddress, this.phoneNumber, true, null, null, null, null, this.functionalArea, functionalAreaId, departmentID, null,
      null, null, null, this.CurrentUser.appUserId, null, null, null, null, null, false, false, this.subDepartmentName, null, null, this.firstName, this.surname, this.functionalArea, null, true, null, true, false).subscribe((data: any) => {
        if (data.responseCode == 1) {

          const UserProfileID = data.dateSet.userProfileID;
          const current = data.dateSet;
          const tempUser = {} as UserProfileList;

          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;

          this.selectedUser = tempUser;

          this.modalService.dismissAll();
          this.openAccessGroupsLinksForNewUser(accessGroups, UserProfileID);
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log(error);
      })
  }
  openAccessGroupsLinksForNewUser(accessGroups: any, userID: any) {

    this.accessGroupList.splice(0, this.accessGroupList.length);
    this.bpAccessGroupService.getAllAccessGroupsAndUserLinks(userID, this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempAccessGroup = {} as AccessGroupsList;

          tempAccessGroup.AccessGroupID = current.accessGroupID;
          tempAccessGroup.AccessGroupName = current.accessGroupName;
          tempAccessGroup.AccessGroupDescription = current.accessGroupDescription;
          tempAccessGroup.AccessGroupUserLinkID = current.accessGroupUserLinkID;

          if (current.accessGroupUserLinkID == null || current.isActive == false) {
            tempAccessGroup.isLinked = false;
          }
          else {
            tempAccessGroup.isLinked = true;
          }
          this.accessGroupList.push(tempAccessGroup);

        }

        this.modalService.open(accessGroups, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })
  }

  GetAllDepartmentsForFunctionalArea() {
    debugger;
    this.departmentsList.splice(0, this.departmentsList.length);
    this.bpDepartmentsService.getAllDepartmentsForFunctionalArea(this.selectedFunctionalArea).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDepartment = {} as DepartmentsList;

          tempDepartment.DepartmentID = current.departmentID;
          tempDepartment.DepartmentName = current.departmentName;

          this.departmentsList.push(tempDepartment);
        }
      }
      else {

      }
    }, error => {
      console.log(error);
    })
  }
  existingUser: boolean = false;
 
  
  onAddUserToNewDepartment(index:any,newUser:any)  {
    this.existingUser = true;
   this.selectedUser = this.AllUsers[index];

    this.firstName = this.selectedUser.FullName.substring(0, this.selectedUser.FullName.indexOf(" "));
    this.surname = this.selectedUser.FullName.substring(this.selectedUser.FullName.indexOf(" ") + 1);
    this.emailAddress = this.selectedUser.Email;
    this.phoneNumber = this.selectedUser.PhoneNumber;
    this.fullName = this.selectedUser.FullName;
    this.modalService.open(newUser, { centered: true, size: 'xl' });
  }

  async checkForExistingUserLink(accessGroups:any) {
   
    try {
      debugger;
      const data: any = await this.userProfileService.checkForExistingUserDepartmentLink(this.selectedUser.UserID, this.selectedFunctionalArea, this.selectedDepartment).toPromise();
      debugger;
      if (data.responseCode == 1) {
        debugger;
        if (data.dateSet.length > 0) {
          alert("User is already link to this department")

        }
        else {
          const functionalAreaId: number = await this.getFunctionalAreaID(this.selectedFunctionalArea);
          const departmentID: number = await this.getDepartmentID(this.selectedDepartment, this.selectedFunctionalArea);
          this.userProfileService.addUpdateUserProfiles(0, this.selectedUser.UserID, this.fullName, this.emailAddress, this.phoneNumber, true, null, null, null, null, this.selectedFunctionalArea, functionalAreaId, departmentID, null,
            null, null, null, this.CurrentUser.appUserId, null, null, null, null, null, false, false, this.selectedDepartment, null, null, this.firstName, this.surname, this.selectedFunctionalArea, null, false, null, true, false).subscribe((data: any) => {
              debugger;
              if (data.responseCode == 1) {

                const UserProfileID = data.dateSet.userProfileID;
                const current = data.dateSet;
                const tempUser = {} as UserProfileList;

                tempUser.UserProfileID = current.userProfileID;
                tempUser.UserID = current.userID;
                tempUser.Email = current.email;
                tempUser.FullName = current.fullName;

                this.selectedUser = tempUser;

                this.modalService.dismissAll();
                this.openAccessGroupsLinksForNewUser(accessGroups, UserProfileID);
              }
              else {
                alert(data.responseMessage);
              }
            }, error => {
              console.log(error);
            })
        }
      }

    }
    catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }

  
}
