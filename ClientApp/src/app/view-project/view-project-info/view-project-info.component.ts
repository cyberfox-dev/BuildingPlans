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

/*import { PdfGenerationService } from 'src/app/service/PDFGeneration/pdf-generation.service';*/

import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ReviewerforcommentService } from '../../service/ReviewerForComment/reviewerforcomment.service';
import { Subscription } from 'rxjs';

//Audit Trail Kyle
import { AuditTrailService } from '../../service/AuditTrail/audit-trail.service';
//Audit Trail Kyle 
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
  
 
  displayedColumns: string[] = ['FinancialName','FinancialDocumentName' ,'actions'];
  dataSourceDoc = this.FinancialDocumentsList;
  

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
    //Audit Trail Kyle
  ) { }

  routerSubscription: Subscription; //reapply Sindiswa 26 January 2024


  ngOnInit(): void {

    

    this.applicationData = this.sharedService.getViewApplicationIndex();
    console.log("venApplicationData:", this.applicationData);
    this.getAllSubDepartments();
    

    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log(this.CurrentUser);
    }
    

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getRolesLinkedToUser();
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
    this.onCheckAllCurrentUserRole();
  
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
    debugger;
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
    
    //Permit Tab Kyle 22/01/24
    
    if (setValues.CurrentStageName == "PTW") {
      this.showPermitTab = true;
      this.PacksTab = true;
    } else {
      this.showPermitTab = false;
      this.PacksTab = false;
    }
    
    if (setValues.CurrentStageName == "Monitoring") {
      this.showStatusOfWorksTab = true;
      this.showPermitTab = true;
      this.PacksTab = true;
    } else {
      this.showStatusOfWorksTab = false;
    }
    //Permit Tab Kyle 22/01/24
    if (setValues.CurrentStageName == "Approval Pack Generation") {
      this.generateApproval = true;
      this.showPermitTab = false;

    } else {
      this.generateApproval = false;
    }
    //Permit Tab Kyle 22/01/24
    if (setValues.CurrentStageName == "Approval Pack Generation" && this.CurrentUser.appUserId == this.applicationDataForView[0].CreatedById) {
      this.generateApprovalbtn = true;
      this.showPermitTab = false;
      this.PacksTab = true;
    } else {
      this.generateApprovalbtn = false;
 
    }
    if (this.CurrentUser.appUserId == this.applicationDataForView[0].CreatedById) {
      this.referComment = true;
    }

    
    this.getRolesLinkedToUser();
    this.CurrentApplicant = setValues.CreatedById;

    this.currentApplication = this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    console.log("this is the created by ID", setValues);
    this.createdByID = setValues.CreatedById;
    this.getApplicationDetailsForDocs();
    


    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    
    //Assigns the below values to the variable that will be passed to the map component.
    this.ARCGISAPIData.createdByID = this.CurrentUser.appUserId;
    this.ARCGISAPIData.isActive = "1";
    /*    this.ARCGISAPIData.applicationID = this.notificationNumber;*/
    this.getAllComments();
    //this.getAllDocsForApplication();

    //this.getUserProfileByUserID(); //comment this out later and add this.checkIfProxyApplication();
    this.checkIfProxyApplication();

    this.getAllStages();
    this.setInterface();
    this.getAllRequiredDeposits();
    

    this.checkIfWbsRequired();
        this.getAllSubDepForReject();
    /*    this.getAllSubDepForReject();*/
    this.canReapply = this.sharedService.getCanReapply();
    console.log("canReapplyVen: ", this.canReapply);
    this.setProjectNumber();
    
    this.getLinkedDepartments();
    this.checkIfCanReply();
    this.checkIfCanReviwerReply();
    this.checkIfPermitExsist();
    this.getFinancial();
    
    this.getEMBUsers();

    this.getAllSubDepartments();
    this.getLinkedDepartmentsFORAPPROVAL();
    this.CheckForApprovalPackDownload();
    //Progress bar Kyle 07-02-24
    this.CalCulateApprovalProgess();
    this.getZXNumberDetails();//
    

    
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
  openEditCommentModal(commentEditorModal: any, index: any) {

    
    this.currentIndex = index;
    this.commentEdit = this.CommentsList[index].Comment;
    //this.commentEdit = this.CommentsList[index].Comment;
    console.log("This is what you're trying to edit", this.CommentsList[index].Comment);


    this.subDepartmentForComment = this.CommentsList[index].SubDepartmentForCommentID;
    this.modalService.open(commentEditorModal, { centered: true, size: 'lg' });

  }

  sanitizeHTML(comment: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(comment);
  }

  receivedata: string;

  receiveData(data: string) {

    this.receivedata = data;
    console.log(this.receivedata);
    if (this.receivedata == "Final Approved") {
      this.approved = true;
      this.onCreateApprovalPack();
    }
    else if (this.receivedata == "Rejected") {
      this.rejected = true;

    }
    else {

    }

  }

  onCloseFile() {
    if (this.hasFile) {
      if (confirm("The file will be uploaded if you proceed. Click 'OK' to upload or 'Cancel' to delete the file before proceeding.")) {
        this.modalService.dismissAll();
      }
      else {

      }

    } else {
      this.modalService.dismissAll();
    }


  }

  getAllSubDepartments() {
    this.subDepartmentService.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempSubDepartmentLinkedList = {} as AllSubDepartmentList;
          const current = data.dateSet[i];
/*JJS Commit 20-02-24*/
          tempSubDepartmentLinkedList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentLinkedList.UserAssaignedToComment = current.userAssaignedToComment;
          
          tempSubDepartmentLinkedList.subDepartmentName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempSubDepartmentLinkedList.departmentID = current.departmentID;
          tempSubDepartmentLinkedList.dateUpdated = current.dateUpdated;
          tempSubDepartmentLinkedList.dateCreated = current.dateCreated;
          tempSubDepartmentLinkedList.subdepartmentForCommentID = current.subDepartmentForCommentID;
          tempSubDepartmentLinkedList.GLCode = current.glCode;
          tempSubDepartmentLinkedList.ProfitCenter = current.profitCenter;


          this.AllSubDepartmentList.push(tempSubDepartmentLinkedList);

        }


      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);


      }
      console.log("reponseGetAllLinkedSubDepartmentsForComment", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getSubByName(subDepName: string) {
    for (let i = 0; i < this.AllSubDepartmentList.length; i++) {
      if (this.AllSubDepartmentList[i].subDepartmentName === subDepName) {
        return this.AllSubDepartmentList[i];
      }
    }
    return null;  // or you might want to throw an error
  }

  getServiceItem(serviceItemCode: string) {



    this.serviceItemService.getServiceItemByServiceItemCode(serviceItemCode).subscribe((data: any) => {
      if (data.responseCode == 1) {

        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemCode = current.serviceItemCode;
          tempServiceItemList.Rate = current.rate;
          tempServiceItemList.Description = current.description;

          this.ServiceItemList.push(tempServiceItemList);

        }


      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  addInvoiceTitle(doc) {
    autoTable(doc, {
      body: [['Wayleave Application Fee Invoice']],
      styles: { halign: 'right', fontSize: 20, textColor: '#000000' },
      theme: 'plain'
    });
  }

  addClientDetails(doc) {
    autoTable(doc, {
      body: [['Wayleave Reference: ' + this.ApplicationID
        + '\nCustomer VAT registration number: No.4500193497'
        + '\nBusiness partner number: No.4500193497']],
      styles: { halign: 'right' },
      theme: 'plain'
    });
  }

  addCompanyDetails(doc) {
    autoTable(doc, {
      body: [['Civic Centre'
        + '\n12 Hertzog Boulevard 8001'
        + '\nPO Box 655 Cape Town 8000'
        + '\nVAT registration number: 4500193497'
        + '\nEmail: wayleaves@capetown.gov.za'
        + '\nWeb address: www.capetown.gov.za']],
      styles: { halign: 'left' },
      theme: 'plain'
    });
  }

  addServiceItemsAndCostDetailsSJ(doc, startY) {
    // Generate table body based on ServiceItemList data and calculate the total cost
    let totalCost = 0;
    let tableBody = this.ServiceItemList.map(item => {
      const amount = item.Rate; // Assuming amount equals rate for each item
      totalCost += parseFloat(amount);

      let profitCenter = '';
      let glCode = '';
      if (item.Description === 'RIM Admin Fee') {
        profitCenter = this.getSubByName("Roads & Infrastructure Management").ProfitCenter;
        glCode = this.getSubByName("Roads & Infrastructure Management").GLCode;
      } else if (item.Description === 'Water & Sanitation Admin Fee') {
        profitCenter = this.getSubByName("Waste Water and Treatment").ProfitCenter;
        glCode = this.getSubByName("Waste Water and Treatment").GLCode;
      } else {
        profitCenter = this.getSubByName("EMB").ProfitCenter;
        glCode = this.getSubByName("EMB").GLCode;
      }

      return ['1', item.Description, amount, amount, profitCenter, glCode];
    });

    // Calculate the VAT and total amount due
    const vat = totalCost * 0.15;
    const totalAmountDue = totalCost + vat;

    // Add cost details directly to the table body
    tableBody.push(
      ['Amount Due', '', '', totalCost.toFixed(2), '', ''],
      ['VAT (15%)', '', '', vat.toFixed(2), '', ''],
      ['Total Amount Due', '', '', totalAmountDue.toFixed(2), '', '']
    );

    // Add the combined table to the document
    autoTable(doc, {
      head: [['Quantity', 'Description', 'Unit', 'Amount', 'Profit Center', 'GL Code']],
      body: tableBody,
      theme: 'grid',
      styles: { cellPadding: 1, lineWidth: 0.1, lineColor: [220, 220, 220], cellWidth: 'wrap', fillColor: [255, 255, 255] }, // setting cell color to white
      headStyles: { fillColor: [180, 180, 180] }, // setting header color to a darker grey
      startY: startY,
      margin: { top: 20 }
    });

    // Return the new startY value
    return startY + 40; // decreased from 60 + 20
  }

  addAccountDetails(doc, startY) {
    const boxContent = 'Profit Centre: ' + this.getSubByName("EMB").ProfitCenter
      + '\nGL Acc: ' + this.getSubByName("EMB").GLCode


    autoTable(doc, {
      body: [[boxContent]],
      styles: { halign: 'center', valign: 'middle', fillColor: [255, 255, 255] }, // white fill color
      theme: 'grid',
      startY: startY,
    });

    return startY + 30; // adjust this value as needed
  }

  addPayPointsNotice(doc, startY) {
    autoTable(doc, {
      body: [['Pay points: City of Cape Town cash offices or the vendors below:']],
      styles: { halign: 'left' },
      theme: 'plain',
      startY: startY + 20 // adjust this value to create space between the tables
    });
    return startY + 20 + 20; // decreased from 100 + 20
  }

  addPaymentDetails(doc, startY) {
    autoTable(doc, {
      body: [['Please Note:\n\n'
        + '1. Payment options:\n\n'
        + '(a) Electronic payments (EFT): Select the City of Cape Town as a bank-listed beneficiary on your bank\'s website. Use the reference number provided above.\n'
        + '(b) Direct deposit at Nedbank: Please present your reference number to the bank teller.\n'
        + '(c) Cash, debit card, credit card and other: Please present your reference number to the cashier.\n\n'
        + '2. Failure to pay could result in:\n\n'
        + '(a) The lapse of your application, resulting in the need for re-application\n'
        + '(b) Necessity for re-application with no guarantee of similar conditions / requirements']],
      styles: { halign: 'left' },
      theme: 'plain',
      startY: startY + 20 // adjust this value to create space between the tables
    });
    return startY + 20 + 20; // decreased from 100 + 20
  }

  generateInvoiceSplit() {

    // Create a new PDF
    const doc = new jsPDF();

    // Add company logo
    const logo = new Image();
    logo.src = 'assets/cctlogoblack.png';
    doc.addImage(logo, 'png', 10, 10, 60, 20);

    // Add invoice title
    this.addInvoiceTitle(doc);

    // Add client details
    this.addClientDetails(doc);

    // Add company contact details
    this.addCompanyDetails(doc);


    // Set the starting Y position for the table
    let startY = 100;

    // Generate service items table, cost details and calculate total cost
    startY = this.addServiceItemsAndCostDetailsSJ(doc, startY);

    startY += 8; // adjust this value as needed

    // Add account details
    startY = this.addAccountDetails(doc, startY);

    // Reduce the gap before the next section
    startY -= 28; // adjust this value as needed

    // Add payment options and consequences of non-payment
    startY = this.addPaymentDetails(doc, startY);

    // Increase the gap before the next section
    startY += 20;

    // Add pay points notice
    startY = this.addPayPointsNotice(doc, startY);

    startY -= 35; // adjust this value as needed


    // Add vendors image

    //  const vendors = new Image();
    //vendors.src = 'assets/vendors.jpg';

    //const pageWidth = doc.internal.pageSize.getWidth();
    //const aspectRatio = vendors.width / vendors.height; // assumes vendors Image object contains width and height properties
    //const imgHeightOnPage = pageWidth / aspectRatio;

    //doc.addImage(vendors, 'JPEG', 0, startY + 40, pageWidth, imgHeightOnPage);


    const vendors = new Image();
    vendors.src = 'assets/vendors.jpg';
    doc.addImage(vendors, 'JPEG', 15, startY + 25, 180, 20);

    // Save the PDF as a blob object and push it for temporary upload
    this.saveAndUploadPDFSplit(doc);

    // Navigate to home page
    // this.router.navigate(["/home"]);

  }

  saveAndUploadPDFSplit(doc) {
    this.sharedService.FileDocument = [];
    doc.save("invoiceSplit.pdf");
    // const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    //  const file = new File([pdfData], 'Wayleave Application Fee Invoice Split.pdf', { type: 'application/pdf' });

    // Prepare the form data
    //   const formData = new FormData();
    //   formData.append('file', file);

    // this.sharedService.pushFileForTempFileUpload(file, "Wayleave Application Fee Invoice Split" + ".pdf");
    // this.save();
  }

  getEMBUsers() {
    this.accessGroupsService.getUserBasedOnRoleName("EMB", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.EMBUsers = data.dateSet;

        for (var i = 0; i < this.EMBUsers.length; i++) {
          const currentEMBUser = this.EMBUsers[i].userID;
          if (currentEMBUser == this.CurrentUser.appUserId) {
            this.isEMBUser = true;
          } else {
            this.isEMBUser = false;
          }
        }

      }
      else {
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })
  }

  //validate(): void {
  //  //this.businessPartnerService.validateBP().subscribe(
  //  //  (response: boolean) => {
  //  //    // Handle the API response
  //  //    console.log('API response:', response);

  //  //    // Update SQL database accordingly
  //  //    // ...
  //  //  },
  //  //  (error: any) => {
  //  //    alert('API error: '+ error);
  //  //    console.error('API error:', error);
  //  //  }
  //  //);


  //  this.businessPartnerService.validateBP(123).subscribe(
  //    (response: boolean) => {
  //      // Handle the API response
  //      console.log('API response:', response);

  //      // Update SQL database accordingly
  //      // ...
  //    },
  //    (error: any) => {
  //      // Handle API errorerror
  //      console.error('API error:', error);
  //    }
  //  );
  //}

  validate(): void {
    this.businessPartnerService.validateBP(1000110197).subscribe(
      (response: any) => {
        // Handle the API response
        console.log('API response:', response);

        // Access the "Response" property
        const apiResponse = response.Response;
        // Update SQL database accordingly
        // ...
        alert(apiResponse);
      },
      (error: any) => {
        // Handle API error
        console.error('API error:', error);
      }
    );
  }



  checkIfCanReply() {
    if (this.CurrentApplicant == this.CurrentUser.appUserId) {
      this.canClarify = true;
    }
    else {
      this.canClarify = false;
    }
    console.log("CanReply", this.canClarify);
  }

  checkIfCanReviwerReply() {
    
    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        let tempReferCommentList;
        for (let i = 0; i < data.dateSet.length; i++) {

          
          
          const current = data.dateSet[i];
          
          if (current.commentStatus == "Referred" && current.subDepartmentID == this.loggedInUsersSubDepartmentID) {
            
            if (current.createdById == this.CurrentUser.appUserId) {
              
              this.canReviewerClarify = true;
            }
            else {
              
              this.canReviewerClarify = false;
            }


          }


        }

      }
      else {
        alert(data.responseMessage);
        
      }
      console.log("reponse", data);

    }, error => {
      
      console.log("Error: ", error);
    })













    if (this.CurrentApplicant == this.CurrentUser.appUserId) {
      this.canReviewerClarify = true;
    }
    else {
      this.canReviewerClarify = false;
    }

  }

  onFileDelete(event: any, index: number) {
    this.hasFile = false;
    this.fileAttrsName = "Doc";

    //this.getAllDocsForApplication();
    this.fileCount = this.fileCount - 1;

  }

  onFileDelete2(event: any, index: number) {
    this.MandatoryDocumentUploadList[index].hasFile = false
    this.fileAttrsName = "Doc";

    //this.getAllDocsForApplication();
    this.fileCount = this.fileCount - 1;
  }
  changeHasFile() {
    if (this.hasFile) {
      this.hasFile = false;
    } else {
      this.hasFile = true;
    }
  }
  onFileUpload(event: any) {
   

    
  }
  onFileUpload2(event: any, index: any) {
    this.MandatoryDocumentUploadList[index].hasFile = true;
  }

  onAutoLinkForPermit() {

    this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          this.permitService.addUpdatePermitSubForComment(0, this.ApplicationID, data.dateSet[i].subDepartmentID, data.dateSet[i].subDepartmentName, null, null, null, this.CurrentUser.appUserId, data.dateSet[i].zoneID, data.dateSet[i].zoneName).subscribe((data: any) => {

            if (data.responseCode == 1) {

              // alert(data.dateSet.subDepartmentName + " assigned to this Application");

            }
            else {

              alert(data.responseMessage);
            }
            console.log("reponseAddUpdateDepartmentForComment", data);


          }, error => {
            console.log("Error: ", error);
          })
        }
        //Audit Trail Kyle
        this.onSaveToAuditTrail("User has applied for permit");
         //Audit Trail Kyle
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseAddUpdateDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })
  }



  setProjectNumber() {

    if (this.CurrentApplicationBeingViewed[0].ProjectNumber == null) {


      this.projectNo = this.CurrentApplicationBeingViewed[0].applicationID.toString();
    }
    else {

      this.projectNo = this.CurrentApplicationBeingViewed[0].ProjectNumber;
    }


  }

  getCurrentApplication(): any {
    return this.CurrentApplicationBeingViewed[0];
  }


  refreshComponent(): void {
    const currentApplication = this.CurrentApplicationBeingViewed[0];
    this.router.navigateByUrl('/view-project-info', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/view-project-info'], { queryParams: { application: currentApplication } });
      });
  }
  refreshButtonClicked(): void {
    this.refreshComponent();
  }


/*  JJS 8 Jan(Changed the approve to Prov.Approve)*/
  getAllComments() {

    this.CommentsList.splice(0, this.CommentsList.length);
    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCommentList = {} as CommentsList;
          const current = data.dateSet[i];
          tempCommentList.ApplicationID = current.applicationID;
          tempCommentList.Comment = current.comment;
          tempCommentList.CommentID = current.commentID;
          //Final Approver && Senior Approver Kyle 01/02/24
          if (this.CurrentUserProfile[0].isInternal == true) {
            if (current.commentStatus == "Approved") {
              tempCommentList.CommentStatus = "Provisionally Approved";
            }
            else if (current.commentStatus == "Rejected") {
              tempCommentList.CommentStatus = "Provisionally Rejected";
            }
            else if (current.commentStatus == "FinalReject") {
              tempCommentList.CommentStatus = "Final Rejected";
            }
           
            else {
              tempCommentList.CommentStatus = current.commentStatus;
            }
            
            tempCommentList.SubDepartmentForCommentID = current.subDepartmentForCommentID;
            /*tempCommentList.SubDepartmentName = current.subDepartmentName;*/
            tempCommentList.SubDepartmentName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
            tempCommentList.isClarifyCommentID = current.isClarifyCommentID;
            tempCommentList.isApplicantReplay = current.isApplicantReplay;

            tempCommentList.UserName = current.userName;
            //Comments Kyle 01/02/24
            tempCommentList.ZoneName = current.zoneName;
            //Comments Kyle 01/02/24
            //Clarifications Alerts Kyle
            tempCommentList.CanReplyUserID = current.canReplyUserID;
            tempCommentList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            debugger;
            if (tempCommentList.CommentStatus == "Clarified" || tempCommentList.CommentStatus == " Reviewer Clarified" || tempCommentList.CommentStatus == " Applicant Clarified") {
              tempCommentList.HasReply = true;
            }

            this.CommentsList.push(tempCommentList);
            console.log("THISISTHECOMMENTSLISTTHISISTHECOMMENTSLIST", current);
            console.log("THISISTHECOMMENTSLISTTHISISTHECOMMENTSLIST", tempCommentList);
          }

          else {
            if (current.commentStatus != "Reviewer Clarify") {
              if (current.commentStatus == "Approved") {
                tempCommentList.CommentStatus = "Provisionally Approved";
              }
              else if (current.commentStatus == "Rejected") {
                tempCommentList.CommentStatus = "Provisionally Rejected";
              }
              else if (current.commentStatus == "FinalReject") {
                tempCommentList.CommentStatus = "Final Rejected";
              }
              else {
                tempCommentList.CommentStatus = current.commentStatus;
              }

              tempCommentList.SubDepartmentForCommentID = current.subDepartmentForCommentID;
              tempCommentList.SubDepartmentName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
              tempCommentList.isClarifyCommentID = current.isClarifyCommentID;
              tempCommentList.isApplicantReplay = current.isApplicantReplay;
              tempCommentList.UserName = current.userName;
              //Comments Kyle 01/02/24
              tempCommentList.ZoneName = current.zoneName;
              //Comments Kyle 01/02/24
              tempCommentList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
              debugger;
              if (tempCommentList.CommentStatus == "Clarified" || tempCommentList.CommentStatus == " Reviewer Clarified" || tempCommentList.CommentStatus == "Applicant Clarified") {
                tempCommentList.HasReply = true;
              }
              else {
                tempCommentList.HasReply = false;
              }

              this.CommentsList.push(tempCommentList);
              console.log("THISISTHECOMMENTSLISTTHISISTHECOMMENTSLIST", current);
              console.log("THISISTHECOMMENTSLISTTHISISTHECOMMENTSLISTKyle", tempCommentList);
            }
           
          }  
          

        }

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  // #region comments Sindiswa 19 January 2024
  getAppCollaborators() {
    //mhmm, played myself - won't have the appropriate subdepartmentID and zoneID here
    this.reviwerforCommentService.getAssignementDetails(this.ApplicationID, null, null).subscribe((data: any) => {
      if (data.resposneCode == 1) {

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }
  // #endregion

  modalTitle: string = "";
  clarityType: string = ""; //comments Sindiswa 18 January 2024 - making the clarity more dynamic

  openReplyModal(replyModal: any, index: any, action: string, commentStatus:string) {
    this.modalService.open(replyModal, { centered: true, size: 'lg' })
    this.currentIndex = index;
    if (this.CommentsList[index].isApplicantReplay != null) {
      this.reply = this.CommentsList[index].isApplicantReplay;
     
    } else {
      this.reply = "";
    }

    this.subDepartmentForComment = this.CommentsList[index].SubDepartmentForCommentID;

    if (action === 'Reply') {
      this.modalTitle = 'Reply To Comment';
    } else if (action === 'Update') {
      this.modalTitle = 'Update Reply to Comment';
    }

    //* comments Sindiswa 18 January 2024 - making the clarity more dynamic */
    if (commentStatus === "Reviewer Clarity" || commentStatus === "Reviewer Clarify" ) {
      this.clarityType = "Reviewer Clarified";
    }
    else if (commentStatus == "Applicant Clarify") {
      this.clarityType = "Applicant Clarified";
    }
    else if (commentStatus === "Clarify" ) {
      this.clarityType = "Clarified";
    }
  }



  //async getSelectedDepartment(subDepID:number) {


  //   //this.LinkedUserToSub.splice(0, this.LinkedUserToSub.length);
  // await  this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, subDepID ).subscribe((data: any) => {
  //     if (data.responseCode == 1) {
  //       const current = data.dateSet[0];
  //

  //       this.subDepartmentForComment = current.subDepartmentForCommentID;


  //     }
  //     else {

  //       alert(data.responseMessage);
  //     }
  //     console.log("reponseGetSubDepartmentForComment", data);


  //   }, error => {
  //     console.log("Error: ", error);
  //   })

  // }



  // TODO: make sure that comments update

  updateComment() {
    let CurrentComment =this.commentEdit;
    console.log("This is the updated comment", CurrentComment);
    //let CurrentComment = this.commentEdit;

    const currentComment = this.CommentsList[this.currentIndex];
    //let numberOfComments = 0;
    //for (var i = 0; i < this.CommentsList.length; i++) {
    //  if (this.CommentsList[i].SubDepartmentForCommentID == currentComment.SubDepartmentForCommentID) {
    //    numberOfComments++;
    //  }
    //}


    if (confirm("Are you sure you want update this comment?")) {
      this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, CurrentComment, null, null, null, null).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.getAllComments();

          alert("Update Comment Successful");

        }
        else {
          alert("Update Comment Unsuccessful");

        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }

    //else {
    //  alert("You cannot update this reply.");
    //}



    //if (currentComment.isClarifyCommentID == numberOfComments || currentComment.isClarifyCommentID == null) {
    //  this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, "Clarified", null, numberOfComments, Currentreply).subscribe((data: any) => {

    //    if (data.responseCode == 1) {
    //      this.getAllComments();

    //
    //      this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, null, false, null, null, null).subscribe((data: any) => {

    //        if (data.responseCode == 1) {




    //        }
    //        else {
    //          alert(data.responseMessage);

    //        }
    //        console.log("reponse", data);


    //      }, error => {
    //        console.log("Error: ", error);
    //      })


    //      alert("Reply Successful");

    //    }
    //    else {
    //      alert("Reply Unsuccessful");

    //    }
    //    console.log("reponse", data);

    //  }, error => {
    //    console.log("Error: ", error);
    //  })
    //}
    //else {
    //  alert("You cannot edit this comment");
    //}






  }
  

  createReply() {
    //let Currentreply = this.reply;
    let Currentreply = this.reply;
    
    //this.ApplicantReply = Currentreply;
    // this.replyCreated = true;
    debugger;
    const currentComment = this.CommentsList[this.currentIndex];
    let numberOfComments = 0;
    for (var i = 0; i < this.CommentsList.length; i++) {
      if (this.CommentsList[i].SubDepartmentForCommentID == currentComment.SubDepartmentForCommentID) {
        numberOfComments++;
      }
    }
     //Final Approver && Senior Approver Kyle 01/02/24
    let commentStatus = "";
    let updateStatus = currentComment.CommentStatus;

    debugger;
    if (this.clarityType == "Reviewer Clarified" || this.clarityType == "Applicant Clarified") {
      commentStatus = "Approved";
    }
    else {
      commentStatus = null;
    }
    //Final Approver && Senior Approver Kyle 01/02/24
    if (currentComment.isClarifyCommentID == null) {
      if (confirm("Are you sure you want to add this reply?")) {

        this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null,/*comments Sindiswa 18 January 2024 - making the clarity more dynamic*/ this.clarityType, null, numberOfComments, Currentreply).subscribe((data: any) => {

          if (data.responseCode == 1) {
            this.getAllComments();
            this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, commentStatus, false, null, null, null).subscribe((data: any) => {

              if (data.responseCode == 1) {
                //Final Approver && Senior Approver Kyle 01/02/24
                this.modalService.dismissAll();
                this.router.navigate(["/home"]);


              }
              else {
                alert(data.responseMessage);

              }
              console.log("reponse", data);


            }, error => {
              console.log("Error: ", error);
            })


            alert("Reply Successful");

          }
          else {
            alert("Reply Unsuccessful");

          }
          console.log("reponse", data);

        }, error => {
          console.log("Error: ", error);
        })
      }
    }
    else  if (currentComment.isClarifyCommentID != null && currentComment.isClarifyCommentID == numberOfComments) {
      if (confirm("Are you sure you want to update this replay? You will not be able to update the reply again.")) {

        if (updateStatus == "Applicant Clarified" || updateStatus == "Reviewer Clarified") {
          commentStatus = "Approved";
        }
        this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, this.clarityType, null, 1, Currentreply).subscribe((data: any) => {
          
          if (data.responseCode == 1) {
            this.getAllComments();


            this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, commentStatus, false, null, null, null).subscribe((data: any) => {

              if (data.responseCode == 1) {

                this.modalService.dismissAll();
                this.router.navigate(["/home"]);


              }
              else {
                alert(data.responseMessage);

              }
              console.log("reponse", data);


            }, error => {
              console.log("Error: ", error);
            })


            alert("Update Reply Successful");

          }
          else {
            alert("Update Reply Unsuccessful");

          }
          console.log("reponse", data);

        }, error => {
          console.log("Error: ", error);
        })
      }
    }
    else {
      alert("You cannot update this reply.");
    }



    //if (currentComment.isClarifyCommentID == numberOfComments || currentComment.isClarifyCommentID == null) {
    //  this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, "Clarified", null, numberOfComments, Currentreply).subscribe((data: any) => {

    //    if (data.responseCode == 1) {
    //      this.getAllComments();

    //      
    //      this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, null, false, null, null, null).subscribe((data: any) => {

    //        if (data.responseCode == 1) {




    //        }
    //        else {
    //          alert(data.responseMessage);

    //        }
    //        console.log("reponse", data);


    //      }, error => {
    //        console.log("Error: ", error);
    //      })


    //      alert("Reply Successful");

    //    }
    //    else {
    //      alert("Reply Unsuccessful");

    //    }
    //    console.log("reponse", data);

    //  }, error => {
    //    console.log("Error: ", error);
    //  })
    //}
    //else {
    //  alert("You cannot edit this comment");
    //}






  }

  checkIfApplicationIsNotApproved() {
    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == "Final Approval") {

    }
  }





  getAllStages() {



    this.StagesList.splice(0, this.StagesList.length);

    this.stagesService.getAllStages().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempStageList = {} as StagesList;
          const current = data.dateSet[i];
          tempStageList.StageID = current.stageID;
          tempStageList.StageName = current.stageName;
          tempStageList.StageOrderNumber = current.stageOrderNumber;

          this.StagesList.push(tempStageList);
          // this.sharedService.setStageData(this.StagesList);
        }

      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllRequiredDeposits() {


    this.depositRequiredService.getDepositRequiredByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepositRequired = {} as DepositRequired;
          const current = data.dateSet[i];

          tempDepositRequired.ApplicationID = current.applicationID;
          tempDepositRequired.DepositRequiredID = current.depositRequiredID;
          tempDepositRequired.Desciption = current.desciption;
          tempDepositRequired.Quantity = current.quantity;
          debugger;
          tempDepositRequired.Rate = current.rate;
          tempDepositRequired.SubDepartmentForCommentID = current.subDepartmentForCommentID;
          tempDepositRequired.SubDepartmentID = current.subDepartmentID;
          tempDepositRequired.SubDepartmentName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempDepositRequired.WBS = current.wbs;



          this.DepositRequired.push(tempDepositRequired);

        }

        console.log(" this.DepositRequiredList this.DepositRequiredList this.DepositRequiredList this.DepositRequiredList", this.DepositRequired);

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  generateConsolidatedDepositInvoice() {
    // Retrieve deposit information
    //await this.getAllRequiredDeposits();

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Service Item Code',
        'Description',
        'Rate',
        'Quantity',
        'Amount'
      ]
    ];
    const data: any[] = [];

    // Logo
    const img = new Image();
    img.src = 'assets/cctlogoblackk.png';

    // Add logo to PDF document
    doc.addImage(img, 'png', 10, 10, 60, 20);


    // Add title to PDF document
    doc.setFontSize(24);
    doc.text('Consolidated Deposit Invoice', 150, 40, { align: 'center' });

    // Add table with Wayleave Ref No., Date, and Invoice Number
    autoTable(doc, {
      body: [
        [
          {
            content: 'Wayleave Ref No.: BW/041/22'
              + '\nDate: ' + this.formattedDate
              + '\nInvoice Number: ' + "198091735",

            styles: {
              halign: 'right',
            }
          }
        ],
      ],

      theme: 'plain',
    });

    doc.setFontSize(10);
    doc.text('BTW Reg. Nr./VAT Reg. No.4500193497', 10, 50, { align: 'left' });
    doc.setFontSize(10);
    doc.text('City of Cape Town' +
      '\nPost Box / Posbus / iShokisi 655' +
      '\nCAPE TOWN' +
      '\n8001', 10, 60, { align: 'left' });

    doc.setFontSize(10);
    doc.text('BTW Reg. Nr./VAT Reg. No.4500193497', 10, 50, { align: 'left' });
    doc.setFontSize(10);
    doc.text('City of Cape Town' +
      '\nPost Box / Posbus / iShokisi 655' +
      '\nCAPE TOWN' +
      '\n8001', 10, 60, { align: 'left' });

    //autoTable(doc, {
    //  body: [
    //    [
    //      {
    //        content: 'BTW Reg. Nr./VAT Reg. No.4500193497',

    //        styles: {

    //          halign: 'left',
    //        }
    //      }
    //    ],
    //  ],


    //  theme: 'plain',


    //});

    //doc.setFontSize(10);


    // Add sub-department to table
    //const subDepartment = this.DepositRequiredList[0].SubDepartmentName;
    //data.push([{ content: `Sub-department: ${subDepartment}`, colSpan: 6, styles: { fontStyle: 'bold' } }, '', '', '', '', '']);

    // Initialize total variable
    let total = 0;

    // Populate table data with DepositRequiredList
    this.DepositRequired.forEach((deposit) => {
      const row = [
        deposit.SubDepartmentName,
        deposit.DepositRequiredID,
        deposit.Desciption,
        deposit.Rate,
        deposit.Quantity,
        deposit.Rate * deposit.Quantity // calculate amount based on rate and quantity
      ];
      total += Number(row[5]);
      data.push(row);
    });

    // Add total row to table
    const totalRow = [
      { content: 'Total:', colSpan: 5, styles: { fontStyle: 'bold' } },
      //'',
      //'',
      //'',
      //'',
      total// round total to 2 decimal places and add it to the total row data
    ];
    data.push(totalRow);


    // Add table to PDF document
    doc.setFontSize(12); // add this line to set the font size
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 80,
      styles: {
        overflow: 'linebreak',
        halign: 'center',
        fontSize: 14
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 50 },
        2: { cellWidth: 80 },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' }
      }
    });



    doc.text('Profit Centre: P19070051', 280, 140, { align: 'right' });
    doc.text('GL Acc: 845180', 10, 140, { align: 'left' });


    doc.setFontSize(20);
    doc.text('USE THIS REF NO: 198091735 TO MAKE EFT PAYMENTS' + '\nFOR THIS INVOICE ONLY', 150, 160, { align: 'center' });


    // Save PDF document
    doc.save('Deposit_Invoice_ApplicationID_' + this.DepositRequired[0].ApplicationID);
  }
  theirProxy: boolean = false;
  internalProxyApplicant: boolean = false;
  //that internal person - proxy
  internalProxyApplicantName = '';
  internalProxyApplicantSurname = '';
  internalProxyApplicantDirectorate = '';
  internalProxyApplicantBranch = '';
  internalProxyApplicantCostCenterNo = '';
  internalProxyApplicantCostCenterOwner = '';
  internalProxyApplicantDepartment = '';
  internalProxyApplicantTellNo = '';
  //external person - proxy
  extProxyApplicantBpNoApplicant = '';
  extProxyApplicantCompanyName = '';
  extProxyApplicantCompanyRegNo = '';
  extProxyApplicantName = '';
  extProxyApplicantSurname = '';
  extProxyApplicantTellNo = '';
  extProxyApplicantEmail = '';
  extProxyApplicantPhyscialAddress = '';
  extProxyApplicantCompanyType = ''; //icasaDetailsDisplay Sindiswa 16 Janauary 2024
  extProxyApplicantICASALicense = ''; //icasaDetailsDisplay Sindiswa 16 Janauary 2024


  checkIfProxyApplication() {
    this.userPofileService.getUserProfileById(this.CurrentApplicationBeingViewed[0].CreatedById).subscribe((data: any) => {
      if (data.responseCode == 1) {

        //Gonna go ahead and assume that only internal people can apply for people
        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;
        if (currentUserProfile.isInternal == true) {
          this.isExternalApplicant = false
          this.toa = 'Internal User';
          this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.internalApplicantDirectorate = currentUserProfile.directorate;
          this.internalApplicantDepartment = currentUserProfile.departmentName;
          this.internalApplicantTellNo = currentUserProfile.phoneNumber;
          this.internalApplicantBranch = currentUserProfile.branch;
          this.internalApplicantCostCenterNo = currentUserProfile.costCenterNumber;
          this.internalApplicantCostCenterOwner = currentUserProfile.costCenterOwner;



        }

        else {
          this.isExternalApplicant = true;
          this.toa = 'External User';
          this.extApplicantBpNoApplicant = currentUserProfile.bP_Number;
          this.extApplicantCompanyName = currentUserProfile.companyName;
          this.extApplicantCompanyRegNo = currentUserProfile.companyRegNo;
          //this.extApplicantCompanyType = '';
          this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.extApplicantTellNo = currentUserProfile.phoneNumber;
          this.extApplicantEmail = currentUserProfile.email;
          this.extApplicantPhyscialAddress = currentUserProfile.physcialAddress;
          // this.extApplicantIDNumber = ''; todo chage the dto to include the id number


        }

      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);

    })


    this.userPofileService.getUserProfileById(this.CurrentApplicationBeingViewed[0].UserID).subscribe((data: any) => {
      if (data.responseCode == 1) {

        console.log("This is my originator's information, hopefully. Finger's crossed: ", data.dateSet);
        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;
        if (currentUserProfile.isInternal == true) {

            this.toa = 'Internal User';
            this.internalProxyApplicantName = fullname.substring(0, fullname.indexOf(' '));
            this.internalProxyApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
            this.internalProxyApplicantDirectorate = currentUserProfile.directorate;
            this.internalProxyApplicantDepartment = currentUserProfile.departmentName; //not displayed?
            this.internalProxyApplicantTellNo = currentUserProfile.phoneNumber; //not displayed?
            this.internalProxyApplicantBranch = currentUserProfile.branch;
            this.internalProxyApplicantCostCenterNo = currentUserProfile.costCenterNumber;
            this.internalProxyApplicantCostCenterOwner = currentUserProfile.costCenterOwner;
            this.internalProxyApplicant = true;
          }
          else {
            this.toa = 'External User';
            this.extProxyApplicantBpNoApplicant = currentUserProfile.bP_Number;
            this.extProxyApplicantCompanyName = currentUserProfile.companyName;
            this.extProxyApplicantCompanyRegNo = currentUserProfile.companyRegNo;
            this.extProxyApplicantName = fullname.substring(0, fullname.indexOf(' '));
            this.extProxyApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
            this.extProxyApplicantTellNo = currentUserProfile.phoneNumber;
            this.extProxyApplicantEmail = currentUserProfile.email;
            this.extProxyApplicantPhyscialAddress = currentUserProfile.physcialAddress;
            // this.extApplicantIDNumber = ''; todo chage the dto to include the id number
            this.internalProxyApplicant = false;

            // #region icasaDetailsDisplay Sindiswa 16 Janauary 2024
            this.extProxyApplicantCompanyType = currentUserProfile.companyType;
            if (currentUserProfile.icasaLicense) {

              this.isTelecomms = true;
            }
            else {
              this.isTelecomms = false;
            }
            this.extProxyApplicantICASALicense = currentUserProfile.icasaLicense;
            // #endregion icasaDetailsDisplay Sindiswa 16 Janauary 2024
          }




      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })



    if (this.CurrentApplicationBeingViewed[0].CreatedById != this.CurrentApplicationBeingViewed[0].UserID) {
      this.theirProxy = true;
    }
    else {
      this.getUserProfileByUserID();
    }
  }

  getUserProfileByUserID() {
    
    this.userPofileService.getUserProfileById(this.createdByID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        

        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;
        
        if (currentUserProfile.isInternal == true) {
          this.isExternalApplicant = false
          this.toa = 'Internal User';
          this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.internalApplicantDirectorate = currentUserProfile.directorate;
          this.internalApplicantDepartment = currentUserProfile.departmentName;
          this.internalApplicantTellNo = currentUserProfile.phoneNumber;
          this.internalApplicantBranch = currentUserProfile.branch;
          this.internalApplicantCostCenterNo = currentUserProfile.costCenterNumber;
          this.internalApplicantCostCenterOwner = currentUserProfile.costCenterOwner;
          this.isInternal = true;


        }
      
        else {
          this.isExternalApplicant = true;
          this.toa = 'External User';
          this.extApplicantBpNoApplicant = currentUserProfile.bP_Number;
          this.extApplicantCompanyName = currentUserProfile.companyName;
          this.extApplicantCompanyRegNo = currentUserProfile.companyRegNo;
          //this.extApplicantCompanyType = '';

          // #region icasaDetailsDisplay Sindiswa 16 Janauary 2024 - why was the above commented out initially vele?
          this.extApplicantCompanyType = currentUserProfile.companyType;
          if (currentUserProfile.icasaLicense) {
           
            this.isTelecomms = true;
          }
          else {
            this.isTelecomms = false;
          }
          this.extApplicantICASALicense = currentUserProfile.icasaLicense;
          // #endregion icasaDetailsDisplay Sindiswa 16 Janauary 2024

          this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.extApplicantTellNo = currentUserProfile.phoneNumber;
          this.extApplicantEmail = currentUserProfile.email;
          this.extApplicantPhyscialAddress = currentUserProfile.physcialAddress;
          // this.extApplicantIDNumber = ''; todo chage the dto to include the id number
          this.isInternal = false;
          this.isExtApplicantViewer = true;

        }

      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }



  openXl(MFTModal: any) {
    this.modalService.open(MFTModal, { size: 'lg' });
  }

  viewPDF() {
    var pdf = 'http://197.242.150.226/Files/SampleInvoice.pdf';
    window.open(pdf, '_blank');
  }


  buildProjectNumber() {

    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.configNumberOfProject = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {


            this.ChangeApplicationStatusToPaid();
          }
          else {
            //alert("Invalid Email or Password");
            alert(data.responseMessage);
          }
          console.log("addUpdateConfigReponse", data);

        }, error => {
          console.log("addUpdateConfigError: ", error);
        })




      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getConfigsByConfigNameReponse", data);

    }, error => {
      console.log("getConfigsByConfigNameError: ", error);
    })
  }

  onAutoLinkDepartment() {

    this.subDepartmentService.getAllSubDepartmentsForAutoDistribution().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.ApplicationID, data.dateSet[i].subDepartmentID, data.dateSet[i].subDepartmentName, null, null, this.CurrentUser.appUserId, null, null).subscribe((data: any) => {

            if (data.responseCode == 1) {

              //alert(data.dateSet.subDepartmentName + " assigned to this Application");

            }
            else {

              alert(data.responseMessage);
            }
            console.log("reponseAddUpdateDepartmentForComment", data);


          }, error => {
            console.log("Error: ", error);
          })
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponseAddUpdateDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  ChangeApplicationStatusToPaid() {
    
    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Unpaid") {

      this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
        if (data.responseCode == 1) {

          const current = data.dateSet[0];
          this.configNumberOfProject = current.utilitySlot1;
          this.configMonthYear = current.utilitySlot2;
          this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
            if (data.responseCode == 1) {
               //Service Information Kyle 31/01/24                                                                                                                                                                                                                                                                                                                                                                         //Service Information Kyle
              this.applicationsService.addUpdateApplication(this.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, null, null, "Distributed", null, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, this.CurrentApplicationBeingViewed[0].isPlanning, null, this.selectPaidDate).subscribe((data: any) => {
               //Service Information Kyle 31/01/24
                if (data.responseCode == 1) {

                  alert(data.responseMessage);
                  this.notificationsService.sendEmail(this.CurrentUser.email, "Wayleave application payment", "check html", "Dear " + this.CurrentUser.fullName + ",<br><br><p>You have moved application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave to paid. <br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  if (this.CurrentUserProfile[0].alternativeEmail) {
                    this.notificationsService.sendEmail(this.CurrentUser.email, "Wayleave application payment", "check html", "Dear " + this.CurrentUser.fullName + ",<br><br><p>You have moved application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave to paid. <br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  }

                  this.notificationsService.sendEmail(this.CurrentApplicationBeingViewed[0].clientEmail, "Wayleave application payment", "check html", "Dear " + this.CurrentApplicationBeingViewed[0].clientName + ",<br><br><p>Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been paid. You will be notified once your application has reached the next stage in the process.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  if (this.CurrentApplicationBeingViewed[0].clientAlternativeEmail) { 
                    this.notificationsService.sendEmail(this.CurrentApplicationBeingViewed[0].clientAlternativeEmail, "Wayleave application payment", "check html", "Dear " + this.CurrentApplicationBeingViewed[0].clientName + ",<br><br><p>Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been paid. You will be notified once your application has reached the next stage in the process.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  }
                  // #region checkingNotifications Sindiswa 15 February 2024
                  this.notificationsService.addUpdateNotification(0, "Wayleave applicant payment ", "Wayleave applicant payment ", false, this.CurrentApplicationBeingViewed[0].UserID, this.ApplicationID, this.CurrentUser.appUserId, "Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been paid. You will be notified once your application has reached the next stage in the process."  ).subscribe((data: any) => {

                    if (data.responseCode == 1) {


                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });

                  this.notificationsService.addUpdateNotification(0, "Wayleave applicant payment ", "Wayleave applicant payment ", false, this.CurrentUser.appUserId, this.ApplicationID, this.CurrentUser.appUserId, "You have moved application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been paid.").subscribe((data: any) => {

                    if (data.responseCode == 1) {


                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });
                  // #endregion

                  //Audit Trail Kyle
                  this.onSaveToAuditTrail("Application moved to Paid");
                  this.onSaveToAuditTrail("Application distributed to Departments");
                  //Audit Trail Kyle

                }
                else {
                  /*          alert(data.responseMessage);*/
                }

                console.log("responseAddapplication", data);

              }, error => {
                console.log("Error", error);
              })
            }
            else {
              //alert("Invalid Email or Password");
              alert(data.responseMessage);
            }
            console.log("addUpdateConfigReponse", data);

          }, error => {
            console.log("addUpdateConfigError: ", error);
          })
          this.MoveToNextStage();
          this.router.navigate(["/home"]);
        }
        else {
          //alert("Invalid Email or Password");
          alert(data.responseMessage);
        }
        console.log("getConfigsByConfigNameReponse", data);

      }, error => {
        console.log("getConfigsByConfigNameError: ", error);
      })

    }

    else {
      alert("Application Status Needs to Be Unpaid");
    }

  }
  

  checkIfPermitExsist() {
    debugger;
    if (this.applicationDataForView[0].CreatedById == this.CurrentUser.appUserId) {
      this.permitBtn = true;
      this.permitTextBox = false;
    }
    if (this.applicationDataForView[0].permitStartDate != null) {
      this.permitBtn = false;
      this.permitTextBox = true;
      this.startDate = this.applicationDataForView[0].permitStartDate.toString();
      this.permitDate = "Permit has been applied, with a start date of: " + this.startDate.substring(0, this.startDate.indexOf('T'));
     
    }
    

  }

  updateStartDateForPermit() {
    this.applicationsService.addUpdateApplication(this.CurrentApplicationBeingViewed[0].applicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.permitStartDate).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.onAutoLinkForPermit();
        this.router.navigate(["/home"]);/*Permit Kyle 13-02-24*/
      }
      else {
        alert(data.responseMessage);
      }
      alert(data.responseMessage);
      console.log("IT HAS SAVED THE START DATE DIJFNSJKFNKLSDNFKSDJFNLKSDJFNLKDJFNLKSDJNFLKSJDFNLKJSDFNLKJDFBKLN MNLZXCZXNLZKXNCLKJDNLIFNDSLJIFND FUISDHFISDUFHSID UFHISDUFHSDJFHNSDJKFNSLD FJNS DKF", data);
      this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
      this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);
      this.checkIfPermitExsist();
    }, error => {
      console.log("Error: ", error);
    })
  }

  openPermitModal(permitModal: any) {

    this.modalService.open(permitModal, { size: 'lg' });
  }

  openPaidDate(paidDateModal: any) {

    this.modalService.open(paidDateModal, { size: 'lg' });
  }

  MoveToNextStage() {


    //alert("ChangeApplicationStatusToPaid");

    /* if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Paid") {*/
    this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, "Distributed").subscribe((data: any) => {

      if (data.responseCode == 1) {
        // this.onAutoLinkDepartment();
        alert("Application Moved to Distributed");
        // this.router.navigate(["/home"]);

      }
      else {
        alert(data.responseMessage);
      }
      console.log("responseAddapplication", data);
    }, error => {
      console.log("Error", error);
    })

    //}

    //else if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[2].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Distributing") {

    //}
    //else {
    //  alert("Application Status Is Not Paid");
    //}


  }
  // #region reapply Sindiswa 22 January 2024
  moveToClosed() {

    const isConfirmed = confirm("Are you sure you want to close this application?");

    if (isConfirmed) {
      this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, "Closed", 6, null, null, "Closed").subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert("Application Moved to Closed");

        }
        else {
          alert(data.responseMessage);
        }
        console.log("response closing application", data);
      }, error => {
        console.log("Error closing application", error);
      })
    }
  }

  deleteApplication() {
   
    const isConfirmed = confirm("Are you sure you want to delete this application?");
  
    if (isConfirmed) {
      this.applicationsService.deleteApplication(this.CurrentApplicationBeingViewed[0].applicationID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert("This application has been deleted.");
        } else {
          alert(data.responseMessage);
        }
        console.log("response deleting application: ", data);
      }, error => {
        console.log("Error deleting application", error);
      });
    }
  }
  // #endregion

  setInterface() {


    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        console.log("data", data.dateSet);
        
        const currentUserProfile = data.dateSet[0];
        this.depID = currentUserProfile.departmentID;
        this.getUserDep();
        if (currentUserProfile.isInternal == true) {

          this.isInternalUser = true;

        }
        else {
          this.isInternalUser = false;

        }

      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  /*CREATING THE APPROVAL PACK*/

  getUserDep() {

    if (this.depID != null) {


      this.subDepartmentService.getSubDepartmentsByDepartmentID(this.depID).subscribe((data: any) => {


        if (data.responseCode == 1) {
          
          for (var i = 0; i < data.dateSet.length; i++) {
            const tempSubDepartmentList = {} as SubDepartmentList;
            
            const current = data.dateSet[i];
            this.subDepNameForClarify = current.subDepartmentName.replace(/\r?\n|\r/g, '');
            tempSubDepartmentList.subDepartmentID = current.subDepartmentID;


            this.SubDepartmentsList.push(tempSubDepartmentList);


          }

          console.log("THIS IS THE CUB DEP THAT HAS APPROVED THE APPLICATION CONDITIONALLY", this.subDepNameForClarify);
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

  getAllCommentsForSpecialConditions() {
    
    console.log("This is all the special comments from the subdepartments", this.ApplicationID);
    this.commentsService.getCommentsForSpecialConditions(this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepCommentsForSpecialConditions;

          const current = data.dateSet[i];
/*JJS Commit 20-02-24*/
          if (current.comment != null) {


            tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;


            
            let SubName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
            tempSubDepCommentStatusList.SubDepName = SubName + " : " + current.zoneName;
            tempSubDepCommentStatusList.ApplicationID = current.applicationID;
            if (current.commentStatus == 'Approved' || current.commentStatus == 'Provisionally Approved') {
              tempSubDepCommentStatusList.Comment = "Reviewer Comment : \n" + current.comment;
            }
            if (current.commentStatus == 'Final Approved') {
              tempSubDepCommentStatusList.Comment = "Final Approver Comment : \n" + current.comment;
            }

            tempSubDepCommentStatusList.DateCreated = current.dateCreated;


            tempSubDepCommentStatusList.UserName = current.userName;
            this.SubDepCommentsForSpecialConditions.push(tempSubDepCommentStatusList);
          }
          else {

          }

        }
        this.onCreateApprovalPack();
        console.log("This is all the special comments from the subdepartments", data.dateSet);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllSubDepFroConditionalApprove() {
    
    let commentS = "Approved";

    this.commentsService.getSubDepByCommentStatus(commentS, this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepConditionalApproveList;

          const current = data.dateSet[i];
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          tempSubDepCommentStatusList.CommentStatus = current.commentStatus;
          tempSubDepCommentStatusList.UserName = current.userName;
          this.SubDepConditionalApproveList.push(tempSubDepCommentStatusList);


        }
        this.getAllCommentsForSpecialConditions()

        console.log("THIS IS THE CUB DEP THAT HAS APPROVED THE APPLICATION CONDITIONALLY", data.dateSet);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })



  }

  getContactDetails() {

    
    this.ContactDetailsList.splice(0, this.ContactDetailsList.length);
    this.contactDetails.getAllContactDetials().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempContactDetailsList = {} as ContactDetailsList;
          const current = data.dateSet[i];
          console.log("getContactDetailsgetContactDetailsgetContactDetailsgetContactDetailsgetContactDetailsgetContactDetails ", current);
          tempContactDetailsList.ContactDetailID = current.contactDetailID;
          tempContactDetailsList.FullName = current.fullName;
          tempContactDetailsList.CellNo = current.cellNo;
          tempContactDetailsList.Email = current.email;
          tempContactDetailsList.ZoneID = current.zoneID;
          tempContactDetailsList.SubDepName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempContactDetailsList.ZoneName = current.zoneName
          this.ContactDetailsList.push(tempContactDetailsList);

        }

        this.getAllSubDepForFinalApprove();

        console.log("ContactDetailsList", this.ContactDetailsList);
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllSubDepForFinalApprove() {

    let commentS = "Final Approved";

    this.commentsService.getSubDepByCommentStatus(commentS, this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepFinalApproveList;

          const current = data.dateSet[i];
          console.log("FINAL APPROVED THE APPLICATION ", current);
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          if (current.commentStatus == "Final Approved") {
            tempSubDepCommentStatusList.CommentStatus = "Approved";
          }
          tempSubDepCommentStatusList.UserName = current.userName;

          this.SubDepFinalApproveList.push(tempSubDepCommentStatusList);


        }

        this.getAllSubDepFroConditionalApprove();

        console.log("THIS IS THE CUB DEP THAT HAS Final APPROVED THE APPLICATION ", this.SubDepFinalApproveList);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  getAllSubDepForReject() {
 
    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
 
      
      if (data.responseCode == 1) {
        
        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepSubDepRejectList;
          
          const current = data.dateSet[i];
          
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          tempSubDepCommentStatusList.CommentStatus = current.commentStatus;

          this.SubDepSubDepRejectList.push(tempSubDepCommentStatusList);


        }

        console.log("THIS IS THE CUB DEP THAT HAS REJECTED THE APPLICATION ", data.dateSet);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  getApplicationDetailsForDocs() {
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    const setValues = this.applicationDataForView[0];

    this.typeOfApp = (setValues.TypeOfApplication);
    this.NotificationNumber = (setValues.NotificationNumber);
    this.WBSNumber = (setValues.WBSNumber);
    this.PhysicalAddressOfProject = (setValues.PhysicalAddressOfProject);
    this.DescriptionOfProject = (setValues.NatureOfWork);
    this.NatureOfWork = (setValues.NatureOfWork);
    this.ExcavationType = (setValues.ExcavationType);
    this.ProjectNum = (setValues.ProjectNumber);
    this.clientName = (setValues.clientName);
    if (setValues.DatePaid != null) {
      this.datePaid = (setValues.DatePaid).toString();
      this.Paid = this.datePaid.substring(0, this.datePaid.indexOf('T'));
      if (this.Paid != null) {
        this.ExternalPaid = true;
      }
      else {
        this.ExternalPaid = false;
      }
    }
    else {

    }

  }



    //JJS Approval Pack and rejection pack 25Jan2024




  onCreateApprovalPack() {





    /*    this.getAllSubDepFroConditionalApprove();*/


    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    /*    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;*/

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Status',
        'Approved By:',
      ]
    ];


    const Page3headers = [
      [
        'Department',
        'Region',
        'Full Name',
        'Email',
        'Number',
      ]
    ];

    const data: any[] = [];

    const img = new Image();
    const footer = new Image();
    const footer2 = new Image();
    const page1 = new Image();
    const page2 = new Image();
    const page3 = new Image();
    const page4 = new Image();
    const page5 = new Image();
    const page6 = new Image();
    const page7 = new Image();
    const page8 = new Image();
    const page9 = new Image();
/*    const page10 = new Image();
    const page11 = new Image();
    const page12 = new Image();
    const page13 = new Image();
    const page14 = new Image();
    const page15 = new Image();
    const page16 = new Image();
    const page17 = new Image();
    const page18 = new Image();
    const page19 = new Image();
    const page20 = new Image();
    const page21 = new Image();
    const page22 = new Image();
    const page23 = new Image();
    const page24 = new Image();
    const page25 = new Image();
    const page26 = new Image();
    const page27 = new Image();
    const page28 = new Image();
    const page29 = new Image();
    const page30 = new Image();
    const page31 = new Image();
    const page32 = new Image();
    const page33 = new Image();
    const page34 = new Image();
    const page35 = new Image();
    const page36 = new Image();
    const page37 = new Image();
    const page38 = new Image();
    const page39 = new Image();
    const page40 = new Image();
    const page41 = new Image();
    const page42 = new Image();
    const page43 = new Image();
    const page44 = new Image();
    const page45 = new Image();*/

    img.src = 'assets/cctlogoblackk.png';
    footer2.src = 'assets/Packs/footer2.png';
    footer.src = 'assets/Packs/base.jpg';
    page1.src = 'assets/Packs/Updated/24Jan2024/1.png';
    page2.src = 'assets/Packs/Updated/24Jan2024/2.png';
    page3.src = 'assets/Packs/Updated/24Jan2024/3.png';
    page4.src = 'assets/Packs/Updated/24Jan2024/4.png';
    page5.src = 'assets/Packs/Updated/24Jan2024/5.png';
    page6.src = 'assets/Packs/Updated/24Jan2024/6.png';
    page7.src = 'assets/Packs/Updated/24Jan2024/7.png';
    page8.src = 'assets/Packs/Updated/24Jan2024/8.png';
    page9.src = 'assets/Packs/Updated/24Jan2024/9.png';
/*    page10.src = 'assets/Packs/Updated/19October2023Update/10.jpg';
    page11.src = 'assets/Packs/Updated/19October2023Update/11.jpg';
      page12.src = 'assets/Packs/Updated/12.PNG';*/


    doc.addFont('assets/century-gothic/CenturyGothic.ttf', 'CustomFont', 'normal');
    doc.addFont('assets/century-gothic/GOTHICB0.TTF', 'CustomFontBold', '', 'bold');
    doc.setFont('CustomFont', 'normal');



    // Add logo to PDF document
    doc.addImage(img, 'png', 6, 10, 50, 16);

    // Set font for specific text
    doc.setFontSize(10); // Increase font size for specific text

    // Add text with various formatting
    /*  doc.setFont('CustomFontBold','bold');*/ // Use your custom font
    doc.setFont('CustomFont', 'normal');
    doc.text('Cape Town Civic Centre', 200, 17, { align: 'right' });

    doc.text('12 Hertzog Boulevard', 200, 22, { align: 'right' });

    doc.text('CAPE TOWN 8000', 200, 27, { align: 'right' });

    // Set font back to regular

    doc.setFontSize(10); // Return to the regular font size
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('Website:', 147, 35, { align: 'right' });

    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.setTextColor(0, 88, 112); // Set text color to #005870

    // Use the 'decoration' property to add an underline


    doc.textWithLink('https://www.capetown.gov.za', 200, 35, { align: 'right', lineHeightFactor: 1.5 });

    doc.setTextColor(0, 0, 0); // Set text color to #005870
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('Portal:', 138, 40, { align: 'right' });


    doc.setTextColor(0, 88, 112); // Set text color to #005870

    // Use the 'decoration' property to add an underline

    doc.textWithLink('https://wayleave.capetown.gov.za/', 200, 40, { align: 'right' });
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.setTextColor(0, 0, 0); // Set text color to #005870

    doc.text('Reference Number: ' + this.ProjectNum, 200, 50, { align: 'right' });
    doc.setFont('CustomFont', 'normal');
    // Add extra space
    doc.text('', 10, 55); // Add an empty line for spacing

    doc.setFontSize(10); // Restore the regular font size

    // Adding information underneath the logo
    doc.text('DATE : ' + this.formattedDate, 10, 60, { align: 'left' });

    doc.text('WAYLEAVE APPLICATION: ' + this.DescriptionOfProject, 10, 70, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });

    doc.text('Dear ' + this.clientName, 10, 84, { align: 'left' });


    //this is for the project details

    //paragraph 

    doc.text('A summary of the outcome of this wayleave application is provided below. Department specific wayleave approval or rejection letters are attached. In the case of a wayleave rejection, please make contact with the relevant line department as soon as possible', 10, 95, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('Status Summary:', 10, 115, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'normal');

    this.SubDepFinalApproveList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.CommentStatus,
        deposit.UserName,

      ];
      data.push(row);
    });
    doc.setLineHeightFactor(60);
    doc.setFontSize(10); // add this line to set the font size

    doc.text("Based on the summary above, the wayleave application is approved. Kindly proceed to apply for a permit to work before commencement of any work on site.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });//
    doc.setFontSize(12);
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('CITY OF CAPE TOWN', 10, 240, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'italic');
    doc.text('Future Planning and Resilience Directorate', 10, 245, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });

    autoTable(doc, {
      head: headers,
      headStyles: { fillColor: '#005870' },
      startY: 120,
      body: data,
      styles: {
        overflow: 'visible',
        halign: 'left',
        fontSize: 8,
        valign: 'middle',
        // Use the correct color notation here
      },
      columnStyles: {
        0: { cellWidth: 90,  },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
      }
    });
    //Special conditions page
    doc.addPage();
    
    doc.addFont('assets/century-gothic/CenturyGothic.ttf', 'CustomFont', 'normal');
    doc.addFont('assets/century-gothic/GOTHICB0.TTF', 'CustomFontBold', '', 'bold');
    doc.setFont('CustomFontBold', 'bold');
   
    doc.setFontSize(16);
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.setTextColor(0, 88, 112); // Set text color to #005870
    doc.text('SPECIAL CONDITIONS', 10, 18, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify', });
    doc.setTextColor(0, 0, 0); // Set text color to #005870
    console.log(this.SubDepCommentsForSpecialConditions);

    // Process comments and organize by sub-department
    const subDepCommentsMap = new Map();
    this.SubDepCommentsForSpecialConditions.forEach((deposit) => {
      if (subDepCommentsMap.has(deposit.SubDepName)) {
        console.log(`Adding comment to existing sub-department: ${deposit.SubDepName}`);
        subDepCommentsMap.get(deposit.SubDepName).push(deposit.Comment);
      } else {
        console.log(`Creating new entry for sub-department: ${deposit.SubDepName}`);
        subDepCommentsMap.set(deposit.SubDepName, [deposit.Comment]);
      }
    });

    console.log(subDepCommentsMap);

    let yOffset = 40; // Starting Y-coordinate for the list
    let currentPage = 2;
    let maxPageHeight = doc.internal.pageSize.height - 4; // Adjust as needed

    const headerHeight = 30; // Height of the header (image and project number)
    const footerHeight = 25; // Height of the footer

    // Initialize variables to track available space and Y-coordinate
    let remainingPageSpace = maxPageHeight - yOffset - footerHeight;

    subDepCommentsMap.forEach((comments, subDepName) => {
      doc.setFontSize(12);
      doc.setFont('CustomFontBold', 'bold');

      // Check if there's enough space for sub-department name and comments on the current page
      const subDepHeight = doc.getTextDimensions(subDepName).h + 10; // Additional padding
      if (yOffset + subDepHeight > maxPageHeight - footerHeight) {
        doc.addPage();
        currentPage++;
        yOffset = headerHeight; // Reset the Y-coordinate for the new page, leaving space for the header
        remainingPageSpace = maxPageHeight - yOffset - footerHeight;
      }

      doc.text(subDepName, 10, yOffset, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });
      yOffset += subDepHeight; // Update Y-coordinate

      doc.setFontSize(10);
      doc.setFont('CustomFont', 'normal');

      // Combine and join the comments for the same sub-department name
      const combinedComments = comments.join('\n');

      // Check if there's enough space for comments on the current page
      const commentDimensions = doc.getTextDimensions(combinedComments);
      if (commentDimensions.h > remainingPageSpace) {
        doc.addPage();
        currentPage++;
        yOffset = headerHeight; // Reset the Y-coordinate for the new page, leaving space for the header
        remainingPageSpace = maxPageHeight - yOffset - footerHeight;
      }

      const originalFontSize = doc.getFontSize(); // Store the original font size
      doc.setFontSize(8); // Set a smaller font size for comments

      // Handle text wrapping for comments
      const lineHeight = 1.2; // Adjust the line height as needed
      const lineHeightFactor = doc.getLineHeightFactor();
      doc.setLineHeightFactor(lineHeightFactor);

      // Handle text wrapping for comments with reduced line spacing
      let commentLines = doc.splitTextToSize(combinedComments, 190);

      for (const line of commentLines) {
        if (yOffset + doc.getTextDimensions(line).h > maxPageHeight - footerHeight) {
          doc.addPage();
          currentPage++;
          yOffset = headerHeight; // Reset the Y-coordinate for the new page, leaving space for the header
          remainingPageSpace = maxPageHeight - yOffset - footerHeight;
        }
        
        // Check if the sub-department commentStatus is Approved or Provisionally Approved
        if (comments.length > 0 && comments[0].commentStatus === 'Approved' || comments[0].commentStatus === 'Provisionally Approved' || comments[0].commentStatus === 'Approved(Conditional)') {
          // Display Approver Comment heading
          doc.setFont('CustomFontBold', 'bold');
          doc.text('Reviewer Comment:', 10, yOffset, { maxWidth: 190, align: 'left' });
          yOffset += doc.getTextDimensions('Reviewer Comment:').h + 2;

          // Display the comment
          doc.setFont('CustomFont', 'normal');
          doc.text(line, 10, yOffset, { maxWidth: 190, align: 'left' });
          yOffset += doc.getTextDimensions(line).h + 5; // Adjust the line spacing here

          // Display Final Approver heading
          doc.setFont('CustomFontBold', 'bold');
          doc.text('Final Approver:', 10, yOffset, { maxWidth: 190, align: 'left' });
          yOffset += doc.getTextDimensions('Final Approver:').h + 2;

          // Display the final approver comment
          doc.setFont('CustomFont', 'normal');
          doc.text(comments[0].finalApproverComment, 10, yOffset, { maxWidth: 190, align: 'left' });
          yOffset += doc.getTextDimensions(comments[0].finalApproverComment).h + 5; // Adjust the line spacing here
        } else {
          // If not Approved or Provisionally Approved, display regular comments
          doc.text(line, 10, yOffset, { maxWidth: 190, align: 'left' });
          yOffset += doc.getTextDimensions(line).h + 5; // Adjust the line spacing here
        }

        remainingPageSpace -= doc.getTextDimensions(line).h + 5;
      }

      // Restore the original font size
      doc.setFontSize(originalFontSize);
      // Reset the line height
      doc.setLineHeightFactor(1.5); // Reset to the original line height

      // Add a line separator
      doc.setLineWidth(0.2);
      yOffset += 5;
      doc.line(10, yOffset, 200, yOffset);
      yOffset += 20;
    });
    // Optionally, you can add a page count in the footer
    


    //Contact information Page
    /*    doc.addPage();
          
        doc.setFontSize(10);
        doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });
        doc.setFontSize(16);
        doc.text('Contact Details', 10, 45, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
        
        const uniqueZoneIDs = [...new Set(this.SubDepartmentListFORAPPROVAL.map(item => item.zoneID))];
    
        // Create an array to hold the filtered contact details for matching zone IDs
        const filteredContacts = [];
    
        // Loop through each unique zone ID
        uniqueZoneIDs.forEach(targetZoneID => {
          // Filter the ContactDetailsList array based on the current zone ID
          const matchingContacts = this.ContactDetailsList.filter(deposit => deposit.ZoneID === targetZoneID);
    
          // Add the matching contacts to the filteredContacts array
          filteredContacts.push(...matchingContacts);
        });
        
        // Create the table data for the filtered contact details
        const page3Data = filteredContacts.map(deposit => [
          deposit.SubDepName,
          deposit.ZoneName,
          deposit.FullName,
          deposit.Email,
          deposit.CellNo,
        ]);
    
        autoTable(doc, {
          head: Page3headers,
          startY: 60,
          body: page3Data,
          styles: {
            overflow: 'visible',
            halign: 'justify',
            fontSize: 8,
            valign: 'middle',
          },
          columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 25 },
            2: { cellWidth: 30 },
            3: { cellWidth: 35 },
            4: { cellWidth: 30 },
          }
        });
    
    
    
    
        doc.addImage(footer, 'png', 7, 255, 205, 45);
    */
    //PAGE 1
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page1, 'png', 0, 0, 210, 297); // Full A4 size

    /*    doc.addImage(footer, 'png', 7, 255, 205, 45);*/

    //PAGE 2
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);


    doc.addImage(page2, 'png', 0, 0, 210, 297);




    //PAGE 3
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page3, 'png', 0, 0, 210, 297);



    //PAGE 4
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page4, 'png', 0, 0, 210, 297);



    //PAGE 5
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page5, 'png', 0, 0, 210, 297);



    //PAGE 6
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page6, 'png', 0, 0, 210, 297);



    //PAGE 7
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page7, 'png', 0, 0, 210, 297);
 


    //PAGE 8
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);


    doc.addImage(page8, 'png', 0, 0, 210, 297);
 


    //PAGE 9
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page9, 'png', 0, -2, 210, 297);



/*    //PAGE 10
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page10, 'jpg', 0, 0, 210, 297);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    //PAGE 11
    doc.addPage();
    currentPage++;
      
    doc.setFontSize(10);



    doc.addImage(page11, 'jpg', 0, 0, 210, 297);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });*/


  

    // Save PDF document
    for (let i = 0; i <= currentPage; i++) {
      doc.setPage(i);

      doc.setFontSize(10);
   
      doc.addImage(footer2, 'png', 0, 0, 210, 297);
      doc.text("Page " + i + " of " + currentPage, 100, 285, { align: 'center' });
    }

    // Reset the page to the last page

    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'approval_pack.pdf', { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', file);

    this.sharedService.pushFileForTempFileUpload(file, "Approval Pack" + ".pdf");
    this.save();

  }


  response: { dbPath: ''; } | undefined
  progress: number = 0;
  message = '';
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  save() {

    const filesForUpload = this.sharedService.pullFilesForUpload();
    for (let i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.ApplicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);

      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinished(event.body);
            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }

  }





  uploadFinished = (event: any) => {
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, "System Generated Pack", "System Generated Pack").subscribe((data: any) => {
      /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {

        console.log(this.StagesList);
        
        this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, this.StagesList[4].StageName, this.StagesList[4].StageOrderNumber, this.StagesList[5].StageName, this.StagesList[5].StageOrderNumber, "PTW Pending").subscribe((data: any) => {

          if (data.responseCode == 1) {

            this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.projectNo, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>Please apply for a permit to work.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
            if (this.applicationData.clientAlternativeEmail) { //checkingNotifications Sindiswa 15 February 2024
              this.notificationsService.sendEmail(this.applicationData.clientAlternativeEmail, "Wayleave Application #" + this.projectNo, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>Please apply for a permit to work.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
            }
            this.modalService.dismissAll();
            //Audit Trail Kyle
            this.onSaveToAuditTrail("Approval Pack Downloaded");
            this.onSaveToAuditTrail("Application moved to PTW Stage");
            //Audit Trail Kyle
            alert("Application moved to PTW. You may now apply for permit.");
            this.router.navigate(["/home"]);
            
          }
          else {
            alert(data.responseMessage);
          }
          console.log("responseAddapplication", data);
        }, error => {
          console.log("Error", error);
        })

      }

    }, error => {
      console.log("Error: ", error);
    })


  }
  //fileAttrs: string[] = [];










  onCrreateRejectionPack() {



    this.getAllSubDepForReject();

    /*    this.getAllSubDepFroConditionalApprove();*/


    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    /*    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;*/

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Status',
      ]
    ];


   

    const data: any[] = [];

    const img = new Image();
    const footer = new Image();
    const footer2 = new Image();


    img.src = 'assets/cctlogoblackk.png';
    footer2.src = 'assets/Packs/footer2.png';
    footer.src = 'assets/Packs/base.jpg';



    doc.addFont('assets/century-gothic/CenturyGothic.ttf', 'CustomFont', 'normal');
    doc.addFont('assets/century-gothic/GOTHICB0.TTF', 'CustomFontBold', '', 'bold');
    doc.setFont('CustomFont', 'normal');



    // Add logo to PDF document
    doc.addImage(img, 'png', 6, 10, 50, 16);

    // Set font for specific text
    doc.setFontSize(10); // Increase font size for specific text

    // Add text with various formatting
    /*  doc.setFont('CustomFontBold','bold');*/ // Use your custom font
    doc.setFont('CustomFont', 'normal');
    doc.text('Cape Town Civic Centre', 200, 17, { align: 'right' });

    doc.text('12 Hertzog Boulevard', 200, 22, { align: 'right' });

    doc.text('CAPE TOWN 8000', 200, 27, { align: 'right' });

    // Set font back to regular

    doc.setFontSize(10); // Return to the regular font size
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('Website:', 147, 35, { align: 'right' });

    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.setTextColor(0, 88, 112); // Set text color to #005870

    // Use the 'decoration' property to add an underline


    doc.textWithLink('https://www.capetown.gov.za', 200, 35, { align: 'right', lineHeightFactor: 1.5 });

    doc.setTextColor(0, 0, 0); // Set text color to #005870
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('Portal:', 138, 40, { align: 'right' });


    doc.setTextColor(0, 88, 112); // Set text color to #005870

    // Use the 'decoration' property to add an underline

    doc.textWithLink('https://wayleave.capetown.gov.za/', 200, 40, { align: 'right' });
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.setTextColor(0, 0, 0); // Set text color to #005870

    doc.text('Reference Number: ' + this.ProjectNum, 200, 50, { align: 'right' });
    doc.setFont('CustomFont', 'normal');
    // Add extra space
    doc.text('', 10, 55); // Add an empty line for spacing

    doc.setFontSize(10); // Restore the regular font size

    // Adding information underneath the logo
    doc.text('DATE : ' + this.formattedDate, 10, 60, { align: 'left' });

    doc.text('WAYLEAVE APPLICATION: ' + this.DescriptionOfProject, 10, 70, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });

    doc.text('Dear ' + this.clientName, 10, 80, { align: 'left' });


    //this is for the project details

    //paragraph 

    doc.text('A summary of the outcome of this wayleave application is provided below. Department specific wayleave approval or rejection letters are attached.In the case of a wayleave rejection, please make contact with the relevant line department as soon as possible', 10, 90, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('Status Summary:', 10, 115, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'normal');
    
    this.SubDepSubDepRejectList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.CommentStatus,

      ];
      data.push(row);
    });
    doc.setLineHeightFactor(60);
    doc.setFontSize(10); // add this line to set the font size

    doc.text("Based on the summary above, the wayleave application is rejected. Please contact the relevant department for guidance on the way forward.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });//
    doc.setFontSize(12);
    doc.setFont('CustomFontBold', 'bold'); // Use your custom font
    doc.text('CITY OF CAPE TOWN', 10, 240, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'italic');
    doc.text('Future Planning and Resilience Directorate', 10, 245, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });

    autoTable(doc, {
      head: headers,
      headStyles: { fillColor: '#005870' },
      startY: 120,
      body: data,
      styles: {
        overflow: 'visible',
        halign: 'justify',
        fontSize: 8,
        valign: 'middle',
        // Use the correct color notation here
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 70 },

      }
    });
    //Special conditions page
  

    // Save PDF document
   

    // Reset the page to the last page

    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'rejection_pack.pdf', { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', file);

    this.sharedService.pushFileForTempFileUpload(file, "Rejection Pack" + ".pdf");
    this.saveRejection();

  }



  saveRejection() {

    const filesForUpload = this.sharedService.pullFilesForUpload();
    for (let i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.ApplicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);

      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinishedRejection(event.body);
            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }

  }





  uploadFinishedRejection = (event: any) => {
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, "System Generated Pack", "System Generated Pack").subscribe((data: any) => {
      /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {

        console.log(this.StagesList);

       

         

         
            this.modalService.dismissAll();
            this.router.navigate(["/home"]);

        

      }

    }, error => {
      console.log("Error: ", error);
    })


  }





  /*onCrreateRejectionPack() {





    this.getAllSubDepForReject();
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Comment',
        'Status'
      ]
    ];
    const data: any[] = [];

    const img = new Image();
    const footer = new Image();

    img.src = 'assets/cctlogoblack.png';
    footer.src = 'assets/Packs/footer.PNG';



    // Add logo to PDF document

    // Add logo to PDF document
      
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });
    //adding information underneath the logo

    doc.text('DATE : ' + this.formattedDate, 10, 45, { align: 'left' });

    doc.text('WAYLEAVE APPLICATION : ' + this.DescriptionOfProject, 10, 55, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });

    doc.text('Dear ' + this.clientName, 10, 70, { align: 'left' });

    //this is for the project details

    //paragraph 
    doc.setFontSize(10);
    doc.text('Kindly find a summary on the outcome of this wayleave application below as well as departmental specific wayleave approval or rejection letters attached. In the case of a wayleave rejection, please make contact with the relevant Line Department as soon as possible. ', 10, 80, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.text('Status Summary:', 10, 105, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });


    this.SubDepSubDepRejectList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.Comment,
        deposit.CommentStatus,
      ];

      data.push(row);
    });
    doc.setLineHeightFactor(60);
    doc.setFontSize(10); // add this line to set the font size

    doc.text("Based on the summary above, the wayleave application is rejected. Please contact the relevant department for guidance on the way forward.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFontSize(12);
    doc.text("CITY OF CAPE TOWN, Future Planning and Resilience Directorate", 10, 220, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.addImage(footer, 'png', 7, 255, 205, 45);


    autoTable(doc, {
      head: headers,

      startY: 120,
      body: data,
      styles: {
        overflow: 'visible',
        halign: 'justify',
        fontSize: 10,
        valign: 'middle',

      },

      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
      }


    });



    // Save PDF document
    doc.save('Rejection Pack:' + this.CurrentUser.userProfileID);

  }*/

  // #region reapply Sindiswa 22 January 2024
  goToNewWayleave(applicationType: boolean) { //application type refers to whether it is a brand new application or if it is a reapply.
    

    this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.ReApplyCount = data.dateSet[0].reApplyCount !== null ? data.dateSet[0].reApplyCount : 0; //wait, did I just reinvent the wheel?

          console.log(`This is the reapply count: ${this.ReApplyCount}`);
       
        if (this.ReApplyCount < 4) {

          if (this.ReApplyCount != 0) {
            alert(`You have already re-applied ${this.ReApplyCount -1} time(s).`);
          }
          const confirm = window.confirm('Are you sure you want to reapply and edit the details of this application?');

          if (confirm) {
            this.sharedService.setApplicationID(this.ApplicationID); //reapply Sindiswa 22 January 2024
            this.sharedService.setOldApplicationID(this.ApplicationID); //reapply Sindiswa 24 January 2024
            this.sharedService.setReapply(applicationType);
            this.NewWayleaveComponent.onWayleaveCreate(this.CurrentUser.appUserId, false, false);
            //console.log("Test: " + this.sharedService.getApplicationID())
            /*        this.router.navigate(["/new-wayleave"]);*/
            this.viewContainerRef.clear();
          }
        }
        else {
          alert("You have depleted all your reapplication attempts and can no longer reapply");
        }
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse while trying to reapply", data);

    }, error => {
      console.log("Error while trying to reapply: ", error);
    })

    /*const confirm = window.confirm('Are you sure you want to reapply and edit the details of this application?');

    if (confirm) {
      this.sharedService.setApplicationID(this.ApplicationID); //reapply Sindiswa 22 January 2024
      this.sharedService.setOldApplicationID(this.ApplicationID); //reapply Sindiswa 24 January 2024
      this.sharedService.setReapply(applicationType);
      this.NewWayleaveComponent.onWayleaveCreate(this.CurrentUser.appUserId, false, false);
      //console.log("Test: " + this.sharedService.getApplicationID())
      //        this.router.navigate(["/new-wayleave"]);
      this.viewContainerRef.clear();
    }*/
  }

  // #endregion




  /*WBS Number*/
  enterWBSNumberModal(wbsNumberModal: any) {
    this.modalService.open(wbsNumberModal, { backdrop: 'static', size: 'xl' });
  }


  onCreateWBSNumber() {

    let WBS = this.addWBSNumber.controls["wbsnumber"].value;

    this.applicationsService.addUpdateApplication(this.ApplicationID, null, null, null, null, null, null, null, null, null, null, WBS, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert("Updated Applications WBS");
        alert(data.responseMessage);


      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }



  reciveOption($event: any) {

    this.option = $event
    if (this.option == "True") {
      this.wbsButton = true;
    }
    else if (this.option == "False") {
      this.wbsButton = false;
    }
  }
  countApprove = 0;
  countReject = 0;
  wbsBtn: boolean = false;

  getLinkedDepartments() {


    const currentApplication = this.sharedService.getViewApplicationIndex();



    this.subDepartmentForCommentService.getSubDepartmentForComment(currentApplication.applicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (var i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];

          const tempSubDepartmentList = {} as SubDepartmentList;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          tempSubDepartmentList.isAwaitingClarity = current.isAwaitingClarity;
          tempSubDepartmentList.IsRefered = current.IsRefered;
          tempSubDepartmentList.commentStatus = current.commentStatus;

          if (tempSubDepartmentList.commentStatus == "Approved(Conditional)") {
            this.countApprove++;
            this.wbsBtn = true;
          }
          if (tempSubDepartmentList.commentStatus == "Rejected") {
            this.countReject++;
          }
          //Permit Kyle 13-02 - 24
          if (tempSubDepartmentList.subDepartmentName == this.CurrentUserProfile[0].subDepartmentName && current.zoneName == this.CurrentUserProfile[0].zoneName) {
            this.canCreateNote = true;
          }

          
          this.SubDepartmentList.push(tempSubDepartmentList);
        }

        this.checkIfApprovedOrRejected();
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }

  checkIfApprovedOrRejected() {
    if (this.countApprove == this.SubDepartmentList.length) {
      // alert("ALL FINAL APPROVED");
    }
    if (this.countReject > 0 ) {

    }
  }

  showApproveOrReject() {
    for (var i = 0; i < this.SubDepartmentList.length; i++) {
      if (this.SubDepartmentList[i].commentStatus == "Approved(Conditional)" || this.SubDepartmentList[i].commentStatus == "Approved") {
        this.ApprovalPackBtn = true;
      }
      else {
        this.RejectionPackBtn = true;
      }
    }

  }

  //JJS - TODO :Bug anyone can move external application to paid, Added the if for the EMB users so that only they can move the applicant to paid

  getRolesLinkedToUser() {

    this.RolesList.splice(0, this.RolesList.length);

    this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.AccessGroupName = current.accessGroupName;
          tempRolesList.AccessGroupID = current.accessGroupID;
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;

          this.RolesList.push(tempRolesList);
          if (tempRolesList.RoleName == "Applicant") {
            this.InternalExternalUser = true;
          }

          if (tempRolesList.RoleName == "EMB" || this.CurrentUserProfile[0].departmentName == "EMB") {
           
            this.EMB = true;
          }
          this.lockViewAccordingToRoles();


        }

        // this.rolesTable?.renderRows();
        console.log("getAllLinkedRolesReponse", data.dateSet);
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })

  }

  lockViewAccordingToRoles() {
    console.log("werwerwerrwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwererwer", this.RolesList);

    for (var i = 0; i < this.RolesList.length; i++) {

      if (this.RolesList[i].RoleName == "EMB") {
        this.auditTrail = true;
      }

      if (this.RolesList[i].RoleName == "Developer Config") {
        this.ApprovalPackBtn = true;
        this.RejectionPackBtn = true;
      }

    }


  }

  /*  UploadDocuments(applicationData: any): void { 
      //Pulling information from the share
      const filesForUpload = this.sharedService.pullFilesForUpload();
      for (var i = 0; i < filesForUpload.length; i++) {
        const formData = new FormData();
        let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
        let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.ApplicationID;
        formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);
  
  
  
        this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
          .subscribe({
            next: (event) => {
  
              if (event.type === HttpEventType.UploadProgress && event.total)
                this.progress = Math.round(100 * event.loaded / event.total);
              else if (event.type === HttpEventType.Response) {
                this.message = 'Upload success.';
                this.uploadFinished(event.body, this.ApplicationID, applicationData);
              }
            },
            error: (err: HttpErrorResponse) => console.log(err)
          });
      }
    }
  
    uploadFinished = (event: any, applicationID: any, applicationData: any) => {
      ;
      this.response = event;
      console.log("this.response", this.response);
      console.log("this.response?.dbPath", this.response?.dbPath);
      console.log("applicationData", applicationData);
  
      const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
      console.log("documentName", documentName);
      this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.userID, this.CurrentUser.appUserId).subscribe((data: any) => {
  
        if (data.responseCode == 1) {
  
        }
  
  
  
  
  
      }, error => {
        console.log("Error: ", error);
      })
  
  
    }*/

  getAllDocsForApplication() {

    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];
          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.DocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.AssignedUserID = current.assignedUserID;



          this.DocumentsList.push(tempDocList);


        }

        this.FinancialListTable?.renderRows();
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

  /*viewDocument(index: any) {

    
    // Make an HTTP GET request to fetch the document
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.FinancialDocumentsList[index].FinancialDocumentName}`)
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

        // Display the document, for example, in an <iframe>
        const iframe = document.createElement('iframe');
        iframe.src = documentURL;
        document.body.appendChild(iframe);
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }*/

  // altered slightly to ensure that a png is downloaded instead of doing iframe tings
  viewDocument(index: any) {
    
    const filename = this.FinancialDocumentsList[index].FinancialDocumentName;
    const extension = filename.split('.').pop().toLowerCase();

    if (extension === 'png') {
      // If the document is a PNG image, initiate download
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${filename}`)
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Error fetching the document');
          }
        })
        .then(blob => {
          // Create a temporary link element to trigger the download
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    } else {
      // For other document types, such as PDF, continue to use an iframe
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${filename}`)
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Error fetching the document');
          }
        })
        .then(blob => {
          const documentURL = URL.createObjectURL(blob);
          const iframe = document.createElement('iframe');
          iframe.src = documentURL;
          document.body.appendChild(iframe);
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    }
  }



  getFinancial() {
    this.FinancialDocumentsList.splice(0, this.FinancialDocumentsList.length);
    this.financial.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as FinancialDocumentsList;
          const current = data.dateSet[i];

          tempDocList.FinancialID = current.financialID;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.CreatedById = current.createdById;
          tempDocList.FinancialDocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.FinancialDocumentName = current.documentName;
          tempDocList.FinancialType = current.financialType;


           //  Financial POP Kyle 15/01/24
          if (tempDocList.FinancialDocumentName.startsWith("Proof Of Payment")) {
            this.uploadedPOP = true;
          }
          this.FinancialDocumentsList.push(tempDocList);

           //  Financial POP Kyle 15/01/24
        }


        this.FinancialListTable?.renderRows();
        console.log("FinancialListTablethis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsList", this.FinancialDocumentsList);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })

  }



  /*Mobile Field Tracking*/
  onPassFileName(event: { uploadFor: string; fileName: string }) {

    const { uploadFor, fileName } = event;
    this.fileAttrsName = "Doc";

    this.hasFile = true;
    this.fileCount = this.fileCount + 1;
  }

  @ViewChild('imageDiv') imageDiv: ElementRef;
 


  saveNote() {
    const mftId = this.fileUploadComponent.MFTID;
    if (this.hasFile || mftId != 0) {
      this.statusOfWorksComponent.getMFTForApplication();
      this.modalService.dismissAll();
      this.mftNote = '';
    }

    else {
      this.MFTService.addUpdateMFT(0, this.mftNote, this.ApplicationID, null, null, this.CurrentUser.appUserId, this.CurrentUser.fullname).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.statusOfWorksComponent.getMFTForApplication();
          this.mftNote = '';
          this.fileUploadComponent.MFTID = 0;
          this.modalService.dismissAll();

        }
      })
    }
  }
  mftNote = '';
   

  uploadFinishedNotes(event) {

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.MFTService.addUpdateMFT(0, this.mftNote, this.ApplicationID, documentName, this.response?.dbPath, this.CurrentUser.appUserId, this.CurrentUser.fullName).subscribe((data: any) => {
      /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.statusOfWorksComponent.getMFTForApplication();
      }

    }, error => {
      console.log("Error: ", error);
    })
  }


  viewImage(index: any) {

    // Make an HTTP GET request to fetch the document
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.MFTList[index].DocumentName}`)
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


      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }


  openFAQModal(FAQModal: any) {
    this.modalService.open(FAQModal, { centered: true, size: 'xl' })
  }

  getLinkedDepartmentsFORAPPROVAL() {


    const currentApplication = this.sharedService.getViewApplicationIndex();



    this.subDepartmentForCommentService.getSubDepartmentForComment(currentApplication.applicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (var i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];

          const tempSubDepartmentList = {} as SubDepartmentListFORAPPROVAL;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName.replace(/\r?\n|\r/g, '');
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



          this.SubDepartmentListFORAPPROVAL.push(tempSubDepartmentList);
        }


      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }



  CheckForApprovalPackDownload() {
    

    if (this.CurrentUser.appUserId == this.applicationDataForView[0].CreatedById && this.generateApproval == true) {

      /*      this.getContactDetails();*/

    }


  }


  public isLoading: boolean = false;
  OpenLoadingModal() {
    if (confirm("Are You Sure You Want To Download Your Approval Pack ?")) {
      this.isLoading = true;
       this.getContactDetails();
    }
   
    else {

    }


  }

  applicationData: ApplicationList;
  MoveToPermitStage() {

    console.log(this.StagesList);
    
    this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, this.StagesList[4].StageName, this.StagesList[4].StageOrderNumber, this.StagesList[5].StageName, this.StagesList[5].StageOrderNumber, "PTW Pending").subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.projectNo, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>Please apply for a permit to work.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
        if (this.applicationData.clientAlternativeEmail) { //checkingNotifications Sindiswa 15 February 2024
          this.notificationsService.sendEmail(this.applicationData.clientAlternativeEmail, "Wayleave Application #" + this.projectNo, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>Please apply for a permit to work.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
        }
        this.modalService.dismissAll();
        alert("Application moved to PTW");
        this.router.navigate(["/home"]);

      }
      else {
        alert(data.responseMessage);
      }
      console.log("responseAddapplication", data);
    }, error => {
      console.log("Error", error);
    })

    //}

    //else if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[2].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Distributing") {

    //}
    //else {
    //  alert("Application Status Is Not Paid");
    //}


  }

  checkIfWbsRequired() {
    
    if (this.CurrentApplicationBeingViewed[0].wbsrequired == true) {

      if ( this.CurrentApplicationBeingViewed[0].WBSNumber.length >0) {
        this.wbsNumberRequested = this.CurrentApplicationBeingViewed[0].WBSNumber;
        this.WBSField = true;
        this.WBSBtn = false;
      }
      if (this.CurrentApplicationBeingViewed[0].CreatedById == this.CurrentUser.appUserId && this.CurrentApplicationBeingViewed[0].WBSNumber.length < 1) {
        this.WBSBtn = true;
      }
    }
    else {

    }
  }

  //Audit Trail Kyle
  onSaveToAuditTrail(description: string) {
    this.auditTrailService.addUpdateAuditTrailItem(0, this.applicationData.applicationID, description, this.CurrentUserProfile[0].isInternal, this.CurrentUserProfile[0].subDepartmentName, this.CurrentUserProfile[0].zoneName, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
       /* alert(data.responseMessage);*/
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })

   
  }

  onCheckAllCurrentUserRole() {
    for (let i = 0; i < this.AllCurrentUserRoles.length; i++) {
      const roleName = this.AllCurrentUserRoles[i].roleName;

      if (roleName == "Audit Trail") {

        this.auditTrail = true;
        this.sharedService.isViewReport = true;
      }
    }
  }
  /*Progess bar Kyle 07-02-24*/
  progressColor: string;
  startColor: string = '#09DFD7';
  endColor: string = '#098CDF';
  CalCulateApprovalProgess() {
    this.subDepartmentForCommentService.getSubDepartmentForComment(this.applicationDataForView[0].applicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];

          if (current.commentStatus == null && current.userAssignedToComment != null) {
            this.progressBar = this.progressBar + 33.34;
          }

          if (current.commentStatus == "Clarify") {
            this.progressBar = this.progressBar + 50;
          }

          if (current.commentStatus == "Approved" || current.commentStatus == "Approved(Conditionally)") {
            this.progressBar = this.progressBar + 67.67;
          }

          if (current.commentStatus == "Final Approved" || current.commentStatus == "Completed") {
            this.progressBar = this.progressBar + 100;
          }
        }
        let progress = (this.progressBar / data.dateSet.length).toFixed(2);
        this.progressBar = parseFloat(progress);
/*        this.getProgressBarColor(this.progressBar);*/
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }


  getProgressBarColor(percentage: number): string {
    // Calculate the middle color dynamically based on the percentage
    const middleColor = this.calculateColor(percentage, this.startColor, this.endColor);

    // Construct the gradient color using the start, middle, and end colors
    return `linear-gradient(to right, ${this.startColor}, ${middleColor} ${percentage}%, ${this.endColor})`;
  }

  calculateColor(percentage: number, startColor: string, endColor: string): string {
    // Interpolate the color between start and end colors based on the percentage
    const startRgb = this.hexToRgb(startColor);
    const endRgb = this.hexToRgb(endColor);
    const interpolatedRgb = {
      r: Math.round(startRgb.r + (endRgb.r - startRgb.r) * (percentage / 100)),
      g: Math.round(startRgb.g + (endRgb.g - startRgb.g) * (percentage / 100)),
      b: Math.round(startRgb.b + (endRgb.b - startRgb.b) * (percentage / 100))
    };
    return `rgb(${interpolatedRgb.r}, ${interpolatedRgb.g}, ${interpolatedRgb.b})`;
  }

  hexToRgb(hex: string): { r: number, g: number, b: number } {
    // Convert a hex color to RGB format
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  //Status of works Kyle 16-02-24
  showUpload: boolean = false;
  onCheckMFTNote(event:Event):void {
    
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue == '') {
      this.showUpload = false
    }
    else {
      this.showUpload = true;
      
    }
  }
  /*Progess bar Kyle 07-02-24*/
     //Project size Kyle 27-02-24
  getAllManDocForPTWStage(permitModal: any) {
    const excavations = this.ExcavationType.split(",");
    var hasDrilling = false;
   
    for (let i = 0; i < excavations.length; i++) {
      if (excavations[i].trim() == "Drilling") {
        hasDrilling = true;
      }

    }
    debugger;
    if (this.applicationDataForView[0].permitStartDate == null && this.applicationDataForView[0].CurrentStageName == "PTW") {
      this.MandatoryDocumentUploadList.splice(0, this.MandatoryDocumentUploadList.length);
      this.mandatroyDocumentUploadService.getAllMandatoryDocumentsLinkedToStage(this.applicationDataForView[0].CurrentStageName).subscribe((data: any) => {
        debugger;
        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {

            const tempMandatoryDocList = {} as MandatoryDocumentUploadList;
            const current = data.dateSet[i];
            const applicationSize = this.applicationDataForView[0].TypeOfApplication;
            debugger;
            if (hasDrilling == true) {
              debugger;
              if (applicationSize == "Large") {
                tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
                tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
                tempMandatoryDocList.stageID = current.stageID;
                tempMandatoryDocList.dateCreated = current.dateCreated;
                tempMandatoryDocList.hasFile = false;
                this.MandatoryDocumentUploadList.push(tempMandatoryDocList);
              }

              else if (applicationSize != "Large" && current.mandatoryDocumentName != "Construction Program or Phasing Program") {
                tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
                tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
                tempMandatoryDocList.stageID = current.stageID;
                tempMandatoryDocList.dateCreated = current.dateCreated;
                tempMandatoryDocList.hasFile = false;
                this.MandatoryDocumentUploadList.push(tempMandatoryDocList);
              }
            }
            else {
              debugger;
              if (applicationSize == "Large" && current.mandatoryDocumentName != "Drill plan") {
                tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
                tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
                tempMandatoryDocList.stageID = current.stageID;
                tempMandatoryDocList.dateCreated = current.dateCreated;
                tempMandatoryDocList.hasFile = false;
                this.MandatoryDocumentUploadList.push(tempMandatoryDocList);
              }
              else if (applicationSize != "Large" && current.mandatoryDocumentName != "Construction Program or Phasing Program" && current.mandatoryDocumentName != "Drill plan") {
                tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
                tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
                tempMandatoryDocList.stageID = current.stageID;
                tempMandatoryDocList.dateCreated = current.dateCreated;
                tempMandatoryDocList.hasFile = false;
                this.MandatoryDocumentUploadList.push(tempMandatoryDocList);
              }
            }
          }

          

          console.log("apply for permit document upload list",this.MandatoryDocumentUploadList)
          this.openPermitModal(permitModal);
          
        }
        
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);
      })
    }

  }

  ClosePermitStartDateModal() {
    debugger;
    if (this.fileCount == 0) {
      this.modalService.dismissAll();
    }
    else {
      alert("Please delete documents uploaded if you wish to close without saving");
    }
  }

  //#region zxNum-and-contractorAccount Sindiswa 28 February 2024
  wdmZXNumber: string;
  rimZXNumber: string;
  contractorAccountDetails: string;
  saveWaterZXNumber() {
    this.applicationsService.addUpdateZXNumbers(this.ApplicationID, this.wdmZXNumber, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        //this.getZXNumberDetails();
        this.getZXNumberDetailsAfterZXEntry();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }

  saveRIMZXNumber() {
    debugger;
    this.applicationsService.addUpdateZXNumbers(this.ApplicationID, null, this.rimZXNumber).subscribe((data: any) => {
      if (data.responseCode == 1) {
        //this.getZXNumberDetails();
        this.getZXNumberDetailsAfterZXEntry();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }

  getZXNumberDetailsAfterZXEntry() {
    this.applicationsService.getZXDetails(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log("This is what I found while looking for ZX details", data);
        this.wdmZXNumber = data.dateSet[0].waterZXNumber;
        this.rimZXNumber = data.dateSet[0].rimzxNumber;
        if (data.dateSet[0].waterZXNumber.trim() !== "") {
          this.waterZXEnabled = false;
        }
        if (data.dateSet[0].rimzxNumber.trim() !== "") {
          this.rimZXEnabled = false;
        }
        if (data.dateSet[0].waterZXNumber.trim() !== "" && data.dateSet[0].rimzxNumber.trim() !== "") {
          this.showEMBInput = true;

          this.notifyEMBtoAddContractorDetails();

          if (this.CurrentUserProfile[0].departmentID == 28) {
            this.contractorInfEnabled = true;
          }
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })

  }

  getZXNumberDetails() {
    this.applicationsService.getZXDetails(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log("This is what I found while looking for ZX details", data);
        this.wdmZXNumber = data.dateSet[0].waterZXNumber;
        this.rimZXNumber = data.dateSet[0].rimzxNumber;
        if (data.dateSet[0].waterZXNumber.trim() !== "") {
          this.waterZXEnabled = false;
        }
        if (data.dateSet[0].rimzxNumber.trim() !== "") {
          this.rimZXEnabled = false;
        }
        if (data.dateSet[0].waterZXNumber.trim() !== "" && data.dateSet[0].rimzxNumber.trim() !== "") {
          this.showEMBInput = true;

          if (this.CurrentUserProfile[0].departmentID == 28) { 
            this.contractorInfEnabled = true;
          }
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
   
  }

  notifyEMBtoAddContractorDetails() {
    this.userPofileService.getUsersBySubDepartmentName("EMB").subscribe((data: any) => {

      if (data.responseCode == 1) {

        //data.forEach((obj) => { // checkingNotifications Sindiswa 15 February 2024 - removed this, it wasn't tapping into the user's information
        data.dateSet.forEach((obj) => {
          this.notificationsService.sendEmail(obj.email, "New wayleave application submission needs contractor account details", "check html", "Dear EMB User" + "<br><br>An application with ID " + this.ApplicationID + " for wayleave now has the required ZX numbers, enter the contractor's contact details so that an invoice can be generated.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
          if (obj.alternativeEmail) {
            this.notificationsService.sendEmail(obj.alternativeEmail, "New wayleave application submission needs contractor account details", "check html", "Dear EMB User" + "<br><br>An application with ID " + this.ApplicationID + " for wayleave now has the required ZX numbers, enter the contractor's contact details so that an invoice can be generated.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");

          }
          //this.notificationsService.addUpdateNotification(0, "Wayleave Created", "New wayleave application submission", false, this.CurrentUser.appUserId, this.applicationID, obj.userID,  "An application with ID " + this.applicationID + " for wayleave has just been captured.").subscribe((data: any) => {
          this.notificationsService.addUpdateNotification(0, "Wayleave Created", "New wayleave application submission needs contractor account details", false, obj.userID, this.ApplicationID, this.CurrentUser.appUserId, "An application with ID " + this.ApplicationID + " for wayleave now has the required ZX numbers, enter the contractor's contact details so that an invoice can be generated.").subscribe((data: any) => {

            if (data.responseCode == 1) {
              console.log(data.responseMessage);

            }
            else {
              alert(data.responseMessage);
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })

        })



        alert(data.responseMessage);

      }
      else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    });

  }

  saveContractorDetails() {
    //1. is this how one saves in local storage?
    localStorage.setItem('contractorAccountDetails', this.contractorAccountDetails);
    //2. create the invoice now?!
    this.NewWayleaveComponent.getServiceItem("001");
    this.NewWayleaveComponent.getServiceItem("002");
    this.NewWayleaveComponent.getServiceItem("003");
   
    this.genInvoice();
   
  }
  genInvoice() {
    this.NewWayleaveComponent.getCurrentInvoiceNumberForGen("Turtle Speed", this.ApplicationID);
  }



  //#endregion
}
