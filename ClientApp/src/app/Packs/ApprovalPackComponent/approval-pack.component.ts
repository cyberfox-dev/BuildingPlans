import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service"
import { DraftApplicationsService } from 'src/app/service/DraftApplications/draft-applications.service';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
/*import { PdfGenerationService } from 'src/app/service/PDFGeneration/pdf-generation.service';*/
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';


export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
  DocumentGroupName: string;
}

@Component({
  selector: 'app-approval-pack',
  templateUrl: './approval-pack.component.html',
  styleUrls: ['./approval-pack.component.css'],

})
export class ApprovalPackComponent implements OnInit {
  @Input() ApplicationID: number;
  @Input() ServiceConditionActive: boolean | null;
  DocumentsList: DocumentsList[] = [];
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';

  fileAttrs = "Upload File:";
  fileAttrsName = "Doc";

  @ViewChild(MatTable) DocumentsListTable: MatTable<DocumentsList> | undefined;

  fileAttr = 'Choose File';
  displayedColumnsDocs: string[] = ['DocumentName', 'actions'];
  dataSourceDoc = this.DocumentsList;
  currentApplication: any;
  applicationDataForView: any;
  hasFile: boolean;
  fileCount = 0;


  constructor(private documentUploadService: DocumentUploadService,private router: Router, private sharedService: SharedService, /*private PdfGenerationService: PdfGenerationService,*/ private draftApplicationService: DraftApplicationsService, private NewWayleaveComponent: NewWayleaveComponent, private modalService: NgbModal, private applicationService: ApplicationsService, private userPofileService: UserProfileService,) { }

  ngOnInit(): void {
    this.currentApplication = this.sharedService.getViewApplicationIndex();
    this.ApplicationID = this.currentApplication.applicationID;

    this.getAllDocsForApplication();

  }

  getAllDocsForApplication() {
    this.DocumentsList.splice(0, this.DocumentsList.length);
    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];
          const nameCheck = current.documentName.substring(0,13);
 
          if (current.documentName != "Service Condition" && nameCheck == "Approval Pack") {
            tempDocList.DocumentID = current.documentID;
            tempDocList.DocumentName = current.documentName;
            tempDocList.DocumentLocalPath = current.documentLocalPath;
            tempDocList.ApplicationID = current.applicationID;
            tempDocList.AssignedUserID = current.assignedUserID;

            this.DocumentsList.push(tempDocList);
          }

        }

        this.DocumentsListTable?.renderRows();
        console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })

  }
  viewDocument(index: any) {

   

      // Make an HTTP GET request to fetch the document
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.DocumentsList[index].DocumentName}`)
        .then(response => {
          if (response.ok) {
            // The response status is in the 200 range

            return response.blob(); // Extract the response body as a Blob

          } else {
            throw new Error('Error fetching the document');
          }
        })
        .then(blob => {
          // Create a URL for the Blob object
          const documentURL = URL.createObjectURL(blob);

          window.open(documentURL, '_blank');

          // Download the document
          const link = document.createElement('a');
          link.href = documentURL;
          link.download = this.DocumentsList[index].DocumentName; // Set the downloaded file name
          link.click();
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    



  }
}
