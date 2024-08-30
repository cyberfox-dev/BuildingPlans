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

  //applying for a client...
  originatorID: any | undefined;

  rejected: boolean = false;
  approved: boolean = false;

   //  Financial POP Kyle 15/01/24
  uploadingPOP: boolean = false;
  uploadedPOP: boolean = false;
   //  Financial POP Kyle 15/01/24
  canClarify: boolean;
  /*type of applicant*/
  isInternal = true;
  toa = '';
  /*external*/
  extApplicantBpNoApplicant = '';
  extApplicantCompanyName = '';
  extApplicantCompanyRegNo = '';
  extApplicantCompanyType = '';
  extApplicantName = '';
  extApplicantSurname = '';
  extApplicantTellNo = '';
  extApplicantEmail = '';
  extApplicantPhyscialAddress = '';
  extApplicantIDNumber = '';
  extApplicantICASALicense = ''; //icasaDetailsDisplay Sindiswa 16 Janauary 2024
  isTelecomms: boolean = false; //icasaDetailsDisplay Sindiswa 16 Janauary 2024
  isExtApplicantViewer: boolean = false; //icasaDetailsDisplay Sindiswa 16 Janauary 2024

  /*internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
  internalApplicantBranch = '';
  internalApplicantCostCenterNo = '';
  internalApplicantCostCenterOwner = '';

  permitDate = '';

  ExternalPaid: boolean = false;

  option: any;

  wbsNumberRequested = '';
  WBSBtn: boolean = false;
  WBSField: boolean = false;
  logoUrl: any;
  try: any;
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
  ReApplyCount: number | undefined; //reapply Sindiswa 25 January 2024
 
  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
  clarifyBtn: boolean = false;
  replyCreated: boolean = false;
  editComment: boolean = true;
  ApplicantReply = '';
  //reply = ''
  /* @ViewChild('fileInput') fileInput: ElementRef | undefined;*/
  fileAttr = 'Choose File';
  //commentEdit: any;
  currentApplication: number;
  configNumberOfProject: any;
  configMonthYear: any;
  wbs: any;
  WBS: string;
  wbsButton: boolean;
  CurrentApplicant: number;
  wbsRequired: boolean;
  typeOfApp: string;
  NotificationNumber: string;
  WBSNumber: string;
  PhysicalAddressOfProject: string;
  DescriptionOfProject: string;
  NatureOfWork: string;
  ExcavationType: string;
  ProjectNum: string;
  clientName: string;
  ApprovalPackBtn: boolean = false;
  RejectionPackBtn: boolean = false;
  depID: any;
  subDepNameForClarify: any;
  currentIndex: any;
  subDepartmentForComment: any;
  permitStartDate: Date;
  permitBtn: boolean;
  permitTextBox: boolean = false;
  startDate: string;
  selectPaidDate: Date;

  showFormerApps: boolean;
  fromReApplyArchive: boolean;

  fileAttrs = "Upload File:" ;
  fileAttrsName = "Doc";

  ApForUpload: string;
  showPermitTab: boolean;
  showStatusOfWorksTab: boolean;
  generateApproval: boolean;
  hasFile: boolean;
  EMBUsers: any;
  loggedInUsersSubDepartmentID: number;
  CurrentUserProfile: any;
  stringifiedDataUserProfile: any;
  isEMBUser: boolean;
  datePaid: string;
  Paid: string;
  canReviewerClarify: boolean;
    previousReviewer: any;
  referComment: boolean;
  PacksTab: boolean = false;
  public InternalExternalUser: boolean=false;
    isExternalApplicant: boolean;
  SuccessfulUploads: number = 0;
 //Audit Trail Kyle
  stringifiedDataRoles: any;
  AllCurrentUserRoles: any;
  //Audit Trail Kyle

  //Final Approver && Senior Approver Kyle 01/02/24
  reviewerToReply: boolean = false;
  progressBar: number = 0;
  reply: string = "";
 commentEdit: string = "";
  //Final Approver && Senior Approver Kyle 01/02/24
  canCreateNote: boolean = false;
  showPreInvoice: boolean = false //zxNum-and-contractorAccount Sindiswa 28 February 2024
  waterZXEnabled: boolean = false;
  rimZXEnabled: boolean = false;
  contractorInfEnabled: boolean = false;
  showEMBInput: boolean = false;
  totalZXDepartments: number;
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
  ngOnInit(): void {

    

    this.applicationData = this.sharedService.getViewApplicationIndex();
    console.log("venApplicationData:", this.applicationData);
    
    

    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log(this.CurrentUser);
    }
    

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);
    
   
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    console.log("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", this.applicationDataForView[0]);
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    
    // #region icasaDetailsDisplay Sindiswa 16 January 2024, when the logged in user is external the "Applicant" details show funny | USERID??
    console.log("This is the current user's details --- 280200224", this.CurrentUserProfile);


    // #endregion icasaDetailsDisplay Sindiswa 16 January 2024
    //Audit Trail Kyle
    this.stringifiedDataRoles = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedDataRoles);
    console.log("This is the current user's roles --- 280200224", this.AllCurrentUserRoles);
    
  
    // Audit Trail Kyle

    //#region zxNum-and-contractorAccount Sindiswa 28 February 2024
    if (this.CurrentUserProfile[0].departmentID == 28 /*EMB*/ || (this.AllCurrentUserRoles.some(role => role.roleName === "Department Admin") && (this.CurrentUserProfile[0].departmentID == 24 /*Water*/ || this.CurrentUserProfile[0].departmentID == 25/*RIM*/))) {
      this.showPreInvoice = true;
      if (this.AllCurrentUserRoles.some(role => role.roleName === "Department Admin") && (this.CurrentUserProfile[0].departmentID == 24 /*Water*/ )) {
        this.waterZXEnabled = true;
      }
      if (this.AllCurrentUserRoles.some(role => role.roleName === "Department Admin") && (this.CurrentUserProfile[0].departmentID == 25/*RIM*/)) {
        this.rimZXEnabled = true;
      }
    }
    //#endregion
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14); // Add 14 days to the current date
    
    this.minDate = twoWeeksFromNow.toISOString().split('T')[0];


    //#region reapply Sindiswa 26 January 2024
    
/*JJS Commit 29-02-24(removed full-screen mode for maps and sorted approval pack btn and former wayleave tab)*/
    if (this.sharedService.getShowFormerApps.length > 0) {
      this.showFormerApps = true
    }
    else {
      this.showFormerApps = false;
    }

    this.fromReApplyArchive = this.sharedService.getFromReApplyArchive();
    this.routerSubscription = this.sharedService.getRoutingToOldAapp();
    // #endregion
    const setValues = this.applicationDataForView[0];
 
    if (setValues != null || setValues != undefined) {

      this.ApplicationID = setValues.applicationID;
    }
    else {

      this.router.navigate(["/home"]);
    }
    
   

    
    
    this.CurrentApplicant = setValues.CreatedById;

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

        }
      }
      else {
        alert(data.responseMessage);
      }
    })
  }
 
  getCurrentApplication() {

  }

  openViewReply(index: any) {

  }
  SaveReply() {

  }
}
