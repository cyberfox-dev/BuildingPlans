import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { SharedService } from "src/app/shared/shared.service";
import { UserProfileService } from '../service/UserProfile/user-profile.service'; //projectTracker Sindiswa 12 January 2024
import { Observable, catchError, map, of } from 'rxjs'; //projectTracker Sindiswa 12 January 2024

export interface PeriodicElement {
  dep: string;
  indication: any;
}

export interface SubDepartmentList {
  IsRefered: any;
  isAwaitingClarity: any;
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
  zoneID: number;
  zoneName: string;
  zoneUser: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { dep: 'Water & Sanitation', indication:'green' },
  { dep: 'Ist', indication: 'red' },
  { dep: 'Transport', indication: 'wait' },
  { dep: 'Energy', indication: 'orange' },
  { dep: 'Department', indication: 'blue' },


];
@Component({
  selector: 'app-department-circulation',
  templateUrl: './department-circulation.component.html',
  styleUrls: ['./department-circulation.component.css']
})
export class DepartmentCirculationComponent implements OnInit {

  approveIcon = false;
  rejectIcon = false;
  waitingIcon = true;
  referIcon = false;
  ClarifyIcon = false;
  ApprovedConditional = "Approved(Conditional)";
  Approved = "Approved";
  Rejected = "Rejected";
  FinalReject = "FinalReject";
  FinalApproved = "Final Approved";
  SubDepartmentList: SubDepartmentList[] = [];
  applicationDataForView: any;
  Null = null;
  approveOrRejection = '';

  constructor(private subDepartmentForCommentService: SubDepartmentForCommentService, private sharedService: SharedService, /* projectTracker Sindiswa 12 January 2024 */ private userProfileService: UserProfileService ){ }
  displayedColumns: string[] = ['subDepartmentName','zoneName' ,'indication', 'zoneUser']; // projectTracker Sindiswa 12 January 2024
  dataSource = this.SubDepartmentList;
  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;
  ngOnInit(): void {

    
    this.getLinkedDepartments();

  }
 
  setIcon() {
  
  }


  sendData() {

   
  }

  checkForGeneratingPack() {


  }


  getLinkedDepartments() {

   
    const currentApplication = this.sharedService.getViewApplicationIndex();

  

    this.subDepartmentForCommentService.getSubDepartmentForComment(currentApplication.applicationID).subscribe(async (data: any) => {

      if (data.responseCode == 1) {


        for (var i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          
          const tempSubDepartmentList = {} as SubDepartmentList;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          tempSubDepartmentList.isAwaitingClarity = current.isAwaitingClarity;
          tempSubDepartmentList.IsRefered = current.isRefered;
          tempSubDepartmentList.commentStatus = current.commentStatus;
          tempSubDepartmentList.zoneID = current.zoneID;
          if (tempSubDepartmentList.subDepartmentName == "IS&T" || tempSubDepartmentList.subDepartmentName == "Bulk Water") {
            tempSubDepartmentList.zoneName = "CCT";
          } else {
            tempSubDepartmentList.zoneName = current.zoneName;
          }
          tempSubDepartmentList.UserAssaignedToComment = current.userAssaignedToComment; //projectTracker Sindiswa 12 January 2024

          //#region projectTracker Sindiswa 15 January 2024
          if (tempSubDepartmentList.UserAssaignedToComment === null) {
            tempSubDepartmentList.zoneUser = "Not Yet Assigned to Reviewer";
}
          else {
            tempSubDepartmentList.zoneUser = await this.getUserName(current.userAssaignedToComment);
          }
          //#endregion

          this.SubDepartmentList.push(tempSubDepartmentList);
        }
        this.SubDepartmentListTable?.renderRows();
       
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }


  // #region projectTracker Sindiswa 12 January 2024



  async getUserName(userID: any): Promise<string> {
    try {
      const data: any = await this.userProfileService.getUserProfileById(userID).toPromise();
      debugger;
      if (data.responseCode === 1) {
        console.log("Data captured while trying to get username", data);
        debugger;
        return data.dateSet[0].fullName;
      } else {
        throw new Error("Couldn't quite get the username: " + data.responseMessage);
      }
    } catch (error) {
      console.error("Error: ", error);
      throw error; // Rethrow the error for the calling code to handle if needed
    }
  }


  /*
  userName: string = '';
  getUserName(userID: any) {

    this.userProfileService.getUserProfileById(userID).subscribe((data: any) => {
      if (data.responseCode == 1) {

        this.userName = data.dateSet[0].fullName;
      }
      else {
        alert("Couldn't quite get the username: " +  data.responseMessage);
      }
      console.log("Data captured while trying to get username", data);

    }, error => {
      console.log("Error: ", error);
    })
  }*/

  // #endregion
}
