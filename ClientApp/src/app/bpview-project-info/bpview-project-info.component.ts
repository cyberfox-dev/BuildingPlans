import { Component, OnInit, ViewChild,ChangeDetectorRef} from '@angular/core';
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
import { BpDepartmentForCommentService } from '../service/BPDepartmentForComment/bp-department-for-comment.service';
import { ConfigService } from '../service/Config/config.service';
import { BPStagesChecklistsService } from '../service/BPStagesChecklists/bpstages-checklists.service';
import { BPStagesService } from '../service/BPStages/bpstages.service';
import { BpTasksService } from '../service/BPTasks/bp-tasks.service';
export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  ApplicationId: number;
  DateCreated: any;
  DateUpdated: any;
  DescriptionForRepoDoc: string;
}
export interface StageChecklistItems {
  ChecklistItemId: number;
  ChecklistItem: string;
  StageID: number;
  FunctionalAreaID: number;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;

}
export interface StagesForApplication {
  StageID: number;
  StageName: string;
  StageNummber: number;
}

export interface BPDepartmentsForCommentList {
  DepartmendForCommentaID: any;
  UserAssaignedToComment: any;
  isAwaitingClarity: any;
  DepartmentID: number;
  DepartmentName: string;
  ApplicationId: number;
  DateCreated: any;
  DateUpdated: any;
  CommentStatus: string;
}

export interface Taskslist {
  TaskID: any;
  Task: any;
  isChecked: boolean;
  CheckedBy: number;
  TaskCreatedFor: string;
  ApplicationId: number;
  DateCreated: any;
  DateUpdated: any;
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
export interface InternalCommentsList {
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
export interface NotesList {
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
    ApplicationType: any;
    ExpandPropertyOwnerDetails: boolean;
    ExpandArchitectOwnerDetails: boolean;
    ExpandTrackerInfo: boolean;
    ExpandComments: boolean;
    AgentCellNo: any;
    AgentPostalAddress: any;
    DescriptionOfProject: any;
    NameOfAgent: any;
    NameOfCompany: any;
    RegNoOfCompany: any;
    isCombinedApplication: any;
    TitleDeedNo: any;
    ExtentOfProperty: any;
    TitleRestrictions: any;
    RegisteredDescription: any;
    bpApplicationType: any;
    ExpandDetails: boolean;

  constructor(
    private bpService: BuildingApplicationsService,
    private sharedService: SharedService,
    private refreshService: RefreshService,
    private router: Router,
    private bpStageChecklistService: BPStagesChecklistsService,
    private documentUploadService: DocumentUploadService,
    private bpDocumentUploadService: BPDocumentsUploadsService,
    private modalService: NgbModal,
    private BPManDocService: BPManDocService,
    private BPMandatoryStageDocumentService: BPMandatoryStageDocumentService,
    private DocumentsComponentComponent: DocumentsComponentComponent, private bpCommentsService: BPCommentsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private configService: ConfigService,
    private applicationService: BuildingApplicationsService,
    private BpDepartmentForCommentService: BpDepartmentForCommentService,
    private cdRef: ChangeDetectorRef,
    private BPStagesService: BPStagesService,
    private BpTasksService: BpTasksService,
  ) { }

  // Properties
  LSMandatoryDocuments = new BehaviorSubject<LSMandatoryDocumentsList[]>([]);

  /* LSMandatoryDocuments = new BehaviorSubject<LSMandatoryDocumentsList[]>([]);*/

  DocumentList: DocumentsList[] = [];
  BPDepartmentsForCommentList: BPDepartmentsForCommentList[] = [];
  Taskslist: Taskslist[] = [];

  LSMandatoryDocumentsList: Observable<LSMandatoryDocumentsList[]>;
  stageChecklist: StageChecklistItems[] = [];
  StagesForApplication: StagesForApplication[] = [];
  CommentsList: CommentsList[] = [];
  InternalCommentsList: InternalCommentsList[] = [];
  NotesList: NotesList[] = [];



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
  BPApplicationProjectNumber: string;
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
  currentStageNumber: number;
  ActionCenter: boolean = false;

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
  isLoading = true;

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';

  panelOpenState: boolean = false;
  async ngOnInit() {
    this.isLoading = true;

    this.refreshService.enableRefreshNavigation('/home');
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    if (this.CurrentUserProfile[0].isInternal == true) {
      this.ActionCenter = true;
    }

    this.applicationId = this.sharedService.getApplicationID();

    await Promise.all([
      this.getApplicationInfo(),
      this.GetAllCommentsForApplication(),
      this.getAllDepartmentsForCommentForBPApplication()
    ]);
    this.isLoading = false;

  }

  openViewReply(index: any) {
    let viewReply = this.CommentsList[index].ViewReply;
    if (viewReply == false) {
      this.CommentsList[index].ViewReply = true;
    }
    else {
      this.CommentsList[index].ViewReply = false;
    }

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
  showChecklist: boolean;
  getApplicationInfo() {

    this.bpService.getBuildingApplicationByApplicationID(this.applicationId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const current = data.dateSet[0];
        console.log("THIS IS APPLICATION DATATHIS IS APPLICATION DATATHIS IS APPLICATION DATATHIS IS APPLICATION DATATHIS IS APPLICATION DATA", data.dateSet[0]);
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
        this.functionalArea = current.bpApplicationType;
        this.currentStage = current.stage;
        this.currentStageNumber = Number(current.stageNumber);
        this.OmnibusServitude = current.omnibusServitude;
        //owner details
        this.firstName = current.firstName;
        this.surname = current.surname;
        this.cellNo = current.cellNumber;
        this.altCellNo = current.altCellNumber;
        this.email = current.emailAddress;
        this.altEmail = current.altEmail;
        this.idNumber = current.idNumber;
        this.architectName = current.architectName;
        this.BPApplicationProjectNumber = current.bpApplicationID;
        this.bpApplicationType = current.bpApplicationType;
        this.AgentCellNo = current.agentCellNo;
        this.AgentPostalAddress = current.agentPostalAddress;
        this.DescriptionOfProject = current.descriptionOfProject;
        this.NameOfAgent = current.nameOfAgent;
        this.NameOfCompany = current.nameOfCompany;
        this.RegNoOfCompany = current.regNoOfCompany;
        this.isCombinedApplication = current.isCombinedApplication;
        this.DescriptionOfProject = current.DescriptionOfProject;
        this.ApplicationType = current.ApplicationType;
        this.TitleDeedNo = current.TitleDeedNo;
        this.ExtentOfProperty = current.ExtentOfProperty;
        this.TitleRestrictions = current.TitleRestrictions;
        this.RegisteredDescription = current.RegisteredDescription;
       
        this.showChecklist = true;
        this.updateCenter(parseFloat(this.latitude), parseFloat(this.longitude));
      }
      else {
        alert(data.responseMessage);
      }
      this.getAllDocumentForApplication();
      this.getAllMandatoryChecklistItemsForCurrentStage();
      this.getAllBPStages();
      console.log("responseKyle", data);
    }, error => {
      console.log("Error: ", error);
    })
  }
  getAllDocumentForApplication() {

    this.bpDocumentUploadService.getAllDocumentsForApplication(this.applicationId).subscribe((data: any) => {

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


  currentStep = 0;
  steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  loadBPDocumentsList() {

    this.getBPDocumentsList().subscribe(
      data => {
        console.log('Received data:', data);

        this.LSMandatoryDocuments.next(data);
      },
      error => {
        console.error('Error occurred:', error);
      }
    );
  }
  getBPDocumentsList(): Observable<LSMandatoryDocumentsList[]> {

    return this.BPMandatoryStageDocumentService.getAllDocumentsForStage("Relaxation", this.currentStage)
      .pipe(
        map((data: any) => {
          if (data.responseCode === 1) {
            const tempList: LSMandatoryDocumentsList[] = [];
            for (let i = 0; i < data.dateSet.length; i++) {
              const current = data.dateSet[i];
              debugger;
              // Get the document name to be checked after substring operation
              const currentDocumentName = current.documentName;
              debugger;
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
            console.log("THIS IS THE LIST OF DOCS FROM", tempList, this.LSMandatoryDocumentsList);
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
  generateBPApplicationID() {

    this.configService.getConfigsByConfigName("BPApplicationIDTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.configNumberOfProject = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {
            this.applicationService.addUpdateBuildingApplication(this.applicationId, null, null, null, null,
              null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null,
              null, null, null, null, null, null, "Distribution", "BCO Distribution", 3, null, "BP:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, null, null, null, null, null, null, null, null, null, null, null).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  this.modalService.dismissAll();
                  this.router.navigate(["/home"]);
                }
                else {
                  alert(data.responseMessage)
                }
              }, error => {
                console.log("BuildingApplicationError: ", error)
              })
          }
          else {

            alert(data.responseMessage);
          }
          console.log("addUpdateConfigReponse", data);

        }, error => {
          console.log("addUpdateConfigError: ", error);
        })

      }
      else {
        alert(data.responseMessage);
      }
      console.log("getConfigsByConfigNameReponse", data);

    }, error => {
      console.log("getConfigsByConfigNameError: ", error);
    })

  }
  reply: string;
  hasReply: boolean;

  GetAllCommentsForApplication() {

    this.CommentsList.splice(0, this.CommentsList.length);
    this.bpCommentsService.getAllCommentsForApplication(this.applicationId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempComment = {} as CommentsList;

          tempComment.CommentID = current.commentID;
          tempComment.ApplicationID = current.applicationID;
          tempComment.FunctionalArea = current.functionalArea;
          tempComment.Comment = current.comment;
          tempComment.CommentStatus = current.commentStatus;
          tempComment.SubDepartmentForCommentID = current.BPDepartmentForCommentID;
          tempComment.isApplicantReply = current.isApplicantReplay;
          tempComment.SecondReply = current.secondReply;
          tempComment.UserName = current.userName;
          tempComment.CanReplyUserID = current.canReplyUserID;
          tempComment.CreatedById = current.createdById;
          tempComment.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempComment.ViewReply = false;


          this.CommentsList.push(tempComment);
        }

        console.log("BPComments", this.CommentsList);
        this.GetAllInternalCommentsForApplication();
      }
      else {

      }

    }, error => {
      console.log(error);
    })
  }

  GetAllInternalCommentsForApplication() {

    this.InternalCommentsList.splice(0, this.InternalCommentsList.length);
    this.bpCommentsService.getAllCommentsForApplication(this.applicationId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempComment = {} as InternalCommentsList;

          tempComment.CommentID = current.commentID;
          tempComment.ApplicationID = current.applicationID;
          tempComment.FunctionalArea = current.functionalArea;
          tempComment.Comment = current.comment;
          tempComment.CommentStatus = current.commentStatus;
          tempComment.SubDepartmentForCommentID = current.BPDepartmentForCommentID;
          tempComment.isApplicantReply = current.isApplicantReplay;
          tempComment.SecondReply = current.secondReply;
          tempComment.UserName = current.userName;
          tempComment.CanReplyUserID = current.canReplyUserID;
          tempComment.CreatedById = current.createdById;
          tempComment.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempComment.ViewReply = false;


          this.InternalCommentsList.push(tempComment);
        }

        console.log("InternalCommentsList", this.InternalCommentsList);
        this.GetNotesForApplication();
      }
      else {

      }

    }, error => {
      console.log(error);
    })
  }
  GetNotesForApplication() {

    this.NotesList.splice(0, this.NotesList.length);
    this.bpCommentsService.getAllCommentsForApplication(this.applicationId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempComment = {} as NotesList;

          tempComment.CommentID = current.commentID;
          tempComment.ApplicationID = current.applicationID;
          tempComment.FunctionalArea = current.functionalArea;
          tempComment.Comment = current.comment;
          tempComment.CommentStatus = current.commentStatus;
          tempComment.SubDepartmentForCommentID = current.BPDepartmentForCommentID;
          tempComment.isApplicantReply = current.isApplicantReplay;
          tempComment.SecondReply = current.secondReply;
          tempComment.UserName = current.userName;
          tempComment.CanReplyUserID = current.canReplyUserID;
          tempComment.CreatedById = current.createdById;
          tempComment.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempComment.ViewReply = false;


          this.NotesList.push(tempComment);
        }

        console.log("BPComments", this.NotesList);
      }
      else {

      }

    }, error => {
      console.log(error);
    })
  }

  selectedComment: any;
  openEditReply(index: any, replyModal: any) {
    this.selectedComment = this.CommentsList[index];
    this.CommentsList[index].ViewReply = false;
    this.modalService.open(replyModal, { centered: true, size: 'l' });

  }

  SaveReply() {

    if (this.selectedComment.isApplicantReply == null) {
      this.bpCommentsService.addUpdateComment(this.selectedComment.CommentID, null, null, null, null, null, this.reply, null, null, null, null).subscribe((data: any) => {

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
      if (this.currentStage == "TP Review") {
        this.applicationService.addUpdateBuildingApplication(this.applicationId, null, null, null, null,
          null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null,
          null, null, null, null, null, null, "Clarified", null, 2, null, null, null, null, null, null, null, null, null, null, null, null, null).subscribe((data: any) => {
            if (data.responseCode == 1) {

            }
            else {

            }
          }, error => {
            console.log(error);
          })
      }
    }
    else {
      this.bpCommentsService.addUpdateComment(this.selectedComment.CommentID, null, null, null, null, null, null, this.reply, null, null, null).subscribe((data: any) => {
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
  displayedColumns: string[] = ['DepartmentName', 'indication'];
  dataSource = this.BPDepartmentsForCommentList;

  displayedColumnsTasks: string[] = ['Tasks', 'Checked'];
  dataSourceTasks = this.Taskslist;

  @ViewChild(MatTable) BPDepartmentsForCommentListTable: MatTable<BPDepartmentsForCommentList> | undefined;
  
  getAllDepartmentsForCommentForBPApplication() {
    this.BpDepartmentForCommentService.getDepartmentForComment(this.applicationId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDepForComment = {} as BPDepartmentsForCommentList;

          tempDepForComment.DepartmendForCommentaID = current.bpDepartmentForCommentID;
          tempDepForComment.ApplicationId = current.applicationID;
          tempDepForComment.DepartmentID = current.departmentID;
          tempDepForComment.DepartmentName = current.departmentName;
          tempDepForComment.CommentStatus = current.commentStatus;
          tempDepForComment.DateCreated = current.dateCreated;
          tempDepForComment.isAwaitingClarity = current.isAwaitingClarity;
          tempDepForComment.UserAssaignedToComment = current.userAssaignedToComment;

          this.BPDepartmentsForCommentList.push(tempDepForComment);
        }

        console.log("BPDepartmentsForCommentList", this.BPDepartmentsForCommentList);

      }
      else {

      }

    }, error => {
      console.log(error);
    })
  }
  configNumberOfProject: any;
  configMonthYear: any;
  /*  generateBPApplicationID() {
  
      this.configService.getConfigsByConfigName("BPApplicationIDTracker").subscribe((data: any) => {
        if (data.responseCode == 1) {
  
          const current = data.dateSet[0];
          this.configNumberOfProject = current.utilitySlot1;
          this.configMonthYear = current.utilitySlot2;
          this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
            if (data.responseCode == 1) {
              this.applicationService.addUpdateBuildingApplication(this.applicationId, null, null, null, null,
                null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null,
                null, null, null, null, null, null, "Distribution", "BCO Distribution", 3, null, "BP:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, null, null, null, null, null, null, null, null, null, null, null).subscribe((data: any) => {
                  if (data.responseCode == 1) {
                    this.modalService.dismissAll();
                    this.openSnackBar("Application Actioned");
                    this.router.navigate(["/home"]);
                  }
                  else {
                    alert(data.responseMessage)
                  }
                }, error => {
                  console.log("BuildingApplicationError: ", error)
                })
            }
            else {
  
              alert(data.responseMessage);
            }
            console.log("addUpdateConfigReponse", data);
  
          }, error => {
            console.log("addUpdateConfigError: ", error);
          })
  
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getConfigsByConfigNameReponse", data);
  
      }, error => {
        console.log("getConfigsByConfigNameError: ", error);
      })
  
    }*/
  showMap: boolean = false;
  Markers: any = [];
 
  zoom = 18;
  locationName: any;
  center: google.maps.LatLngLiteral = {
    lat: -29.6168,
    lng:30.3928
  }
  mapOptions = {
    center: this.center,
    zoom: this.zoom,
    mapTypeControl: true,
    zoomControl: true,
    scrollwheel: false,
    mapTypeId: 'satellite',
    styles: [
      {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#1b1b1b" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
      }
    ]
  };
  mapOptionsView = {
    center: this.center,
    zoom: this.zoom,
    mapTypeControl: false,
    zoomControl: false,
    scrollwheel: false,
    mapTypeId: 'satellite',
    styles: [
      {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#1b1b1b" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
      }
    ]
  };
  async updateCenter(newLat: number, newLng: number) {
    debugger;
    this.center = {
      lat: newLat,
      lng: newLng
    };
    // Trigger change detection if needed
    const position = {
      lat: newLat,
      lng: newLng,
    };

    this.locationName = await this.getLocationName(position);
    const newMarker = new google.maps.Marker({
      position,
      animation: google.maps.Animation.BOUNCE,
      title: this.locationName, // Set the marker's title to the location name
      draggable: false,
      clickable: false
    });


    debugger;
    this.Markers.push(newMarker);
    this.cdRef.detectChanges();
    this.showMap = true;
  }
  getLocationName(latLng: google.maps.LatLngLiteral): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: latLng }, (results, status) => {

        if (status === google.maps.GeocoderStatus.OK) {

          if (results[0]) {

            const locationName = results[0].formatted_address;
            resolve(locationName);

          } else {
            resolve(null); // No results found
          }
        } else {
          reject(status);
        }
      });
    });
  }

  ExpandDocuments:boolean =  false;
  openExpand(cardName: any, expand: any) {
    debugger;
    if (cardName == 'POD') {
      this.ExpandPropertyOwnerDetails = true;
      this.modalService.open(expand, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
    else if (cardName == 'AD') {
      this.ExpandArchitectOwnerDetails = true;
      this.modalService.open(expand, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
    else if (cardName == 'Tracker') {
      this.ExpandTrackerInfo = true;
      this.modalService.open(expand, {
        centered: true,
        size: 'xl',
        backdrop: 'static',
        keyboard: false, // Prevent pressing the ESC key to close the modal
        windowClass: 'custom-modal-size',
      });
    }
    else if (cardName == 'Comments') {
      this.ExpandComments = true;
      this.modalService.open(expand, {
        centered: true,
        size: 'xl',
        backdrop: 'static',
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
    else if (cardName == 'Documents') {
      this.ExpandDocuments = true;
      this.modalService.open(expand, {
        centered: true,
        size: 'xl',
        backdrop: 'static',
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
    else if (cardName == 'ExpandDetails') {
      this.ExpandDetails = true;
      this.modalService.open(expand, {
        centered: true,
        size: 'xl',
        backdrop: 'static',
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
  }
  closeExpanded(){
    this.ExpandPropertyOwnerDetails = false;
    this.ExpandComments = false;
    this.ExpandDocuments = false;
    this.ExpandDetails = false;
    this.ExpandTrackerInfo = false;
    this.ExpandArchitectOwnerDetails = false;
  }
  leaveAComment: string;
  saveNewInternalComment() {
    this.bpCommentsService.addUpdateComment(0, this.applicationId, this.functionalArea, this.leaveAComment, "Internal Comment", this.CurrentUserProfile[0].subDepartmentID, null, null, this.CurrentUser.fullName, this.CurrentUserProfile[0].userID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.modalService.dismissAll();

     
      }
      else {
        const dialogRef = this.dialog.open(BpAlertModalComponent, {
          data: {
            message: "An Error has occured"
          }
        });
      }
    })
  }
  saveNewNote() {
    this.bpCommentsService.addUpdateComment(0, this.applicationId, this.functionalArea, this.leaveAComment, "Note", this.CurrentUserProfile[0].subDepartmentID, null, null, this.CurrentUser.fullName, this.CurrentUserProfile[0].userID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.modalService.dismissAll();


      }
      else {
        const dialogRef = this.dialog.open(BpAlertModalComponent, {
          data: {
            message: "An Error has occured"
          }
        });
      }
    })
  }

  saveNewClarify() {
    this.bpCommentsService.addUpdateComment(0, this.applicationId, this.functionalArea, this.leaveAComment, "Clarify", this.CurrentUserProfile[0].subDepartmentID, null, null, this.CurrentUser.fullName, null, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.GetAllCommentsForApplication();
        this.modalService.dismissAll();

        
      }
      else {
        const dialogRef = this.dialog.open(BpAlertModalComponent, {
          data: {
            message: "An Error has occured"
          }
        });
      }
    })
  }
  openInternalComment(newInternalComment: any) {
    this.modalService.open(newInternalComment, { centered: true, size: 'xl' });
  }

  openNote(newNote: any) {
    this.modalService.open(newNote, { centered: true, size: 'xl' });
  }
  openClarify(newClarify: any) {
    this.modalService.open(newClarify, { centered: true, size: 'xl' });
  }
  getAllMandatoryChecklistItemsForCurrentStage() {
    debugger;
    this.bpStageChecklistService.getAllChecklistItemsForStage(this.currentStage, this.bpApplicationType).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempChecklist = {} as StageChecklistItems;
          const current = data.dateSet[i];
          debugger;
          tempChecklist.ChecklistItemId = current.checkListItemID;
          tempChecklist.ChecklistItem = current.checklistItem;
          tempChecklist.CreatedById = current.createdById;
          tempChecklist.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempChecklist.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempChecklist.FunctionalAreaID = current.functionalAreaID;
          tempChecklist.StageID = current.stageID;

          this.stageChecklist.push(tempChecklist);
        }
        console.log("This is the checklist for this stage.", this.stageChecklist);
        this.getAllBPTasks();
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);

    })
  }
  totalStages: number = 0;
  getAllBPStages() {

    this.StagesForApplication.splice(0, this.StagesForApplication.length);
    debugger;
    if (this.BPApplicationProjectNumber != null) {
      this.BPStagesService.getAllStagesForFunctionalArea("Building Plan").subscribe((data: any) => {
        if (data.responseCode == 1) {
          debugger;
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const tempStage = {} as StagesForApplication;
            debugger;
            tempStage.StageID = current.stageID;
            tempStage.StageName = current.stageName;
            tempStage.StageNummber = current.stageOrder;

            this.StagesForApplication.push(tempStage);


          }
          this.totalStages = this.StagesForApplication.length;
          console.log("SKJFSKDJFHJKSDF", this.StagesForApplication);

        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);

      })
    }
    else {
      this.BPStagesService.getAllStagesForFunctionalArea(this.functionalArea).subscribe((data: any) => {
        if (data.responseCode == 1) {
          debugger;
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const tempStage = {} as StagesForApplication;
            debugger;
            tempStage.StageID = current.stageID;
            tempStage.StageName = current.stageName;
            tempStage.StageNummber = current.stageOrder;

            this.StagesForApplication.push(tempStage);
            

          }
          this.totalStages = this.StagesForApplication.length;
          console.log("SKJFSKDJFHJKSDF", this.StagesForApplication);

        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);

      })
    }
    
  }


  @ViewChild(MatTable) TaskListTable: MatTable<Taskslist> | undefined;
  getAllBPTasks() {
    debugger;
      this.BpTasksService.getTasksForApplication(this.applicationId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          debugger;
          console.log("This is the tasks list", data.dateSet);
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const tempStage = {} as Taskslist;
            debugger;
            tempStage.TaskID = current.taskID;
            tempStage.Task = current.taskName;
            tempStage.CheckedBy = current.checkedBy;
            this.Taskslist.push(tempStage);
          }
          this.dataSourceTasks = this.Taskslist;
          this.TaskListTable?.renderRows();
          console.log("SKJFSKDJFHJKSDF", this.Taskslist);

        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);

      })
  }



}

