import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatTable } from '@angular/material/table';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { SharedService } from "src/app/shared/shared.service";
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { CommentsService } from '../service/Comments/comments.service';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
  DateCreated: any;
  GroupName: string;
  SubDepartmentID: number;
  SubDepartmentName: string;
}
export interface CommentDropDown {
  commentID: number;
  commentName: string;
}
export interface ApplicationList {
  applicationID: number,
  clientName: string,
  clientEmail: string,
  clientAddress: string,
  clientRefNo: string,
  CompanyRegNo: string,
  TypeOfApplication: string,
  NotificationNumber: string,
  WBSNumber: string,
  PhysicalAddressOfProject: string,
  DescriptionOfProject: string,
  NatureOfWork: string,
  ExcavationType: string,
  ExpectedStartDate: Date,
  ExpectedEndDate: Date,
  Location: string,
  clientCellNo: string,
  CreatedById: number,
  ApplicationStatus: string,
  CurrentStageName: string,
  CurrentStageNumber: number,
  CurrentStageStartDate: Date,
  NextStageName: string,
  NextStageNumber: number,
  PreviousStageName: string,
  PreviousStageNumber: number,
  ProjectNumber: string,
  isPlanning?: boolean,
  permitStartDate: Date,
}

@Component({
  selector: 'app-department-circulation-planning',
  templateUrl: './department-circulation-planning.component.html',
  styleUrls: ['./department-circulation-planning.component.css']
})



export class DepartmentCirculationPlanningComponent implements OnInit {

  ApplicationID: number | undefined;
  CommentDropDown: CommentDropDown[] = [];
  constructor(private _bottomSheetRef: MatBottomSheetRef<DepartmentCirculationPlanningComponent>, private commentService: CommentBuilderService,) { }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  public noComments: boolean = false;
  stringifiedData: any;
  CurrentUser: any;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.getAllCommentsByUserID();
  }
  getAllCommentsByUserID() {

    this.CommentDropDown.splice(0, this.CommentDropDown.length);
    
    this.commentService.getCommentByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCommentDropDown = {} as CommentDropDown;
          const current = data.dateSet[i];
          tempCommentDropDown.commentID = current.commentID;
          tempCommentDropDown.commentName = current.commentName;



          this.CommentDropDown.push(tempCommentDropDown);

        }
        console.log("Got all comments", data.dateSet);
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
