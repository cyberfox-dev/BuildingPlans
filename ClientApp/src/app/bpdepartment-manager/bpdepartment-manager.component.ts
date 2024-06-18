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
  SubDepartmentName: string;
 
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

  constructor(private userProfileService: UserProfileService, private bpaccessGroupUserLinkService: BPAccessGroupUserLinkService, private bpAccessGroupService: BPAccessGroupsService, private modalService: NgbModal, private bpFunctionalAreaService: BPFunctionalAreasService, private bpDepartmentsService: BpDepartmentsService , private userService:UserService) { }

  internalUserList: UserProfileList[] = [];
  accessGroupList: AccessGroupsList[] = [];
  functionalAreasList: BPFunctionalAreaList[] = [];
  departmentsList: DepartmentsList[] = [];

  stringifiedData: any;
  CurrentUser: any;

  @ViewChild(MatTable) linkedUsersTable: MatTable<UserProfileList> | undefined;
  displayedColumns: string[] = ['userName', 'subDepartmentName', 'actions'];
  dataSource = this.internalUserList;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  functionalArea: string;
  subDepartmentName: string;

  selectedUser; any;
  accessGroupUserLinkID: number;

  firstName: string = "";
  surname: string = "";
  emailAddress: string = "";
  phoneNumber: string = "";
  newDepartmentName: string ;
  newSubDepartmentName: string ;

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    
    this.functionalArea = this.CurrentUserProfile[0].departmentName;
    this.subDepartmentName = this.CurrentUserProfile[0].subDepartmentName;
  }

  openNewUser(newUser: any) {
    this.modalService.open(newUser, { centered: true, size: 'xl' });
  }
  GetAllInternalUsers() {
    this.userProfileService.getInternalUsers().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempUser = {} as UserProfileList;

          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;

          this.internalUserList.push(tempUser);
        }

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

  GetAllAccessGroupsAndUserLinks(accessGroups:any) {
    debugger;
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
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempUser = {} as UserProfileList;
          debugger;
          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.Email = current.email;
          tempUser.FullName = current.fullName;
          tempUser.SubDepartmentName = this.subDepartmentName;

          this.internalUserList.push(tempUser);
        }
        debugger;
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
    debugger;
    const accessGroup = this.accessGroupList[index];

    if (accessGroup.AccessGroupUserLinkID == null) {
      debugger;
      this.accessGroupUserLinkID = 0;
    }
    else {
      debugger;
      this.accessGroupUserLinkID = accessGroup.AccessGroupUserLinkID;
    }
    debugger;
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

  getAllFunctionalAreas(newUser:any) {
    this.bpFunctionalAreaService.getAllFunctionalAreas().subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempFunctionalArea = {} as BPFunctionalAreaList;

          tempFunctionalArea.FunctionalAreaID = current.functionalAreaID;
          tempFunctionalArea.FAName = current.faName;

          this.functionalAreasList.push(tempFunctionalArea);
        }

        this.modalService.open(newUser, { centered: true, size: 'xl' });
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  }

  getAllDepartmentsForFunctionalArea() {
   

    this.bpDepartmentsService.getAllDepartmentsForFunctionalArea(this.newDepartmentName).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDepartment = {} as DepartmentsList;

          tempDepartment.DepartmentID = current.departmentID;
          tempDepartment.DepartmentName = current.departmentName;
          tempDepartment.hasSubDepartment = current.hasSubDepartment;

          this.departmentsList.push(tempDepartment);
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
  async validateNewUserInfo() {
    let name = this.firstName;
    let surname = this.surname;
    let email = this.emailAddress;
    let phoneNumber = this.phoneNumber;
    let functionalArea = this.newDepartmentName;
    let department = this.newSubDepartmentName;

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const nameRegex = /^[A-Za-z]+$/;
    const numberRegex = /^[0-9]+$/;

    if (functionalArea == null && department == null) {
      alert("Please select a Functional Area and Department for which the new user will fall into");
    }
    else {
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

  RegisterUser(fullName:string , email:string) {
    this.userService.register(fullName, email, "12345").subscribe((data: any) => {
      if (data.responseCode == 1) {

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    
    })
  }
}

