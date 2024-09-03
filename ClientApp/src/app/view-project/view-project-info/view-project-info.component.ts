import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from "src/app/shared/shared.service";
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { StagesService } from '../../service/Stages/stages.service';
import { ApplicationsService } from '../../service/Applications/applications.service';
import { CommentsService } from '../../service/Comments/comments.service';
import { DepositRequiredService } from 'src/app/service/DepositRequired/deposit-required.service';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { ConfigService } from 'src/app/service/Config/config.service'; 
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { SubDepartmentsService } from 'src/app/service/SubDepartments/sub-departments.service';
import { AccessGroupsService } from '../../service/AccessGroups/access-groups.service';
import { BusinessPartnerService } from '../../service/BusinessPartner/business-partner.service';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FinancialService } from '../../service/Financial/financial.service';
import { PermitService } from '../../service/Permit/permit.service';
import { MobileFieldTrackingService } from 'src/app/service/MFT/mobile-field-tracking.service';
import { FileUploadComponent } from 'src/app/file-upload/file-upload.component';
import { ServiceItemService } from 'src/app/service/ServiceItems/service-item.service';
import { ContactDetailsService } from 'src/app/service/ContactDetails/contact-details.service';
import { NotificationsService } from 'src/app/service/Notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ApprovalPackComponent } from 'src/app/Packs//ApprovalPackComponent/approval-pack.component';
import { StatusOfWorksComponent } from 'src/app/status-of-works/status-of-works.component';
import { MandatoryDocumentUploadService } from 'src/app/service/MandatoryDocumentUpload/mandatory-document-upload.service';
import { SnackBarAlertsComponent } from '../../snack-bar-alerts/snack-bar-alerts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
/*import { PdfGenerationService } from 'src/app/service/PDFGeneration/pdf-generation.service';*/

import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ReviewerforcommentService } from '../../service/ReviewerForComment/reviewerforcomment.service';
import { Subscription } from 'rxjs';

//Audit Trail Kyle
import { AuditTrailService } from '../../service/AuditTrail/audit-trail.service';
//Audit Trail Kyle

import { DepartmentsService } from '../../service/Departments/departments.service'; //zxNumberUpdate Sindiswa 01 March 2024
import { ZXNumberService } from '../../service/ZXNumber/zxnumber.service';
import { BpDepartmentsService } from '../../service/BPDepartments/bp-departments.service';
export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}
export interface MFTList {
  MFTID: number;
  MFTNote: string;
  DocumentName: string;
  DocumentLocalPath: string;
  DateCreated: Date;
  ApplicationNumber: number;
  FullName: string;
  DocURL: any;
}

export interface SubDepartmentListFORAPPROVAL {
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

export interface ARCGISAPIData {
  createdByID: string;
  isActive: string;
  applicationID: string;
}

export interface PeriodicElement {
  name: string;
}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
}

export interface SubDepConditionalApproveList {
  SubDepForCommentID: number;
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
  UserName: string;
}
export interface SubDepSubDepRejectList {
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
}

export interface SubDepFinalApproveList {
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
  UserName: string;
}
export interface SubDepCommentsForSpecialConditions {
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
  UserName: string;
}

export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
}

export interface FinancialDocumentsList {
  FinancialID: number;
  FinancialDocumentName: string;
  FinancialName: string;
  FinancialType: string;
  FinancialDocumentLocalPath: string;
  ApplicationID: number;
  CreatedById: string;
}

export interface CommentsList {
  CommentID: number;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  SubDepartmentForCommentID: number;
  SubDepartmentName?: string;
  isClarifyCommentID?: number;
  isApplicantReplay?: string; 
  UserName: string;
   //Comments Kyle 01/02/24
  ZoneName: string;
   //Comments Kyle 01/02/24
   //Clarifications Alert
  CanReplyUserID: string;
  DateCreated: any;
  HasReply: boolean;
  Time: string;
  ViewReply: any;
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
  //CreatedById: number,
  CreatedById: any,
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
  DatePaid: Date;
  wbsrequired: boolean;
  Coordinates: string;
  UserID: any;
  clientAlternativeEmail: string; // chekingNotifications Sindiswa 13 February 2024
  //reapplyCount: number, // reapply Sindiswa 25 January 2024
  ContractorAccountDetails: string; //zxNumberUpdate Sindiswa 01 March 2024
}



const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Proof of payment' },
  { name: 'Invoice' },
  { name: 'deposit DS456' },
];

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
}

export interface ContactDetailsList {
  ContactDetailID: number;
  FullName: string;
  CellNo: string;
  Email: string;
  SubDepID: number;
  SubDepName: string;
  ZoneID: number;
  ZoneName: string;
}



export interface DepositRequired {
  DepositRequiredID: number;
  ApplicationID: number;
  Desciption: string;
  SubDepartmentID: number;
  SubDepartmentForCommentID: number;
  Rate: any;
  Quantity: any;
  ServiceItemCodeserviceItemCode?: string | null;
  SubDepartmentName?: string | null;
  WBS?: string;
}


export interface AllSubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
  GLCode: string | null;
  ProfitCenter: string | null;
}
   //Project size Kyle 27-02-24
export interface MandatoryDocumentUploadList {
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  dateCreated: any;
  mandatoryDocumentCategory: string;
  hasFile: boolean;
}

//#region zxNumberUpdate Sindiswa 01 March 2024
export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
  hasSubDepartment: boolean;
  needsZXNumber: boolean;
  canInputZXNumber?: boolean; //Is the logged-in user permitted to input ZX number?
  zxNumber?: string; //Each department that requires a ZX number should be able to input it well.
}

//#endregion
var img = new Image();
img.src = 'assets/cctlogoblackk.png';

interface jsPDFWithPlugin extends jsPDF {
  autotable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-view-project-info',
  templateUrl: './view-project-info.component.html',
  styleUrls: ['./view-project-info.component.css'],

})



export class ViewProjectInfoComponent implements OnInit {

  minDate: string;

  public addWBSNumber = this.formBuilder.group({
    wbsnumber: ['', Validators.required],


  })

  //Initialize the interface for ARCGIS
  ARCGISAPIData = {} as ARCGISAPIData;
  auditTrail: boolean = false;
  public isInternalUser: boolean = false;
  public EMB: boolean = false;
  canReapply = false;
  public projectNo = "";
  createdByID: any | undefined;

 

  rejected: boolean = false;
  approved: boolean = false;


  uploadingPOP: boolean = false;
  uploadedPOP: boolean = false;

 
  

  permitDate = '';



  option: any;

  
  logoUrl: any;
 
  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');


  applicationDataForView: ApplicationList[] = [];
  StagesList: StagesList[] = [];
  CommentsList: CommentsList[] = [];
  SubDepConditionalApproveList: SubDepConditionalApproveList[] = [];
  SubDepCommentsForSpecialConditions: SubDepCommentsForSpecialConditions[] = [];
  SubDepFinalApproveList: SubDepFinalApproveList[] = [];
  SubDepSubDepRejectList: SubDepSubDepRejectList[] = [];
  RolesList: RolesList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentsList: SubDepartmentList[] = [];

  CurrentApplicationBeingViewed: ApplicationList[] = [];
  DepositRequired: DepositRequired[] = [];
  relatedApplications: ApplicationList[] = [];
  MFTList: MFTList[] = [];
  ContactDetailsList: ContactDetailsList[] = [];

  DocumentsList: DocumentsList[] = [];
  FinancialDocumentsList: FinancialDocumentsList[] = [];

  ServiceItemList: ServiceItemList[] = [];
  AllSubDepartmentList: AllSubDepartmentList[] = [];
  SubDepartmentListFORAPPROVAL: SubDepartmentListFORAPPROVAL[] = [];
  MandatoryDocumentUploadList: MandatoryDocumentUploadList[] = [];

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  ApplicationID: number | undefined;

 
  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
 
  //reply = ''
  /* @ViewChild('fileInput') fileInput: ElementRef | undefined;*/
  fileAttr = 'Choose File';
  //commentEdit: any;
 
 

  SuccessfulUploads: number = 0;
 //Audit Trail Kyle
  stringifiedDataRoles: any;
  AllCurrentUserRoles: any;
  //Audit Trail Kyle



  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });
      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          let imgBase64Path = e.target.result;
          //  console.log("e.target.result", e.target.result); 
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again

    } else {
      this.fileAttr = 'Choose File';
    } 
  }

  openDocUpload(newSub: any) {
    this.modalService.open(newSub, { backdrop: 'static', centered: true, size: 'lg' });
  }
  //  Financial POP Kyle 15/01/24
  OnPOPUpload() {
    this.uploadingPOP = true;
    
  }
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 2 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }
  isDeposit: boolean = false;
  fileAttrsName: any;
  fileAttrs; any;
  onUploadDepositPOP() {
    this.fileAttrsName = "Deposit Proof Of Payment";
    this.fileAttrs = "Deposit Proof Of Payment";
    this.isDeposit = true; 
  }
   //  Financial POP Kyle 15/01/24
  isFinancial = true;

  public editMyComment = this.formBuilder.group({
    commentEdit: ['', Validators.required],
  })
  public editMyReply = this.formBuilder.group({
    editCommentName: ['', Validators.required],
  })
  public myNewReply = this.formBuilder.group({
    reply: ['', Validators.required],
  })

  


  @ViewChild(MatTable) FinancialListTable: MatTable<DocumentsList> | undefined;
  
 
  displayedColumns: string[] = ['DepartmentName', 'indication'];
  dataSourceDoc = this.FinancialDocumentsList;
  
  dataSource: any;
  panelOpenState = false;

  fileCount = 0;
  ApprovalDoqnload = true;
  generateApprovalbtn = false;

 

  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private userPofileService: UserProfileService,
    private stagesService: StagesService,
    private applicationsService: ApplicationsService,
    private commentsService: CommentsService,
    private depositRequiredService: DepositRequiredService,
    private NewWayleaveComponent: NewWayleaveComponent,
    private viewContainerRef: ViewContainerRef,
    private configService: ConfigService,
    private accessGroupsService: AccessGroupsService,
    private formBuilder: FormBuilder,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private router: Router,
    private subDepartmentService: SubDepartmentsService,
    private businessPartnerService: BusinessPartnerService,
    private documentUploadService: DocumentUploadService,
    private http: HttpClient,
/*    private PdfGenerationService: PdfGenerationService,*/
    private financial: FinancialService,
    private permitService: PermitService,
    private MFTService: MobileFieldTrackingService,
    private fileUploadComponent: FileUploadComponent,
    private serviceItemService: ServiceItemService,
    private contactDetails: ContactDetailsService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private approvalPack: ApprovalPackComponent,
    private reviwerforCommentService: ReviewerforcommentService,
   
    //Audit Trail Kyle
    private auditTrailService: AuditTrailService,
    private statusOfWorksComponent: StatusOfWorksComponent,
    private mandatroyDocumentUploadService: MandatoryDocumentUploadService,
    private _snackBar: MatSnackBar,
    private bpDepartmentsService: BpDepartmentsService,
    //Audit Trail Kyle
    /*zxNumberUpdate Sindiswa 01 March 2024*/private departmentService: DepartmentsService,
    /*zxNumberUpdate Sindiswa 01 March 2024*/private zxNumberService: ZXNumberService,
  ) { }

  routerSubscription: Subscription; //reapply Sindiswa 26 January 2024

  applicationData: any;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;
  loggedInUsersSubDepartmentID: any;
  currentApplication: any;
  reply = '';
  isWayleave: boolean;

  ngOnInit(): void {

    

    this.applicationData = this.sharedService.getViewApplicationIndex();
    console.log("venApplicationData:", this.applicationData);
    
    

    if (this.CurrentUser == null) {
      console.log("Current User Error");
    }
    else {
      console.log(this.CurrentUser);
    }
    
    this.isWayleave = true;
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);
    
   
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    console.log("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", this.applicationDataForView[0]);
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    
    
    // #region icasaDetailsDisplay Sindiswa 16 January 2024, when the logged in user is external the "Applicant" details show funny | USERID??
    console.log("This is the current user's details --- 280200224", this.CurrentUserProfile);


    // #endregion icasaDetailsDisplay Sindiswa 16 January 2024
    //Audit Trail Kyle
    this.stringifiedDataRoles = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedDataRoles);
    console.log("This is the current user's roles --- 280200224", this.AllCurrentUserRoles);
    
  
    
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14); // Add 14 days to the current date
    
    this.minDate = twoWeeksFromNow.toISOString().split('T')[0];


    //#region reapply Sindiswa 26 January 2024
    
/*JJS Commit 29-02-24(removed full-screen mode for maps and sorted approval pack btn and former wayleave tab)*/
  
    this.routerSubscription = this.sharedService.getRoutingToOldAapp();
    // #endregion
    const setValues = this.applicationDataForView[0];
 
    if (setValues != null || setValues != undefined) {

      this.ApplicationID = setValues.applicationID;
    }
    else {

      this.router.navigate(["/home"]);
    }
    
   

    
    
    

    this.currentApplication = this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    console.log("this is the created by ID", setValues);
    this.createdByID = setValues.CreatedById;
  
    


    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    
    //Assigns the below values to the variable that will be passed to the map component.
    this.ARCGISAPIData.createdByID = this.CurrentUser.appUserId;
    this.ARCGISAPIData.isActive = "1";
    /*    this.ARCGISAPIData.applicationID = this.notificationNumber;*/
 
    //this.getAllDocsForApplication();

    //this.getUserProfileByUserID(); //comment this out later and add this.checkIfProxyApplication();
    
    /*    this.getAllSubDepForReject();*/
    this.canReapply = this.sharedService.getCanReapply();
    console.log("canReapplyVen: ", this.canReapply);
    this.getAllComments();
    this.getAllDocuments();
    this.getAllFinancials();
    this.getAllSubDepartmentForComments();
    this.getCurrentApplicationInfo();
    //#endregion
  }
  // #region reapply Sindiswa 26 January 2024
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    //this.sharedService.setShowFormerApps(true);
    //this.sharedService.setFromReApplyArchive(false);
  }
  // #endregion
  
  selectedComment: any;
  openEditReply(index: any, replyModal: any) {
    this.selectedComment = this.CommentsList[index];
    this.CommentsList[index].ViewReply = false;
    this.modalService.open(replyModal, { centered: true, size: 'l' });

  }
  getAllComments() {
    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i ++ ) {
          const current = data.dateSet[i];
          const tempComment = {} as CommentsList;

          tempComment.CommentID = current.commentID;
          tempComment.CommentStatus = current.commentStatus;
          tempComment.Comment = current.comment;
          tempComment.SubDepartmentName = current.subDepartmentName;
          tempComment.CanReplyUserID = current.canReplyUserID;
          tempComment.isApplicantReplay = current.isApplicantReply;
          tempComment.UserName = current.userName;
          if (tempComment.isApplicantReplay != null) {
            tempComment.HasReply = true;
          }
          else {
            tempComment.HasReply = false;
          }
          tempComment.SubDepartmentForCommentID = current.subDepartmentForCommentID;

          this.CommentsList.push(tempComment);
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Comments Error", error);
    })
  }
  description: string;
  typeOfApplication: string;
  typeOFWorks: string;
  typeOfExcavation: string;
  expectedStartDate: any;
  expectedEndDate: any;
  physicalAddress: any;
  coordinates: any;
  userID: string;
  applicantName: string;
  applicantCell: string;
  applicantEmail: string;
  contractorName: string;
  contractorCell: string;
  contractorEmail: string;
  EngineerName: string;
  EngineerCell: string;
  EngineerEmail: string;
  Coordinates: any;
  natureOfWork: string;
  projectNumber: string;
  getCurrentApplicationInfo(){
    this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const current = data.dateSet[0];
        this.description = current.descriptionOfProject;
        this.applicantName = current.fullName;
        this.Coordinates = current.coordinates;
        this.physicalAddress = current.physicalAddressOfProject;
        this.applicantEmail = current.email;
        this.applicantCell = current.phoneNumber;
        this.coordinates = current.coordinates;
        this.typeOfApplication = current.typeOfApplication;
        this.userID = current.userID;
        this.typeOfExcavation = current.excavationType;
        this.natureOfWork = current.natureOfWork;
        debugger;
        if (current.projectNumber == null || current.projectNumber == '') {
          this.projectNumber = this.ApplicationID.toString();
        }
        else {
          this.projectNumber = current.projectNumber;
;
        }
        this.expectedStartDate = current.expectedStartDate.substring(0, current.expectedStartDate.indexOf("T"));
        this.expectedEndDate = current.expectedEndDate.substring(0, current.expectedEndDate.indexOf("T"));
      }

      else {
       
      }
    }, error => {
      console.log("Error", error);
    })
  }

  getCurrentApplication(): any {
    this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        return data.dateSet[0];
      }
      else {
        return null;
      }

    }, error => {
      console.log("Error", error);
    })
    return this.CurrentApplicationBeingViewed[0];
  }
  openViewReply(index: any) {

  }
  SaveReply() {

  }

  getEngineerAndContractorInfo() {
    
  }

  getAllDocuments() {
    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDoc = {} as DocumentsList;

          tempDoc.DocumentID = current.documentID;
          tempDoc.DocumentName = current.documentName;
          tempDoc.DocumentLocalPath = current.documentLocalPath;

          this.DocumentsList.push(tempDoc);
        }
      }
      else {

      }
    }, error => {
      console.log("DocumentsList Error", error);
    })
  }

  getAllFinancials() {
    this.financial.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDoc = {} as FinancialDocumentsList;

          tempDoc.FinancialID = current.financialID;
          tempDoc.FinancialType = current.financialType;
          tempDoc.FinancialName = current.financialName;
          tempDoc.FinancialDocumentName = current.documentName;
          tempDoc.FinancialDocumentLocalPath = current.documentLocalPath;

          this.FinancialDocumentsList.push(tempDoc);
        }
      }
      else {

      }
    }, error => {
      console.log("Financial Documents Error", error);
    })
  }

  getAllSubDepartmentForComments() {
    this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempSubDepartment = {} as AllSubDepartmentList

          tempSubDepartment.subdepartmentForCommentID = current.subDepartmentForCommentID;
          tempSubDepartment.subDepartmentID = current.subDepartmentID;
          tempSubDepartment.subDepartmentName = current.subDepartmentName;
          tempSubDepartment.commentStatus = current.commentStatus;
          tempSubDepartment.UserAssaignedToComment = current.userAssaignedToComment;

          this.AllSubDepartmentList.push(tempSubDepartment);
        }
        this.dataSource = this.AllSubDepartmentList;

        console.log("SubDepartmentList", this.AllSubDepartmentList);
      }
      else {

      }
    }, error => {
      console.log("SubDepartment For Comment List Error", error);
    })
  }

  getEngineerAndContractor() {
    
  }
 
}
