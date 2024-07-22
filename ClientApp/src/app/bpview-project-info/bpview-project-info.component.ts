import { Component, OnInit, ViewChild} from '@angular/core';
import { BuildingApplicationsService } from 'src/app/service/BuildingApplications/building-applications.service';
import { SharedService } from 'src/app/shared/shared.service';
import { RefreshService } from '../shared/refresh.service';
import { Router } from "@angular/router";
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BPDocumentsUploadsService } from '../service/BPDocumentsUploads/bpdocuments-uploads.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { BPManDocService } from 'src/app/service/BPManDoc/bpman-doc.service';
import { BPMandatoryStageDocumentService } from 'src/app/service/BPMandatoryStageDocuments/bpmandatory-stage-document.service';
import {DocumentsComponentComponent } from'src/app/documents-component/documents-component.component'
import { BPCommentsService } from '../service/BPComments/bpcomments.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { BpAlertModalComponent } from '../bp-alert-modal/bp-alert-modal.component';
export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  ApplicationId: number;
  DateCreated: any;
  DateUpdated: any;
  DescriptionForRepoDoc: string;
}



export interface LSMandatoryDocumentsList {
  mandatoryDocumentStageLinkID: number;
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  stageName: string;
  dateCreated: any;
  uploads: Array<{ filename: string; /*... other properties*/ }>;
}

export interface CommentsList {
  CommentID: number;
  ApplicationID: number;
  FunctionalArea: string;
  Comment: string;
  CommentStatus: string;
  SubDepartmentForCommentID: number;
  isApplicantReply: string;
  SecondReply: string;
  UserName: string;
  CanReplyUserID: string;
  CreatedById: string;
  DateCreated: any;
  ViewReply: boolean;
}
@Component({
  selector: 'app-bpview-project-info',
  templateUrl: './bpview-project-info.component.html',
  styleUrls: ['./bpview-project-info.component.css']
})

export class BPViewProjectInfoComponent implements OnInit {

  constructor(
    private bpService: BuildingApplicationsService,
    private sharedService: SharedService,
    private refreshService: RefreshService,
    private router: Router,
    private documentUploadService: DocumentUploadService,
    private bpDocumentUploadService: BPDocumentsUploadsService,
    private modalService: NgbModal,
    private BPManDocService: BPManDocService,
    private BPMandatoryStageDocumentService: BPMandatoryStageDocumentService,
    private DocumentsComponentComponent: DocumentsComponentComponent, private bpCommentsService: BPCommentsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
  ) { }

  // Properties
  LSMandatoryDocuments = new BehaviorSubject<LSMandatoryDocumentsList[]>([]);

  /* LSMandatoryDocuments = new BehaviorSubject<LSMandatoryDocumentsList[]>([]);*/

  DocumentList: DocumentsList[] = [];

  LSMandatoryDocumentsList: Observable<LSMandatoryDocumentsList[]>;

  CommentsList: CommentsList[] = [];

  displayedColumns: string[] = ['DocumentName', 'actions'];

  // ViewChild decorators to get references to the MatTable elements
  @ViewChild(MatTable) DocumentsTable: MatTable<DocumentsList> | undefined;
  documentsDataSource: MatTableDataSource<DocumentsList> = new MatTableDataSource<DocumentsList>();


  stringifiedData: any;
  CurrentUser: any;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  //Application Details
  applicationId: any;
  lsNumber: string;
  typeOfDev: string;

  typeOfAddress: string;
  noOfUnits: string;
  unitNumber: string;
  propertyValue: string;
  erfNumber: string;
  portionNumber: string;
  premisesName: string;
  propertyDescription: string;
  occupationClassification: string;
  buildingPlanFor: string;
  physicalAddress: string;
  latitude: string;
  longitude: string;
  sGCode: string;
  OmnibusServitude: boolean = false;
  functionalArea: string;
  currentStage: string;

  //Owner Details
  firstName: string;
  surname: string;
  cellNo: string;
  altCellNo: string;
  email: string;
  altEmail: string;
  address: string;
  idNumber: string;

  //Architect Detail
  architectName: string;
  architectSurname;
  architectId: string;
  architectReg: string;
  architectEmail: string;
  architectCell: string;

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  panelOpenState :boolean = false;
  ngOnInit(): void {

    this.refreshService.enableRefreshNavigation('/home');
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.applicationId = this.sharedService.getApplicationID();
    this.getApplicationInfo();
    this.GetAllCommentsForApplication();







  }

  openViewReply(index: any) {
    let viewReply = this.CommentsList[index].ViewReply;
    if (viewReply == false) {
      this.CommentsList[index].ViewReply = true;
    }
    else {
      this.CommentsList[index].ViewReply = false;
    }
    debugger;
    if (this.CommentsList[index].isApplicantReply !== null && this.CommentsList[index].SecondReply == null) {
      this.reply = this.CommentsList[index].isApplicantReply;
      this.hasReply = false;
    }
    
    else if (this.CommentsList[index].isApplicantReply != null && this.CommentsList[index].SecondReply != null) {
      this.reply = this.CommentsList[index].SecondReply;
      this.hasReply = true;
    }
  }
  initializeCurrentStage(): void {



  }
  sanitizeHTML(comment: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(comment);
  }

  async getApplicationInfo() {
    debugger;
    await this.bpService.getBuildingApplicationByApplicationID(this.applicationId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];

        this.lsNumber = current.lsNumber;
        this.typeOfDev = current.typeOfDevelopment;
        this.typeOfAddress = current.addressType;
        this.noOfUnits = current.noOfUnits;
        this.unitNumber = current.unitNumber;
        this.propertyValue = current.propertyValue;
        this.erfNumber = current.erfNumber;
        this.portionNumber = current.portionNumber;
        this.premisesName = current.premisesName;
        this.propertyDescription = current.propertyDescription;
        this.occupationClassification = current.occupationClassification;
        this.buildingPlanFor = current.buildingPlanFor;
        this.latitude = current.latitude;
        this.longitude = current.longitude;
        this.sGCode = current.sgCode;
        this.physicalAddress = current.physicalAddress;
        this.functionalArea = "Building Plan";
        this.currentStage = current.stage;
        this.OmnibusServitude = current.omnibusServitude;
        //owner details
        this.firstName = current.firstName;
        this.surname = current.surname;
        this.cellNo = current.cellNumber;
        this.altCellNo = current.altCellNumber;
        this.email = current.emailAddress;
        this.altEmail = current.altEmail;
        this.idNumber = current.idNumber;
      }
      else {
        alert(data.responseMessage);
      }
      this.getAllDocumentForApplication();
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }
  getAllDocumentForApplication() {
    debugger;
    this.bpDocumentUploadService.getAllDocumentsForApplication(this.applicationId).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];

          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.ApplicationId = current.applicationID;
          tempDocList.DescriptionForRepoDoc = current.description;
          tempDocList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempDocList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.DocumentList.push(tempDocList);
        }
        this.documentsDataSource.data = this.DocumentList;
        this.DocumentsTable?.renderRows();

      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
      this.loadBPDocumentsList();
    }, error => {
      console.log("Error: ", error);
    })

  }

  viewDocument(index: any) {

    // Make an HTTP GET request to fetch the document

    fetch(this.apiUrl + `bPDocumentUploads/GetDocument?filename=${this.DocumentList[index].DocumentName}`)

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
        link.download = this.DocumentList[index].DocumentName; // Set the downloaded file name
        link.click();
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }

  openActionCenter(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }




  loadBPDocumentsList() {
    debugger;
    this.getBPDocumentsList().subscribe(
      data => {
        console.log('Received data:', data);
        debugger;
        this.LSMandatoryDocuments.next(data);
      },
      error => {
        console.error('Error occurred:', error);
      }
    );
  }
  getBPDocumentsList(): Observable<LSMandatoryDocumentsList[]> {
    let stageType: string;

    if (this.currentStage === 'LS Relaxation - Unpaid') {
      stageType = 'Land Survey';
    } else if (this.currentStage === 'TP Relaxation - Unpaid') {
      stageType = 'Town Planning';
    } else {
      throw new Error('Unknown stage type');
    }

    /*    const existingDocument = this.LSMandatoryDocumentsList.find(doc =>
          this.DocumentsList.some(existingDoc => existingDoc.documentName === doc.mandatoryDocumentName)
        );*/


    return this.BPMandatoryStageDocumentService.getAllDocumentsForStage("Relaxation", stageType)
      .pipe(
        map((data: any) => {
          if (data.responseCode === 1) {
            const tempList: LSMandatoryDocumentsList[] = [];
            for (let i = 0; i < data.dateSet.length; i++) {
              const current = data.dateSet[i];

              // Get the document name to be checked after substring operation
              const currentDocumentName = current.documentName;

              // Check if currentDocumentName exists in this.DocumentsList after substring operation
              const documentExists = this.DocumentList.some(doc => {
                const subDocumentName = doc.DocumentName.substring(0, doc.DocumentName.indexOf('_'));
                return subDocumentName === currentDocumentName;
              });

              if (!documentExists) {
                const tempRequiredDocuments = {
                  mandatoryDocumentID: current.documentID,
                  mandatoryDocumentName: current.documentName,
                  stageID: null,
                  dateCreated: current.dateCreated,
                  mandatoryDocumentStageLinkID: 0,
                  stageName: '',
                  uploads: []
                };
                tempList.push(tempRequiredDocuments);
              }
            }
            console.log("THIS IS THE LIST OF DOCS FROM", stageType, tempList, this.LSMandatoryDocumentsList);
            return tempList;
          } else {
            throw new Error(data.responseMessage);
          }
        })
      );
  }

  displayedColumnsLSManDoc: string[] = ['mandatoryDocumentName', 'actions'];
  dataSourceLSManDoc = this.LSMandatoryDocuments;


  trackByFn(index, item) {
    return item.mandatoryDocumentID; // or any unique id from the object
  }
  totalDocs: number;
  totalDocs2: string;
  isLoading = false;
  public successfulUploads = 0;
  public successfulUploads2 = '';
  fileAttrs: string[] = [];
  onPassFileName(event: { uploadFor: string; fileName: string }, index: any) {

    const { uploadFor, fileName } = event;
    // const index = parseInt(uploadFor.substring('CoverLetter'.length));


    this.fileAttrs[index] = this.LSMandatoryDocumentsList[index].mandatoryDocumentName;

  }
  onFileDelete(event: any, index: number) {
    this.successfulUploads--;
    this.successfulUploads2 = Number(this.successfulUploads).toString();
    this.fileAttrs[index] = this.LSMandatoryDocumentsList[index].mandatoryDocumentName;


  }
  onFileUpload(event: any) {

    this.successfulUploads++;
    this.successfulUploads2 = Number(this.successfulUploads).toString();
    console.log("this.successfulUploads;this.successfulUploads", this.successfulUploads);
    this.getAllDocumentForApplication();
    this.DocumentsComponentComponent.getAllDocsForApplication();
  }

  reply: string;
  hasReply: boolean;

  GetAllCommentsForApplication() {
    debugger;
    this.CommentsList.splice(0, this.CommentsList.length);
    this.bpCommentsService.getAllCommentsForApplication(this.applicationId).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempComment = {} as CommentsList;
          debugger;
          tempComment.CommentID = current.commentID;
          tempComment.ApplicationID = current.applicationID;
          tempComment.FunctionalArea = current.functionalArea;
          tempComment.Comment = current.comment;
          tempComment.CommentStatus = current.commentStatus;
          tempComment.SubDepartmentForCommentID = current.subDepartmentForCommentID;
          tempComment.isApplicantReply = current.isApplicantReplay;
          tempComment.SecondReply = current.secondReply;
          tempComment.UserName = current.userName;
          tempComment.CanReplyUserID = current.canReplyUserID;
          tempComment.CreatedById = current.createdById;
          tempComment.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempComment.ViewReply = false;

         
          this.CommentsList.push(tempComment);
        }

        console.log("BPComments",this.CommentsList);
      }
      else {

      }

    }, error => {
      console.log(error);
    })
  }

  selectedComment: any;
  openEditReply(index: any, replyModal:any) {
    this.selectedComment = this.CommentsList[index];
    this.CommentsList[index].ViewReply = false;
    this.modalService.open(replyModal, { centered: true, size: 'l' });
    
  }

  SaveReply() {
    debugger;
    if (this.selectedComment.isApplicantReply == null) {
      this.bpCommentsService.addUpdateComment(this.selectedComment.CommentID, null, null, null, null, null, this.reply, null, null, null, null).subscribe((data: any) => {
        debugger;
        if (data.responseCode == 1) {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: "Reply successFully saved"
            }
          });
          this.GetAllCommentsForApplication();
          this.modalService.dismissAll();
        }
        else {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: data.responseMessage
            }
          });
        }
      }, error => {
        console.log(error);
      })
    }
    else {
      this.bpCommentsService.addUpdateComment(this.selectedComment.CommentID, null, null, null, null, null, null,this.reply,  null, null, null).subscribe((data: any) => {
        if (data.responseCode == 1) {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: "Reply Editted SuccessFully"
            }
          });
          this.GetAllCommentsForApplication();
          this.modalService.dismissAll();
        }
        else {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: data.responseMessage
            }
          });
        }
      }, error => {
        console.log(error);
      })
    }
  }
}

