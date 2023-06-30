import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { SharedService } from "src/app/shared/shared.service";

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
  FinalApproved = "Final Approved";
  SubDepartmentList: SubDepartmentList[] = [];
  applicationDataForView: any;
  Null = null;
  approveOrRejection = '';

  constructor(private subDepartmentForCommentService: SubDepartmentForCommentService, private sharedService: SharedService ){ }
  displayedColumns: string[] = ['subDepartmentName', 'indication'];
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

  

    this.subDepartmentForCommentService.getSubDepartmentForComment(currentApplication.applicationID).subscribe((data: any) => {

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

}
