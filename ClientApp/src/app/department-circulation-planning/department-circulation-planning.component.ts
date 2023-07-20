import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { SharedService } from "src/app/shared/shared.service";
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';

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

  constructor(private documentUploadService: DocumentUploadService, private sharedService: SharedService) { }

  applicationDataForView: ApplicationList[] = [];
  DocumentsList: DocumentsList[] = [];
  @ViewChild(MatTable) DocumentsStatus: MatTable<DocumentsList> | undefined;

  displayedColumns: string[] = ['SubDepartmentName', 'indication'];
  dataSource = this.DocumentsList;

  ngOnInit(): void {
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    const setValues = this.applicationDataForView[0];
    if (setValues != null || setValues != undefined) {

      this.ApplicationID = setValues.applicationID;
    }
    console.log("THISAPPLICATIONIDTHISAPPLICATIONIDTHISAPPLICATIONIDTHISAPPLICATIONIDTHISAPPLICATIONIDTHISAPPLICATIONIDTHISAPPLICATIONID", this.ApplicationID);
    this.getAllDocsForRepository();
  }

  getAllDocsForRepository() {
    this.DocumentsList.splice(0, this.DocumentsList.length);
    this.documentUploadService.getAllDocumentsForApplicationForPlanning(this.ApplicationID).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];

          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.DocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.AssignedUserID = current.assignedUserID;
          tempDocList.DateCreated = current.dateCreated;
          tempDocList.GroupName = current.groupName;
          tempDocList.SubDepartmentID = current.subDepartmentID;
          tempDocList.SubDepartmentName = current.subDepartmentName;
          console.log("THIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGS", current);
          this.DocumentsList.push(tempDocList);

        }
      
        const uniqueDocumentsList: DocumentsList[] = [];
        const subDepartmentIDs: Set<number> = new Set();

        for (const doc of this.DocumentsList) {
          if (!subDepartmentIDs.has(doc.SubDepartmentID)) {
            uniqueDocumentsList.push(doc);
            subDepartmentIDs.add(doc.SubDepartmentID);
          }
        }

        this.DocumentsList = uniqueDocumentsList;
        this.DocumentsStatus?.renderRows();
        // console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })

  }

}
