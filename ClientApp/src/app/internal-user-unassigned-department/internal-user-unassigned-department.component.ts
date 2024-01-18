import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { ZonesService } from '../service/Zones/zones.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { DepartmentsService } from '../service/Departments/departments.service';


export interface UserList {
  userID: number;
  fullName: string;
  isInternal: boolean;
  depConfirmation: boolean;
  userProfileID: number;
  departmentID: number;
  subDepartmentID: number;
  zoneID: number;
}

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}
export interface ZoneDropdown {
  zoneID: number;
  zoneName: string;
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

  ZoneDropdown: ZoneDropdown[] = [];
  SubDepartmentList: SubDepartmentList[] = [];

  selectedZone: number = 0;
  zoneName: string = ''; 
  internalApplicantDepartment: number = 0;
  subDepartmentName: string = '';
  constructor(private userPofileService: UserProfileService, private router: Router, private zoneService: ZonesService, private subDepartmentsService: SubDepartmentsService, private departmentService: DepartmentsService,) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.onCheckIfUserHasAccess();
    this.getAllSubDepartments();
  }

  wasRejectedbyDept: boolean = false;
  rejectedUserName: string = '';
  rejectedUserProfileID: number;
  rejectedUserID: string;
  selected = 0;


  onCheckIfUserHasAccess() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        const tempUserList = {} as UserList
        const current = data.dateSet[0]
        tempUserList.userID = current.userID;
        this.rejectedUserID = current.userID;
        tempUserList.depConfirmation = current.depConfirmation;
        tempUserList.isInternal = current.isInternal;
        tempUserList.zoneID = current.zoneID;
        tempUserList.subDepartmentID = current.subDepartmentID;
        tempUserList.departmentID = current.departmentID;
        this.rejectedUserName = current.fullName;
        this.rejectedUserProfileID = current.userProfileID;
        this.UserList.push(tempUserList);

        //When user is rejected => departmentID,subDepartmentID & zoneID of an internal user are all made null
        if (tempUserList.depConfirmation == false && tempUserList.isInternal == true && tempUserList.zoneID == null && tempUserList.subDepartmentID == null && tempUserList.departmentID == null) {
          this.wasRejectedbyDept = true;
        }
        else if (tempUserList.depConfirmation == true) {
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

  //UPDATING SELECTIONS==UPDATING SELECTIONS
  getAllSubDepartments() {
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.subDepartmentsService.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          //console.log("THE SUBDEPARTMENT LIST THAT IMMA USE TO UPDATE og SELECTION", current);
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);
        }
        console.log("THE SUBDEPARTMENT LIST THAT IMMA USE TO UPDATE og SELECTION", this.SubDepartmentList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }
  /*onSelectToPopulateZone(event: any) {
    if (event.target.value > 0) {

      this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
      this.zoneService.getZonesBySubDepartmentsID(event.target.value).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneDropdown;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;
            //console.log("THESEARETHEZONES-THESEARETHEZONES-THESEARETHEZONES", current);
            this.ZoneDropdown.push(tempZoneList);
          }
          console.log("THESEARETHEZONES-THESEARETHEZONES-THESEARETHEZONES", this.ZoneDropdown);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);
      }, error => {
        console.log("Error: ", error);
      })
    }

    else {
    }
  }*/

  theDepartmentID: number = 0;
  theDepartmentName: string = '';

  getDepartmentName(departmentId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.departmentService.getDepartmentByDepartmentID(departmentId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.theDepartmentName = data.dateSet[0].departmentName;
          console.log("This is the departmentName", this.theDepartmentName);
          resolve(this.theDepartmentName);
        } else {
          reject(data.responseMessage);
        }
      }, error => {
        reject(error);
      });
    });
  }
  getDepartmentID(subDepartmentID: number) {
    
    this.subDepartmentsService.getSubDepartmentBySubDepartmentID(subDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        this.theDepartmentID = data.dateSet[0].departmentID;

        console.log("All I want is the DepartmentID: ", data);
        //alert(data.responseMessage);
        console.log(data.responseMessage);
      } else {

        //alert(data.responseMessage);
        console.log(data.responseMessage);
      }
      console.log("All I want is the DepartmentID: ", data);
    }, error => {
      // Handle errors that may occur during the zone link update.
      console.log("Error: ", error);
    });
  }
  onSelectToPopulateZone() {
    if (this.internalApplicantDepartment > 0) {
      this.ZoneDropdown = []; // Clear the existing data

      // Find the subDepartmentName from the SubDepartmentList
      const selectedSubDepartment = this.SubDepartmentList.find(dpt => dpt.subDepartmentID === this.internalApplicantDepartment);

      if (selectedSubDepartment) {
        this.subDepartmentName = selectedSubDepartment.subDepartmentName;
      } else {
        this.subDepartmentName = ''; // Set to empty if not found
      }

      this.zoneService.getZonesBySubDepartmentsID(this.internalApplicantDepartment).subscribe((data: any) => {
        if (data.responseCode === 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const tempZoneList: ZoneDropdown = {
              zoneID: current.zoneID,
              zoneName: current.zoneName,
            };
            this.ZoneDropdown.push(tempZoneList);
          }
          console.log("THESE ARE THE ZONES", this.ZoneDropdown);
        } else {
          alert(data.responseMessage);
        }
        console.log("response", data);
      }, error => {
        console.log("Error: ", error);
      });
    }
  }

  updateZoneName() {
    const selectedZoneID = this.selectedZone;
    // Find the selected zone object based on the selectedZoneID
    const selectedZone = this.ZoneDropdown.find(zone => zone.zoneID === selectedZoneID);

    if (selectedZone) {
      this.zoneName = selectedZone.zoneName;
    } else {
      this.zoneName = ''; // Reset zoneName if no zone is selected
    }
  }


 async onUpdateSelection() {

    //These are the things I'd like to update - DepartmentID, Directorate, DepartmentName, SubDepartmentID, SubDepartmentName, zoneID, zoneName
   const SubDepartmentID = this.internalApplicantDepartment;
   const SubDepartmentName = this.subDepartmentName;
   const zoneID = this.selectedZone;
   const zoneName = this.zoneName;

   const fullNameArray = this.rejectedUserName.split(' ');
   const name = fullNameArray[0];
   const surname = fullNameArray[1];

   await this.getDepartmentID(this.internalApplicantDepartment);

   const DepartmentID = this.theDepartmentID;

    await this.getDepartmentName(DepartmentID);
    const Directorate = this.theDepartmentName;
    const DepartmentName = this.theDepartmentName;


    await this.userPofileService.addUpdateUserProfiles(this.rejectedUserProfileID, this.rejectedUserID, null, null, null, null, null, null, null, null, Directorate, DepartmentID, SubDepartmentID, null, null, null, null, this.rejectedUserID,
    null,zoneID,null,null,null,false,false,SubDepartmentName,null,null,name, surname,DepartmentName, zoneName, false,null,false).subscribe((data: any) => {
      if (data.responseCode === 1) {
        console.log("USER HAS UPDATED THEIR DEPARTMENT SELECTION");
        this.wasRejectedbyDept = false;
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });
  }

}
