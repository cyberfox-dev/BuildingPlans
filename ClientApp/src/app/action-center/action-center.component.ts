import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { MatTable } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
import { ServiceItemService } from 'src/app/service/ServiceItems/service-item.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { ZonesService } from '../service/Zones/zones.service';
import { ZoneForCommentService } from '../service/ZoneForComment/zone-for-comment.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { DepositRequiredService } from '../service/DepositRequired/deposit-required.service';
import { CommentsService } from '../service/Comments/comments.service';
import { ApplicationsService} from '../service/Applications/applications.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { CommentsList, ViewProjectInfoComponent } from 'src/app/view-project/view-project-info/view-project-info.component';
import { PermitComponentComponent } from 'src/app/permit-component/permit-component.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { RefreshService } from 'src/app/shared/refresh.service';
import { PermitService } from 'src/app/service/Permit/permit.service';
import { StagesService } from 'src/app/service/Stages/stages.service';
import { catchError, map, Observable, of } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';
import { NotificationsService } from 'src/app/service/Notifications/notifications.service';
import { ManuallyAssignUsersService } from 'src/app/service/ManuallyAssignUsers/manually-assign-users.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
import { tap } from 'rxjs/operators';
import 'tinymce';
import 'tinymce/themes/silver';

// Add any plugins you want to use
import 'tinymce/plugins/lists';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DepartmentCirculationPlanningComponent } from '../department-circulation-planning/department-circulation-planning.component';
import { ReviewerforcommentService } from '../service/ReviewerForComment/reviewerforcomment.service';

//Audit Trail Kyle
import { AuditTrailService } from '../service/AuditTrail/audit-trail.service';
 //Audit Trail Kyle
declare var tinymce: any;




export interface SubDepartmentList {
  zoneID: any;
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
}
// #region escalation Sindiswa 30 January 2024
export interface SubDepartmentListForComment extends SubDepartmentList {
  zoneName: string;
  departmentDone: boolean;
  departmentYetToAssign:boolean;
}
// #endregion

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: number;
  totalVat: number;
  dateCreated: any;
  vatApplicable: boolean;
}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
}

//PTC = Permit To Comment
export interface PTCList {
  PermitSubForCommentID: number;
  ApplicationID: number;
  SubDepartmentID: number;
  UserAssaignedToComment: string;
  SubDepartmentName: string;
  PermitComment: string;
  PermitCommentStatus: string;

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
  userID: string,
}

export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
  zoneForCommentID: number | null;
}

export interface CommentList {
  CommentID: number;
  Comment: string;
  DateCreated: string;
  createdBy: any;
  ApplicationID: number;
  CommentStatus: string;
  SubDepartmentForCommentID: number;
  SubDepartmentName?: string;
  isClarifyCommentID?: number;
  isApplicantReplay?: string;
  UserName: string;
}

export interface CommentDropDown {
  commentID: number;
  commentName: string;
}
export interface ServiceItemCodeDropdown {
  serviceItemID: number;
  serviceItemCode: string;
}

export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
}

export interface UserZoneList {
  id: string;
  fullName: string;
  zoneLinkID?: any
  Email: string;
}

export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
  //RoleType: string;
  //RoleDescription: string;
}
 //Service Information Kyle 31/01/24
export interface ServiceInfoDocumentsList {
  DocumentID: number;
  DocumentName: string;
  ApplicationID: number;
  DocumentLocation: any;
  DocumentGroup: string;
  SubDepartmentName: string;
  isPlanning: boolean;
}
  //Service Information Kyle 31/01/24



@Component({
  selector: 'app-action-center',
  templateUrl: './action-center.component.html',
  styleUrls: ['./action-center.component.css']

})
export class ActionCenterComponent implements OnInit {



  fileAttr = 'Choose File';
  @Input() ApplicationID: any;
  @Input() CurrentApplicant: any;
  roles: string;
  CurrentApplication: any;
  fileAttrs: any;
  departmentAdminUsers: any;
  seniorReviewerUsers: any;
  finalApproverUsers: any;
  reviewerUsers: any;
  EMBUsers: any;
  developerUsers: any;
  canCommentSeniorReviewer: boolean;
  countApprove = 0;
  countReject = 0;
  SubDepartmentListForCheck: SubDepartmentList[] = [];
  assaignedToComment: number = 0;
  permitIssuer: any;
  canApprovePermit: boolean;
  showPermitTab: boolean;
  applicationData: ApplicationList;



  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  response: { dbPath: ''; } | undefined
  fileAttrsName = "Doc";
  loggedInUsersEmail: any;
  ACHeader: string;
  WBSRequestedAlreadyLabel: boolean = false;
  projectNo: any;

  WBSCHeckBox: boolean = true;
  previousReviewer: any;
  //  loggedInUserName: any;
  /*textfields*/

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

  public depositRequired = this.formBuilder.group({
    /*viewSelectedSubDep: ['', Validators.required],*/
    selectServiceItemCode: ['', Validators.required],
    description: ['', Validators.required],
    rate: ['', Validators.required],
    quantity: ['', Validators.required],
    total: ['', Validators.required],
    remarks: ['', Validators.required],
    vatApplicable: ['', Validators.required],

  })

  public wbs = this.formBuilder.group({
    wbsnumber: ['', Validators.required]
  })

  WBSCheck: boolean = false;
  checked: boolean = false;
  DepositCheck: boolean = false;
  permit: boolean = true;


  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentLinkedList: SubDepartmentList[] = [];
  SingleSubDepartmentLinked: SubDepartmentList[] = [];
  CommentList: CommentList[] = [];
  RolesList: RolesList[] = [];
  UserROle: RolesList[] = [];
  CommentDropDown: CommentDropDown[] = [];
  ServiceItemCodeDropdown: ServiceItemCodeDropdown[] = [];
  ServiceItemList: ServiceItemList[] = [];
  StagesList: StagesList[] = [];
  CommentsList: CommentsList[] = [];
  LinkedSubDepartmentsList: SubDepartmentListForComment[] = []; //escalation Sindiswa 30 January 2024

   //Service Information Kyle 31/01/24
  ServiceInfoDocumentsList: ServiceInfoDocumentsList[] = [];
  displayedColumnsDocs: string[] = ['DocumentName', 'actions'];
  dataSourceServiceInfoDocuments = this.ServiceInfoDocumentsList;
   //Service Information Kyle 31/01/24
  ZoneList: ZoneList[] = [];
  ZoneLinkedList: ZoneList[] = [];
  UserZoneList: UserZoneList[] = [];
  LinkedUserToSub: UserZoneList[] = [];
  ReviewerUserList: UserZoneList[] = [];
  PTCList: PTCList[] = [];
  PTCListForCheck: PTCList[] = [];

  selection = new SelectionModel<SubDepartmentList>(true, []);
  zoneSelection = new SelectionModel<ZoneList>(true, []);
  UserSelectionForManualLink = new SelectionModel<UserZoneList>(true, []);

  displayedColumnsSubDepartment: string[] = ['subDepartmentName', 'actions'];
  dataSourceSubDepartment = this.SubDepartmentList;

  displayedColumnsLinkedSubDepartment: string[] = ['subDepartmentName', 'actions'];
  dataSourceLinkedSubDepartment = this.SubDepartmentLinkedList;

  displayedColumnsViewLinkedSubZones: string[] = ['zoneName', 'actions'];
  dataSourceViewLinkedSubZones = this.ZoneList;

  displayedColumnsViewLinkedZones: string[] = ['zoneName', 'actions'];
  dataSourceViewLinkedZones = this.ZoneLinkedList;

  displayedColumnsViewUsersForLink: string[] = ['fullName', 'actions'];
  dataSourceViewUsersForLink = this.ReviewerUserList;

  displayedColumnsViewlinkedUserForComment: string[] = ['fullName'];
  dataSourceViewUserForComment = this.LinkedUserToSub;

  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;
  @ViewChild(MatTable) SubDepartmentLinkedListTable: MatTable<SubDepartmentList> | undefined;
  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;

  //#region escalation Sindiswa 30 January 2024

  displayedColumnsViewDepartmentsForEMBComment: string[] = ['subDepartmentName', 'zoneName', 'actions'];
  dataSourceViewDepartmentsForEMBComment = this.LinkedSubDepartmentsList;
  @ViewChild(MatTable) SubDepartmentsListTable: MatTable<SubDepartmentListForComment> | undefined;
  //#endregion

  closeResult!: string;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;
  loggedInUsersIsAdmin: any;
  loggedInUsersDepartment: void;
  loggedInUsersDepartmentID: number;
  loggedInUsersSubDepartmentID: any;
  loggedInUsersSubDepartmentName: any;
  loggedInUserName: any;
  AssignProjectToZone: boolean;
  hopperButton: boolean;
  SubForCommentIDForHopper: any;
  forManuallyAssignSubForCommentID: any;
  loggedInUsersIsZoneAdmin: any;
  AssignUserForComment: boolean;
  applicationDataForView: any;
  CurrentApplicationBeingViewed: any;
  subDepartmentID: any;
  userID: any;
  canComment: boolean;
  CanAssignDepartment: boolean;
  canCommentFinalApprover: boolean;
  manualLinkStatus: string;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private subDepartment: SubDepartmentsService,
    private commentService: CommentBuilderService,
    private formBuilder: FormBuilder,
    private serviceItemService: ServiceItemService,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private zoneService: ZonesService,
    private userPofileService: UserProfileService,
    private zoneForCommentService: ZoneForCommentService,
    private zoneLinkService: ZoneLinkService,
    private depositRequiredService: DepositRequiredService,
    private commentsService: CommentsService,
    private applicationsService: ApplicationsService,
    public sharedService: SharedService,
    private accessGroupsService: AccessGroupsService,
    private viewProjectInfoComponent: ViewProjectInfoComponent,
    private router: Router,
    private refreshService: RefreshService,
    private stagesService: StagesService,
    private permitService: PermitService,
    private permitComponentComponent: PermitComponentComponent,
    private http: HttpClient,
    private documentUploadService: DocumentUploadService,
    private notificationsService: NotificationsService,
    private manuallyAssignUsersService: ManuallyAssignUsersService,
    private sanitizer: DomSanitizer,
    private _bottomSheet: MatBottomSheet,
    private reviwerforCommentService: ReviewerforcommentService,
   
    //Audit Trail Kyle
    private auditTrailService: AuditTrailService,
    //Audit Trail Kyle

  ) { }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  stringifiedData: any;
  CurrentUser: any;


  ReticulationID = 1025;

  public isInternalUser: boolean = false;
  public isExternalUser: boolean = false;

  saveBtn: boolean = true;
  option = '';
  planningWayleave: boolean = false;
  selectSI = 0;

  leaveAComment = "";

  EMBLoggedIn: boolean; ///escalation Sindiswa 30 January 2024

  sanitizeHTML(comment: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(comment);
  }

  leaveACommentPermit = "";
  FileUpload = "Please Upload file";
  @ViewChild("internalOpt", { static: true }) content!: ElementRef;
  @Output() refreshParent: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    // setTimeout(() => {
    //this.getDepartmentManagerUserID();
    //Get Current Application Infomation 
    this.EMBLoggedIn = this.sharedService.getIsEMBUser();
    this.initializeTinyMCE();
    this.applicationData = this.sharedService.getViewApplicationIndex();
    console.log("venApplicationData:", this.applicationData);
    this.getAllSubDepartments();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log("This is the Current User's Details",this.CurrentUser);
    }

    /*  this.getAllServiceItmes();*/
    /*  this.getAllServiceItmesForDropdown();*/

    /*  this.getAllServiceItmes();*/



    this.CurrentApplication = this.viewProjectInfoComponent.getCurrentApplication();

    if (!this.CurrentApplication.ProjectNumber.startsWith("WL")) {
      return;
    }

    if (this.CurrentApplication.isPlanning === true) {

      this.planningWayleave = true;
    }

    //// this giving some shit
    // this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    // this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);

    //end of shit
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    console.log("This is the Current User's Details", this.CurrentUserProfile);
    console.log("WTFWTFWTFWTFWTFWTWFTWFWTFWTFWTWTF", this.CurrentUserProfile[0]);
    this.loggedInUsersIsAdmin = this.CurrentUserProfile[0].isDepartmentAdmin;
    this.loggedInUsersIsZoneAdmin = this.CurrentUserProfile[0].isZoneAdmin;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;

    this.loggedInUsersSubDepartmentName = this.CurrentUserProfile[0].subDepartmentName;
    this.loggedInUsersDepartmentID = this.CurrentUserProfile[0].departmentID;
    this.loggedInUsersEmail = this.CurrentUserProfile[0].email;
    this.loggedInUserName = this.CurrentUserProfile[0].fullName;
    this.getCurrentUserSubDepName();
    //this.newAssignORReassign(); //actionCentreEdits Sindiswa 16 January 2024
    this.checkUserAssignSituation(); //actionCentreEdits Sindiswa 18 January 2024
    this.getAllUsersLinkedToZone(this.loggedInUsersSubDepartmentID);
    if (this.CurrentApplication.permitStartDate != null || this.CurrentApplication.permitStartDate != undefined) {
      this.getUsersByRoleName("Permit Issuer");

      this.showPermitTab = true;
      this.canApprovePTW();
      this.getAllPermitForComment();
    }
    else {
      this.showPermitTab = false;
    }

    this.getLinkedZones();

    this.getAllStages();


    this.getUserRoles();
    this.getServicesByDepID();
    this.getUsersByRoleName("Senior Reviewer");
    this.getUsersByRoleName("Final Approver");
    this.getZoneForCurrentUser();
    this.getPreviousReviewerUserID();
    this.checkIfWbsRequired();
    this.CheckApplicant();
    this.setProjectNumber();
    this.getAllDocumentsForServiceInformation();




  }
  initializeTinyMCE() {

    tinymce.init({
      selector: '#myTextarea', // Replace with the ID of your textarea 
      plugins: ['lists', 'textcolor'],
      toolbar: 'bold italic | numlist bullist forecolor backcolor',
      menubar: false
    });
  }
  openBottomSheet(): void {
    this._bottomSheet.open(DepartmentCirculationPlanningComponent);
  }


  ngOnDestroy() {
    this.refreshService.disableRefreshNavigation();
  }


  setProjectNumber() {

    if (this.CurrentApplication.ProjectNumber == null) {


      this.projectNo = this.CurrentApplication.applicationID.toString();
    }
    else {

      this.projectNo = this.CurrentApplication.ProjectNumber;
    }


  }

  onPassFileName(event: { uploadFor: string; fileName: string }) {

    const { uploadFor, fileName } = event;

    this.fileAttrsName = "Doc";


  }
  onFileDelete(event: any, index: number) {

    this.fileAttrsName = "Doc";

  }

  onFileUpload(event: any) {


  }

  canApprovePTW() {

    this.permitService.getPermitForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {

          let foundMatch = false;
          let current = data.dateSet[i];
          if (this.CurrentApplication.permitStartDate != null || this.CurrentApplication.permitStartDate != undefined) {

            for (var i = 0; i < this.permitIssuer.length; i++) {



              if (this.permitIssuer[i].userID == this.CurrentUser.appUserId) {



                if (current.subDepartmentID == this.loggedInUsersSubDepartmentID) {



                  foundMatch = true;
                  break;
                }

              }


              if (foundMatch) {


                // A match was found, no need to continue checking
                break;
              }
            }
          }

          else {

            this.canApprovePermit = false;
          }


          this.canApprovePermit = foundMatch;
        }
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })






    //this.permitService.getPermitForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
    //  if (data.responseCode == 1) {
    //    let foundMatch = false;
    //    let current = data.dateSet[0];// Flag to track if a match is found

    //    if (this.CurrentApplication.permitStartDate != null || this.CurrentApplication.permitStartDate != undefined) {

    //      for (var i = 0; i < this.permitIssuer.length; i++) {



    //        if (this.permitIssuer[i].userID == this.CurrentUser.appUserId) {



    //          if (current.subDepartmentID == this.loggedInUsersSubDepartmentID) {



    //            foundMatch = true;
    //            break;
    //          }

    //        }


    //        if (foundMatch) {


    //          // A match was found, no need to continue checking
    //          break;
    //        }
    //      }
    //    }

    //    else {
    //      this.canApprovePermit = false;
    //    }


    //    this.canApprovePermit = foundMatch;
    //  } else {
    //    alert(data.responseMessage);
    //  }

    //  console.log("response", data);
    //}, error => {
    //  console.log("Error: ", error);
    //})


  }

  getAllPermitForComment() {

    this.permitService.getPermitSubForCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempPTCList = {} as PTCList;
          const current = data.dateSet[i];

          tempPTCList.PermitSubForCommentID = current.permitSubForCommentID;
          tempPTCList.ApplicationID = current.applicationID;
          tempPTCList.SubDepartmentID = current.subDepartmentID;
          tempPTCList.SubDepartmentName = current.subDepartmentName;
          tempPTCList.UserAssaignedToComment = current.userAssaignedToComment;
          tempPTCList.PermitComment = current.permitComment;
          tempPTCList.PermitCommentStatus = current.permitCommentStatus;

          this.PTCList.push(tempPTCList);

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
        this.CanComment();
        console.log("this.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesListthis.StagesList ", this.StagesList);
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

  //onPassFileName(event: { uploadFor: string; fileName: string }) {
  //  const { uploadFor, fileName } = event;





  //  //for (var i = 0; i < filesForUpload.length; i++) {
  //  //  const formData = new FormData();
  //  //  let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
  //  //  let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.applicationID;
  //  //  formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);



  //  //  this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
  //  //    .subscribe({
  //  //      next: (event) => {

  //  //        if (event.type === HttpEventType.UploadProgress && event.total)
  //  //          this.progress = Math.round(100 * event.loaded / event.total);
  //  //        else if (event.type === HttpEventType.Response) {
  //  //          this.message = 'Upload success.';
  //  //          this.uploadFinished(event.body, this.applicationID, data.dateSet);
  //  //        }
  //  //      },
  //  //      error: (err: HttpErrorResponse) => console.log(err)
  //  //    });
  //  //}
  //  const index = parseInt(uploadFor.substring('CoverLetter'.length));
  //  this.fileAttrs[index] = fileName;
  //}

  generatePTW(ClientName: string) {

    const doc = new jsPDF();

    // Logo
    const img = new Image();
    img.src = 'assets/cctlogoblack.png';

    // Add logo to PDF document
    doc.addImage(img, 'png', 10, 10, 60, 20);

    autoTable(doc, {
      body: [
        [

          {
            content: 'Permit To Work',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#000000',
            }
          },
        ],
      ],
      theme: 'plain',
      styles: {
        //fillColor: '#3366ff',

      },
      // startY: 40,
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'ApplicationID: ' + this.ApplicationID
              + '\nWayleave Ref No.: ' + ClientName
              + '\nDate: ' + this.formattedDate,

            styles: {
              halign: 'right',
            }
          }
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'City of Cape Town'
              + '\nPost Box / Posbus / iShokisi 655'
              + '\nCAPE TOWN'
              + '\n8001',

            styles: {
              halign: 'left',
            }
          }
        ],
      ],
      theme: 'plain',
    });

    const startY = 100; // set the starting Y position for the table

    // Generate table body based on ServiceItemList data
    const tableBody = this.PTCListForCheck.map(item => {
      return [
        item.SubDepartmentName,
        item.PermitComment,
        //item.PermitCommentStatus,
      ];
    });

    autoTable(doc, {
      head: [['Department Name', 'Comment']],
      body: tableBody,
      theme: 'grid',
      startY: startY,
      margin: { top: 20 }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'ALL Department Approved PTW' /*+ this.generatedInvoiceNumber*/
              + '',

            styles: {
              halign: 'center',
            }
          }
        ],
      ],
      theme: 'grid',
    });

    //autoTable(doc, {
    //  body: [
    //    [
    //      {
    //        content: 'Profit Centre: ' + 'P19070051'
    //          + '\nGL Acc: ' + "845180",
    //        styles: {
    //          halign: 'left',
    //        }
    //      }
    //    ],
    //  ],
    //  theme: 'plain',
    //  startY: startY + 30, // add 30 units of Y position to create space between the tables
    //});

    doc.save("Permit.pdf");
    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'Permit', { type: 'application/pdf' });


    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file);

    this.sharedService.pushFileForTempFileUpload(file, "Permit" + ".pdf");
    this.save();
    // window.open(pdfUrl, '_blank')

    // this.router.navigate(["/home"]);

  }



  save() {




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
              this.uploadFinishedF(event.body);

            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }

  }

  uploadFinishedF = (event: any) => {
    const currentApplication = this.sharedService.getViewApplicationIndex();

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, this.CurrentUser.appUserId, this.CurrentUser.appUserId).subscribe((data: any) => {
      /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {

      }

    }, error => {
      console.log("Error: ", error);
    })


  }



  CheckAllLinkedDepartmentsApproved() {


    const currentApplication = this.sharedService.getViewApplicationIndex();


    this.countApprove = 0;
    this.countReject = 0;

    this.permitService.getPermitSubForCommentByApplicationID(currentApplication.applicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempPTCList = {} as PTCList;
          const current = data.dateSet[i];

          tempPTCList.PermitSubForCommentID = current.permitSubForCommentID;
          tempPTCList.ApplicationID = current.applicationID;
          tempPTCList.SubDepartmentID = current.subDepartmentID;
          tempPTCList.SubDepartmentName = current.subDepartmentName;
          tempPTCList.UserAssaignedToComment = current.userAssaignedToComment;
          tempPTCList.PermitComment = current.permitComment;
          tempPTCList.PermitCommentStatus = current.permitCommentStatus;



          if (tempPTCList.PermitCommentStatus == "Approved") {
            this.countApprove++;
          }
          if (tempPTCList.PermitCommentStatus == "Rejected") {
            this.countReject++;
          }

          this.PTCListForCheck.push(tempPTCList);
        }

        if (this.PTCListForCheck.length == this.countApprove) {
          this.generatePTW(currentApplication.ProjectNumber)
          this.countApprove = 0;
          this.countReject = 0;
          this.MoveToClosedStage(false);
          // this.MoveToNextStage();
        } else if (this.countReject++ >= 1 && this.SubDepartmentListForCheck.length == this.countApprove + this.countReject) {
          //Rejection Pack

          this.countApprove = 0;
          this.countReject = 0;
          //   this.MoveToClosedStage();
        }
        else {
          this.countApprove = 0;
          this.countReject = 0;
        }

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }





  PermitIssue(interact: string) {

    let SubDepartmentName = "";
    let PermitSubCommetID = 0;

    //for (var i = 0; i < this.PTCList.length; i++) {

    //  if (this.PTCList[i].SubDepartmentID == this.loggedInUsersSubDepartmentID) {

    //    SubDepartmentName = this.PTCList[i].SubDepartmentName;
    //    PermitSubCommetID = this.PTCList[i].PermitSubForCommentID;
    //  }
    //}


    this.permitService.getPermitForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        let current = data.dateSet[0];
        switch (interact) {

          case "Approve": {
            if (confirm("Are you sure you want to approve permit this application?")) {

              this.permitService.addUpdatePermitSubForComment(current.permitSubForCommentID, null, null, null, this.CurrentUser.appUserId, this.leaveACommentPermit, "Approved", this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {

                  alert("Permit Approved");
                  this.CheckAllLinkedDepartmentsApproved();
                  this.router.navigate(["/home"]);

                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
              this.modalService.dismissAll();
            }
            break;
          }

          case "MeetOnSite": {
            if (confirm("Are you sure you want to meet applicant On site?")) {
              this.permitService.addUpdatePermitSubForComment(current.permitSubForCommentID, null, null, null, this.CurrentUser.appUserId, this.leaveACommentPermit, "MeetOnSite", this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  alert("Meet Applicant On Site");
                  this.router.navigate(["/home"]);

                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
              this.modalService.dismissAll();
            }
            break;
          }

          case "Reject": {
            if (confirm("Are you sure you want to reject permit?")) {
              this.permitService.addUpdatePermitSubForComment(current.permitSubForCommentID, null, null, null, this.CurrentUser.appUserId, this.leaveACommentPermit, "Rejected", this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  alert("Permit Rejected");
                  this.router.navigate(["/home"]);

                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
              this.modalService.dismissAll();
            }

            break;
          }

          default: {

            break;
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



  FinalApprove(interact: string) {


    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    switch (interact) {

      case "Approve": {
        if (confirm("Are you sure you want to final approve this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Final Approved", null, null, "EndOfCommentProcess", true).subscribe((data: any) => {

            if (data.responseCode == 1) {
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Final Approved", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

                if (data.responseCode == 1) {




                  this.router.navigate(["/home"]);

                  this.viewProjectInfoComponent.getAllComments();
                  this.CheckALLLinkedDepartmentsCommented(false);
                  this.openSnackBar("Application Actioned");
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
/*              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application approved", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You have approved application " + this.projectNo + ".<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/              const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have approved application ${this.projectNo}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application approved", emailContent, emailContent);




              this.notificationsService.addUpdateNotification(0, "Application approved", "You have approved an application", false, this.CurrentUser.appUserID, this.CurrentUser.appUserID, this.ApplicationID, "You have approved application " + this.projectNo).subscribe((data: any) => {

                if (data.responseCode == 1) {


                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });



              //commentsService

            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          this.modalService.dismissAll();
        }
        break;
      }

      case "Reject": {
        if (confirm("Are you sure you want to final reject this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "FinalReject", null, null, "EndOfCommentProcess").subscribe((data: any) => {

            if (data.responseCode == 1) {


              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "FinalReject", this.CurrentUser.appUserId, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

                if (data.responseCode == 1) {

                  this.viewProjectInfoComponent.getAllComments();


                  this.router.navigate(["/home"]);
                  this.CheckALLLinkedDepartmentsCommented(false);
                  this.openSnackBar("Application Actioned");
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          this.modalService.dismissAll();
        }

        break;
      }

      default: {

        break;
      }
    }
  }


  getReviewerForLink() {

    this.ReviewerUserList.splice(0, this.ReviewerUserList.length);
    // this.ReviewerUserList = []; // Initialize the new list

    for (var i = 0; i < this.reviewerUsers.length; i++) {

      var reviewer = this.reviewerUsers[i];

      //for (var j = 0; j < this.UserZoneList.length; j++) {
      //  var userZone = this.UserZoneList[j];

      //  if (reviewer.userID === userZone.id) {

      //    this.ReviewerUserList.push(userZone); // Save the matching userZone in the new list
      //    console.log("THIS IS THE ZONE FOR THE CURRENT USER I THINKTHIS IS THE ZONE FOR THE CURRENT USER I THINKTHIS IS THE ZONE FOR THE CURRENT USER I THINKTHIS IS THE ZONE FOR THE CURRENT USER I THINKTHIS IS THE ZONE FOR THE CURRENT USER I THINKTHIS IS THE ZONE FOR THE CURRENT USER I THINKTHIS IS THE ZONE FOR THE CURRENT USER I THINK", userZone)
      //  }
      //}

      const tempreviewer = {} as UserZoneList;


      tempreviewer.Email = reviewer.email;
      tempreviewer.fullName = reviewer.fullName;
      tempreviewer.id = reviewer.userID;
      tempreviewer.zoneLinkID = reviewer.subDepartmentID;


      this.ReviewerUserList.push(tempreviewer);
    }
  }

  setRoles() {


    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {

          let current = data.dateSet[i];
          if (this.loggedInUsersIsAdmin == true) {

            this.AssignProjectToZone = true;

          }

          for (var i = 0; i < this.CurrentUserProfile.length; i++) {

            if (this.loggedInUsersIsZoneAdmin == true && current.subDepartmentID == this.CurrentUserProfile[i].subDepartmentID && current.zoneID == this.CurrentUserProfile[i].zoneID && this.CurrentUserProfile[i].isDefault == true) {

              //for (var j = 0; j < this.UserZoneList.length; j++) {

              //  if (this.UserZoneList[j].id == this.CurrentUser.appUserId) {

              //    this.AssignUserForComment = true;
              //    if (this.ACHeader == "You can comment" || this.canCommentFinalApprover === true) {

              //    } else {
              //      this.ACHeader = "Assign to Reviewer for comment";
              //    }

              //    this.getUsersByRoleName("Reviewer");

              //    break; // Exit the loop once a match is found
              //  }
              //}

              this.AssignUserForComment = true;
              this.getUsersByRoleName("Reviewer");
            }
          }


          if (this.loggedInUsersSubDepartmentID == this.ReticulationID) {

            this.CanAssignDepartment = true;
          } else {

            this.CanAssignDepartment = false;
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

  //setRoles() {


  //  this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

  //    if (data.responseCode == 1) {

  //      for (var i = 0; i < data.dateSet.length; i++) {

  //        let current = data.dateSet[i];
  //        if (this.loggedInUsersIsAdmin == true) {

  //          this.AssignProjectToZone = true;

  //        }
  //        if (this.loggedInUsersIsZoneAdmin == true) {

  //          for (var j = 0; j < this.UserZoneList.length; j++) {

  //            if (this.UserZoneList[j].id == this.CurrentUser.appUserId) {

  //              this.AssignUserForComment = true;
  //              if (this.ACHeader == "You can comment" || this.canCommentFinalApprover === true) {

  //              } else {
  //                this.ACHeader = "Assign to Reviewer for comment";
  //              }

  //              this.getUsersByRoleName("Reviewer");

  //              break; // Exit the loop once a match is found
  //            }
  //          }
  //        }

  //        if (this.loggedInUsersSubDepartmentID == this.ReticulationID) {

  //          this.CanAssignDepartment = true;
  //        } else {

  //          this.CanAssignDepartment = false;
  //        }
  //      }
  //    }
  //    else {
  //      alert(data.responseMessage);

  //    }
  //    console.log("reponse", data);
  //  }, error => {
  //    console.log("Error: ", error);
  //  })


  //}
  OldsetRoles() {


    // this.getUsersByRoleName("Department Admin");

    console.log("this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].", this.departmentAdminUsers);

    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {

      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.SubDepartmentLinkedList[i].zoneID && this.loggedInUsersIsAdmin == true) {

        this.AssignProjectToZone = true;

      }
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsZoneAdmin == true) {

        for (var j = 0; j < this.UserZoneList.length; j++) {

          if (this.UserZoneList[j].id == this.CurrentUser.appUserId) {

            this.AssignUserForComment = true;
            this.getUsersByRoleName("Reviewer");

            break; // Exit the loop once a match is found
          }
        }
      }

      ////////////////////
      if (this.loggedInUsersSubDepartmentID == this.ReticulationID) {

        this.CanAssignDepartment = true;
      } else {

        this.CanAssignDepartment = false;
      }
    }
  }

  //OLDer Code 
  //setRoles() {
  // //Im here

  // // this.getUsersByRoleName("Department Admin");

  //  console.log("this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].", this.departmentAdminUsers);

  //  for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
  //    
  //    if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsAdmin == true ) {
  //      
  //      this.AssignProjectToZone = true;



  //    }
  //    if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsZoneAdmin == true && this.LinkedUserToSub[0].id == this.CurrentUser.appUserId) {
  //      
  //      this.AssignUserForComment = true;
  //    }

  //    ////////////////////
  //    if (this.loggedInUsersSubDepartmentID == this.ReticulationID) {
  //      
  //      this.CanAssignDepartment = true;
  //    }
  //    else {
  //      
  //      this.CanAssignDepartment = false;
  //    }
  //  }
  //}
  getCurrentUsersZoneID(subID: number): Observable<number> {

    return this.zoneLinkService.getBySubAndUserID(subID, this.CurrentUser.appUserId).pipe(
      tap((data: any) => {
        console.log("reponse", data);
      }),
      map((data: any) => {
        if (data.responseCode === 1 && data.dateSet && data.dateSet.length > 0) {
          return data.dateSet[0].zoneID;
        } else {
          alert(data.responseMessage || "An unknown error occurred.");
          return 0;
        }
      }),
      catchError(error => {
        console.error("Error fetching Zone ID:", error);
        /*    this.ACHeader = "You Don't have anything to do on this project!";*/
        this.canComment = false;
        return of(0);
      })
    );
  }




  CanComment() {
    // this.getDepartmentManagerUserID("Senior Reviewer");

    //getBySubAndUserID
    ///let zoneID = Number(this.getCurrentUsersZoneID(this.loggedInUsersSubDepartmentID));

    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {

          let current = data.dateSet[i];
          if (current.userAssaignedToComment == this.CurrentUser.appUserId) { /*&& current.userAssaignedToComment != this.userID*/
            this.canComment = true;

            //if (this.canComment == true && this.canCommentFinalApprover == false) {
            //  this.ACHeader = "You can comment!";
            //}
            return;
          }
          else {
            //this.ACHeader = "You can't comment!";
            //this.canComment = false;
          }
        }
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);
      this.getUsersByRoleName("Senior Reviewer");

      // this.CanCommentFinalApprover();
    }, error => {
      console.log("Error: ", error);
    })
  }




  getPreviousReviewerUserID() {


    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        let tempReferCommentList;
        for (let i = 0; i < data.dateSet.length; i++) {



          const current = data.dateSet[i];

          if (current.commentStatus == "Referred" && current.subDepartmentID == this.loggedInUsersSubDepartmentID) {

            this.previousReviewer = current.createdById;
          }
          // #region comments Sindiswa 22 January 2023 - tbh I don't think think that this is able to distinguish between the Reviewer and Senior Reviewer
          else if ((current.commentStatus == "Provisionally Approved" || current.commentStatus == "Rejected" || current.commentStatus == "Approved" || current.commentStatus == "Approved(Conditional)") && current.subDepartmentID == this.loggedInUsersSubDepartmentID) {
            this.previousReviewer = current.createdById;
          }
          // #endregion
          else {
            this.previousReviewer = null;
          }

        }

        if (this.previousReviewer != null) {
          this.userPofileService.getUserProfileById(this.previousReviewer).subscribe((data: any) => {
            if (data.responseCode == 1) {
              this.previousReviewer = data.dateSet[0];
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {

            console.log("Error: ", error);
          });
        }
        else {

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



  onReviewerClarityClick() {
    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    //commentsService

    this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Reviewer Clarity", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.viewProjectInfoComponent.getAllComments();
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


  }


  onReturnToReviewerClick() {
    debugger;
    if (confirm("Are you sure you what return to previous reviewer?")) {



      this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, null, null, false, this.previousReviewer.userID, false).subscribe((data: any) => {

        if (data.responseCode == 1) {
          const emailContent = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.previousReviewer.fullName},</p>
            <p>Application ${this.projectNo} returned by  ${this.loggedInUsersEmail}</p>
           <p>Should you have any queries, please contact <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
                <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
    `;


          this.notificationsService.sendEmail(this.previousReviewer.email, "Application Returned By Senior Reviewer", emailContent, emailContent);
/*          this.notificationsService.sendEmail(this.previousReviewer.email, "Application Returned By Senior Reviewer", "Check html", "Dear " + this.previousReviewer.fullName + ",<br><br>Application: " + this.projectNo + ", Returned By Senior Reviewer" + ".<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/          this.notificationsService.addUpdateNotification(0, "Application Returned", "Application returned by senior reviewer", false, this.CurrentUser.appUserID, this.previousReviewer.UserID, this.ApplicationID, "Application: " + this.projectNo + ", Returned By Senior Reviewer").subscribe((data: any) => {

            if (data.responseCode == 1) {
              alert(data.responseMessage);

            }
            else {
              alert(data.responseMessage);
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          });
          alert(data.responseMessage);

          let SubDepartmentName = "";
          for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
            if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
              SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
            }
          }
          //commentsService

          this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Returned", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              this.viewProjectInfoComponent.getAllComments();
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


        }
        else {
          alert(data.responseMessage);

        }
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })






      //  this.subDepartmentForCommentService.departmentForCommentUserAssaignedToComment(this.forManuallyAssignSubForCommentID, this.previousReviewer).subscribe((data: any) => {

      //    if (data.responseCode == 1) {

      //      
      //      this.viewProjectInfoComponent.getAllComments();
      //      
      //      this.refreshParent.emit();
      //      //this.notificationsService.sendEmail(this.UserSelectionForManualLink.selected[0].Email, "New Wayleave Application", "check html", "Dear " + this.UserSelectionForManualLink.selected[0].fullName + ",<br><br>You have been assigned to application " + this.projectNo + " please approve or disapprove this application after reviewing it.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
      //    }
      //    else {
      //      alert(data.responseMessage);

      //    }
      //    console.log("reponse", data);
      //    this.modalService.dismissAll();
      //    this.router.navigate(["/home"]);


      //  }, error => {
      //    console.log("Error: ", error);
      //  })

    }
  }


  async CanCommentSeniorReviewer() {



    await this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        let foundMatch = false;
        let current = data.dateSet[0];// Flag to track if a match is found



        if (current.userAssaignedToComment == "Senior Reviewer to comment" || current.commentStatus == "Referred") {



          for (var i = 0; i < this.seniorReviewerUsers.length; i++) {


            if (this.seniorReviewerUsers[i].userID == this.CurrentUser.appUserId) {


              if (current.subDepartmentID == this.loggedInUsersSubDepartmentID) {


                foundMatch = true;
                break;
              }

            }

            if (foundMatch) {

              // A match was found, no need to continue checking
              break;
            }
          }
        }
        else {
          this.canCommentSeniorReviewer = false;
        }


        this.canCommentSeniorReviewer = foundMatch;

        /*        this.ACHeader = "You can comment!";*/


      } else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }


  async CanCommentFinalApprover() {



    await this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {

        let foundMatch = false;
        let current = data.dateSet[0];// Flag to track if a match is found


        // projectTracker Sindiswa 19 January 2024
        if (current.userAssaignedToComment == "All users in Subdepartment FA" || (current.userAssaignedToComment !== null && (current.commentStatus == 'Approved' || current.commentStatus === 'Rejected'))) {



          for (var i = 0; i < this.finalApproverUsers.length; i++) {


            if (this.finalApproverUsers[i].userID == this.CurrentUser.appUserId) {

              // Check if any userID in this.finalApproverUsers matches current.userAssaignedToComment
              if (current.subDepartmentID == this.loggedInUsersSubDepartmentID) {


                foundMatch = true;
                break;
              }

            }

            if (foundMatch) {

              // A match was found, no need to continue checking
              break;
            }
          }
        }
        else {
          this.canCommentFinalApprover = false;
        }


        this.canCommentFinalApprover = foundMatch;
        //if (this.ACHeader != "You can comment!") {
        //  this.ACHeader = "You can final approve!";
        //}

      } else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }


  // OLd code 
  //CanCommentFinalApprover() {
  //  this.getUsersByRoleName("Final Approver");

  //  this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

  //    if (data.responseCode == 1) {
  //      for (var i = 0; i < data.dateSet.length; i++) {
  //        let current = data.dateSet[i];



  //        if (current.userAssaignedToComment == this.CurrentUser.appUserId && current.userAssaignedToComment == this.finalApproverUsers[0].userID) {
  //          this.canCommentFinalApprover = true;
  //          //console.log("vvvvvvvcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent",current);
  //          return;
  //        }
  //        else {
  //          this.canCommentFinalApprover = false;
  //        } 
  //      }




  //    }
  //    else {
  //      alert(data.responseMessage);

  //    }
  //    console.log("reponse", data);

  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  //}




  updateApplicationStatus() {

    //this.getAllSubDepartments();
    let x = 0;
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].UserAssaignedToComment != null) {
        x++;
      }
    }

    if (x === this.SubDepartmentLinkedList.length) {
      this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          const current = data.dateSet[0];

          this.applicationsService.updateApplicationStage(this.ApplicationID, current.previousStageName, current.previousStageNumber, current.currentStageName, current.currentStageNumber, current.nextStageName, current.nextStageNumber, "Distributed/Allocated").subscribe((data: any) => {
            if (data.responseCode == 1) {
              const current = data.dateSet[0];




            }
            else {

              alert(data.responseMessage);
            }
            console.log("reponseGetSubDepartmentForComment", data);


          }, error => {
            console.log("Error: ", error);
          })
          console.log("reponseGetSubDepartmentForCommentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);


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


  viewSelectedUserForApplication() {


    this.LinkedUserToSub.splice(0, this.LinkedUserToSub.length);

    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];


        this.forManuallyAssignSubForCommentID = current.subDepartmentForCommentID;

        for (var i = 0; i < this.UserZoneList.length; i++) {

          if (this.UserZoneList[i].id == current.userAssaignedToComment) {
            const tempUserList = {} as UserZoneList;

            tempUserList.fullName = this.UserZoneList[i].fullName;
            tempUserList.id = this.UserZoneList[i].id;
            tempUserList.zoneLinkID = this.UserZoneList[i].zoneLinkID;
            tempUserList.Email = this.UserZoneList[i].Email

            this.LinkedUserToSub.push(tempUserList);
          }
        }

        this.CanCommentSeniorReviewer();

        this.CanCommentFinalApprover();


      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }

  onManuallyAssignUser() {


    if (confirm("Are you sure you what to assign this project to " + this.UserSelectionForManualLink.selected[0].fullName + "?")) {
      this.subDepartmentForCommentService.departmentForCommentUserAssaignedToComment(this.forManuallyAssignSubForCommentID, this.UserSelectionForManualLink.selected[0].id).subscribe((data: any) => {

        if (data.responseCode == 1) {


          this.getLinkedZones();
          this.updateApplicationStatus();
          this.MoveApplicationToAllocated();
          this.viewProjectInfoComponent.getAllComments();
          this.refreshParent.emit();

          const emailContent = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.UserSelectionForManualLink.selected[0].fullName},</p>
            <p>You have been assigned as reviewer for application ${this.projectNo}. Please login to the Wayleave Management System and proceed accordingly.</p>
                <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
    `;


          this.notificationsService.sendEmail(this.UserSelectionForManualLink.selected[0].Email, "New wayleave application", emailContent, emailContent);
/*          this.notificationsService.sendEmail(this.UserSelectionForManualLink.selected[0].Email, "New Wayleave Application", "check html", "Dear " + this.UserSelectionForManualLink.selected[0].fullName + ",<br><br>You have been assigned to application " + this.projectNo + " please approve or disapprove this application after reviewing it.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/          this.notificationsService.addUpdateNotification(0, "New Wayleave Application", "Application Assigned", false, this.CurrentUser.appUserID, this.UserSelectionForManualLink.selected[0].id, this.ApplicationID, "You have been assigned to application " + this.projectNo + " please approve or disapprove this application after reviewing it.").subscribe((data: any) => {

            if (data.responseCode == 1) {


            }
            else {
              alert(data.responseMessage);
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          });
        }
        else {
          alert(data.responseMessage);

        }
        console.log("reponse", data);
        this.modalService.dismissAll();
        this.openSnackBar("User Assigned Successfully");
        this.router.navigate(["/home"]);


      }, error => {
        console.log("Error: ", error);
      })

    }
  }



  getUsersByRoleName(roleName?: string | null) {

    if (roleName == "Department Admin") {
      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.departmentAdminUsers = data.dateSet;

          console.log("this.departmentAdminUsersgetAllLinkedRolesReponsethis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsers", this.departmentAdminUsers);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })

    }
    else if (roleName == "Senior Reviewer") {
      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.seniorReviewerUsers = data.dateSet;
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })
    }
    else if (roleName == "Final Approver") {
      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.finalApproverUsers = data.dateSet;
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })
    }
    else if (roleName == "Reviewer") {
      this.accessGroupsService.getUsersBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID, this.CurrentUserProfile[0].zoneID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.reviewerUsers = data.dateSet;
          this.getReviewerForLink();
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })
    }
    else if (roleName == "EMB") {
      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.EMBUsers = data.dateSet;
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })
    }
    else if (roleName == "Developer") {
      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.developerUsers = data.dateSet;
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })
    }
    else if (roleName == "Permit Issuer") {

      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.permitIssuer = data.dateSet;
          console.log("YEAHHHHHHHHHHHHHH", this.permitIssuer);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("getAllLinkedRolesReponse", data);

      }, error => {
        console.log("getAllLinkedRolesReponseError: ", error);
      })
    }
    else {
      alert("Could not find AG");
    }





  }

  //Same as the above code, only, instead of using the subdepartmentID of the logged in user, we are passing this parameter.
  getUserBySubDepartmentAndRoleName(subDepartmentID?: number | null, roleName?: string | null): Observable<any> {
    if (roleName == "Department Admin") {
      return this.accessGroupsService.GetUserAndZoneBasedOnRoleName(roleName, subDepartmentID);
    }
    else if (roleName == "Senior Reviewer") {
      return this.accessGroupsService.getUserBasedOnRoleName(roleName, subDepartmentID);
    }
    else if (roleName == "Final Approver") {
      return this.accessGroupsService.getUserBasedOnRoleName(roleName, subDepartmentID);
    }
    else if (roleName == "Reviewer") {
      return this.accessGroupsService.getUserBasedOnRoleName(roleName, subDepartmentID);
    }
    else if (roleName == "EMB") {
      return this.accessGroupsService.getUserBasedOnRoleName(roleName, subDepartmentID);
    }
    else if (roleName == "Developer") {
      return this.accessGroupsService.getUserBasedOnRoleName(roleName, subDepartmentID);
    }
    else {
      alert("Could not find AG");
      return null;
    }
  }

  //im here
  moveToFinalApprovalForDepartment() {
    //this.getUsersByRoleName("Department Admin");

    this.subDepartmentForCommentService.departmentForCommentFinalAppovalUserToComment(this.forManuallyAssignSubForCommentID, "All users in Subdepartment FA").subscribe((data: any) => {

      if (data.responseCode == 1) {


        this.viewProjectInfoComponent.getAllComments();
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


  }

  onHopperClick() {

    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        const current = data.dateSet[0];
        this.SubForCommentIDForHopper = current.subDepartmentForCommentID;



        if (confirm("Are you sure you what to assign this project to you?")) {

          this.subDepartmentForCommentService.departmentForCommentUserAssaignedToComment(this.SubForCommentIDForHopper, this.CurrentUser.appUserId).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              this.viewProjectInfoComponent.getAllComments();
              this.hopperButton = false;
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
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllUsersLinkedToZoneByZoneID() {


    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];


        this.zoneService.getUsersLinkedByZoneID(current.zoneID).subscribe((data: any) => {


          if (data.responseCode == 1) {

            for (let i = 0; i < data.dateSet.length; i++) {
              const tempZoneList = {} as UserZoneList;
              const current = data.dateSet[i];
              tempZoneList.id = current.id;
              tempZoneList.fullName = current.fullName;
              tempZoneList.zoneLinkID = current.zoneLinkID;
              tempZoneList.Email = current.email;

              this.UserZoneList.push(tempZoneList);
            }
            this.setRoles();

            this.CheckIfCurrentUserCanUseHopper();
          }
          else {
            alert(data.responseMessage);
          }
          console.log("reponse", data);



        }, error => {
          console.log("Error: ", error);
        })

        this.viewSelectedUserForApplication();

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })





  }




  //getAllComments() {

  //  this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {

  //    if (data.responseCode == 1) {
  //      for (let i = 0; i < data.dateSet.length; i++) {

  //        const current = data.dateSet[i];




  //      }
  //    }
  //    else {
  //      alert(data.responseMessage);

  //    }
  //    console.log("reponse", data);

  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  //}

  //ChangeApplicationStatusToFinalApproval() {



  //  if (this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Unpaid") {
  //    this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].PreviousStageName, this.CurrentApplicationBeingViewed[0].PreviousStageNumber, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, this.CurrentApplicationBeingViewed[0].NextStageName, this.CurrentApplicationBeingViewed[0].NextStageNumber, "Paid").subscribe((data: any) => {

  //      if (data.responseCode == 1) {
  //        alert("Application Status Updated to Paid");

  //      }
  //      else {
  //        alert(data.responseMessage);
  //      }
  //      console.log("responseAddapplication", data);
  //    }, error => {
  //      console.log("Error", error);
  //    })

  //  }
  //  else {
  //    alert("Application Status Is Not Unpaid");
  //  }


  //}
  totalAmount: number;
  rate: number;
  description: string;
  quantity: number;
  totalCheckVat: boolean = false;
  totalCheck: boolean = false;
  remarks = '';
  vatApp = '';
  calculateTotalAmount() {

    let rateVat = this.depositRequired.controls["total"].value;
    this.vatApp = this.depositRequired.controls["vatApplicable"].value;
    this.rate = Number(this.depositRequired.controls["rate"].value);
    this.description = this.depositRequired.controls["description"].value;
    this.quantity = Number(this.depositRequired.controls["quantity"].value);
    if (this.vatApp == "true") {
      this.totalAmount = this.quantity * Number(rateVat);
      this.totalCheckVat = true;
      console.log(this.totalAmount);
    }
    else {
      this.totalAmount = Number(this.rate) * Number(this.quantity);
      console.log(this.totalAmount);
      this.totalCheck = true;
    }

  }

  onDepositRequiredClick() {

    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    let serviceItemCode = this.selectSI;
    this.rate = Number(this.depositRequired.controls["rate"].value);
    this.description = this.depositRequired.controls["description"].value;
    this.quantity = Number(this.depositRequired.controls["quantity"].value);
    this.remarks = this.depositRequired.controls["remarks"].value;
    let rateVat = this.depositRequired.controls["total"].value;
    let vatApp = this.depositRequired.controls["vatApplicable"].value
    //let total = this.depositRequired.controls["total"].value;

    if (vatApp === "True") {
      this.totalAmount = this.quantity * Number(rateVat);
    }
    else {
      this.totalAmount = Number(this.rate) * Number(this.quantity);
    }


    this.depositRequiredService.addUpdateDepositRequired(0, this.forManuallyAssignSubForCommentID, this.rate, this.ApplicationID, this.description, this.loggedInUsersSubDepartmentID, this.quantity, this.CurrentUser.appUserId, SubDepartmentName, null, null, this.totalAmount, this.remarks, this.selectSI).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert("Deposit Required");
        this.hopperButton = false;
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
    console.log(this.selectSI);
    alert(this.selectSI);

  }

  onComment(interact: any) {
    debugger;
    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    //console.log("SubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentName", SubDepartmentName);

    switch (interact) {

      case "Approve": {

        debugger;
        if (this.WBSCheck == true) {

          //SubDepartmentForCommentService
          this.onDepositRequiredClick();
          if (confirm("Are you sure you want to approve this application?")) {
            this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved(Conditional)", null, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

              if (data.responseCode == 1) {
                const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have provisionally approved application ${this.projectNo}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



                this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application provisionally approved", emailContent, emailContent);

                this.accessGroupsService.getUserBasedOnRoleName("FinalApprover", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

                  if (data.responseCode == 1) {

                    console.log(data.dateSet);

                    console.log("this.departmentAdminUsersgetAllLinkedRolesReponsethis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsers", this.departmentAdminUsers);
                  }
                  else {
                    alert(data.responseMessage);
                  }
                  console.log("getAllLinkedRolesReponse", data);

                }, error => {
                  console.log("getAllLinkedRolesReponseError: ", error);
                })

/*                  this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application provisionally approved", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You have approved application " + this.projectNo + ".<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/                  this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application provisionally approved", false, this.CurrentUserProfile[0].UserID, this.CurrentUserProfile[0].UserID, this.ApplicationID, "You have approved application " + this.projectNo).subscribe((data: any) => {

                  if (data.responseCode == 1) {


                  }
                  else {
                    alert(data.responseMessage);
                  }

                  console.log("response", data);
                }, error => {
                  console.log("Error", error);
                });


                //commentsService
                this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Approved(Conditional)", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

                  if (data.responseCode == 1) {


                    this.viewProjectInfoComponent.getAllComments();

                  }
                  else {
                    alert(data.responseMessage);

                  }
                  console.log("reponse", data);

                }, error => {
                  console.log("Error: ", error);
                })


              }
              else {
                alert(data.responseMessage);

              }
              console.log("reponse", data);


            }, error => {
              console.log("Error: ", error);
            })


            //this is for the wbs number to be sent to the table

            let SubDepartmentName = "";
            for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
              if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
                SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
              }
            }
            let serviceItemCode = this.depositRequired.controls["selectServiceItemCode"].value;
            let rate = this.depositRequired.controls["rate"].value;
            let description = this.depositRequired.controls["description"].value;
            let quantity = this.depositRequired.controls["quantity"].value;
            //let total = this.depositRequired.controls["total"].value;


            this.applicationsService.addUpdateApplication(this.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.WBSCheck, null).subscribe((data: any) => {

              if (data.responseCode == 1) {
                alert("Updated Applications WBS");



              }
              else {
                alert(data.responseMessage);

              }
              console.log("reponse", data);

            }, error => {
              console.log("Error: ", error);
            })



            /* this.depositRequiredService.addUpdateDepositRequired(0, this.forManuallyAssignSubForCommentID, Number(rate), this.ApplicationID, description, this.loggedInUsersSubDepartmentID, Number(quantity), this.CurrentUser.appUserId, SubDepartmentName, serviceItemCode, "True").subscribe((data: any) => {

               if (data.responseCode == 1) {

                 alert(data.responseMessage);

                 this.hopperButton = false;
               }
               else {
                 alert(data.responseMessage);

               }
               console.log("reponse", data);

             }, error => {
               console.log("Error: ", error);
             })*/
            this.refreshParent.emit();
            this.moveToFinalApprovalForDepartment();
            this.modalService.dismissAll();
            this.router.navigate(["/home"]);
          }
        }


        else {
          if (confirm("Have you uploaded all revelevant documents?")) {
            if (confirm("Are you sure you want to approve this application?")) {

              this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved", false, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {yu
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;

            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have provisionally approved application ${this.projectNo}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



                  this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application provisionally approved", emailContent, emailContent);

                  this.accessGroupsService.GetUserAndZoneBasedOnRoleName("Final Approver", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
                    if (data.responseCode === 1) {
                      // Filter out duplicates based on a unique property (e.g., email)
                      const uniqueFinalApprovers = this.getUniqueFinalApprovers(data.dateSet, 'email');

                      // Filter out final approvers for the current zone
                      const finalApproversForCurrentZone = uniqueFinalApprovers.filter(approver => approver.zoneID === this.CurrentUserProfile[0].zoneID);
                      finalApproversForCurrentZone.forEach(approver => {
                        const emailContent12 = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${approver.fullName}</p>
            <p>Your sign-off is required on ${this.projectNo}. Kindly login to the Wayleave Management System and proceed accordingly.</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;/*jjs commit 23JAN24 - typoFix for Email for Sign off, Applicant filter dashbaord table fix*/
                        this.notificationsService.sendEmail(approver.email, "Request for Sign-off", emailContent12, emailContent12);
                      });
                      console.log("Filtered Final Approvers:", finalApproversForCurrentZone);
                    } else {
                      alert(data.responseMessage);
                    }
                  }, error => {
                    console.log("Error fetching final approvers:", error);
                  });

                // Function to get unique final approvers based on a property

/*                this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application provisionally approved", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You have approved application " + this.projectNo + ".<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/                this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application provisionally approved", false, this.CurrentUser.appUserID, this.CurrentUser.appUserID, this.ApplicationID, "You have approved application " + this.projectNo).subscribe((data: any) => {

                    if (data.responseCode == 1) {


                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });


                  //commentsService                                                                                                                                                              //Change Wording Kyle 15/01/24
                  this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Provisionally Approved", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

                    if (data.responseCode == 1) {


                      this.viewProjectInfoComponent.getAllComments();
                    }
                    else {
                      alert(data.responseMessage);

                    }
                    console.log("reponse", data);

                  }, error => {
                    console.log("Error: ", error);
                  })
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
              /*  this.moveToFinalApprovalForDepartment();*/
              this.modalService.dismissAll();
              this.openSnackBar("Application Actioned");
              this.router.navigate(["/home"]);

            }

          }
        }
        break;
      }

      case "Reject": {
        debugger;
        if (confirm("Are you sure you want to reject this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Rejected", null, null, "All users in Subdepartment FA", false).subscribe((data: any) => {

            if (data.responseCode == 1) {
              const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have not supported application ${this.projectNo} and have provided the following comment:</p>
            <p>${this.leaveAComment}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application disapproved", emailContent, emailContent);
              /*              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application disapproved", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You have disapproved application " + this.projectNo + "with comment: <br><br><i>" + this.leaveAComment  + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
              */
              // #region what's up with this case?
              debugger;
              this.accessGroupsService.getUserBasedOnRoleName("FinalApprover", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
                debugger;
                if (data.responseCode == 1) {
                  debugger;
                  console.log(data.dateSet);

                  console.log("this.departmentAdminUsersgetAllLinkedRolesReponsethis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsersthis.departmentAdminUsers", this.departmentAdminUsers);
                }
                else {
                  alert(data.responseMessage);
                }
                console.log("getAllLinkedRolesReponse", data);

              }, error => {
                console.log("getAllLinkedRolesReponseError: ", error);
              })
              // #endregion


              this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application Disapproved", false, this.CurrentUser.appUserID, this.CurrentUser.appUserID, this.ApplicationID, "You have disapproved application " + this.projectNo + "with comment:" + this.leaveAComment).subscribe((data: any) => {

                if (data.responseCode == 1) {


                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });


              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Rejected", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {
                if (data.responseCode == 1) {


                  this.viewProjectInfoComponent.getAllComments();
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          this.moveToFinalApprovalForDepartment();
          this.modalService.dismissAll();
          this.openSnackBar("Application Actioned");
          this.router.navigate(["/home"]);
        }

        break;
      }

      case "Clarify": {

        // this.getDepartmentManagerUserID("Senior Reviewer");
        if (confirm("Are you sure you want to get clarity from applicant for this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Clarify", true, null, this.CurrentApplicant, null).subscribe((data: any) => {

            if (data.responseCode == 1) {
              const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have requested clarity on ${this.projectNo} with the comment:</p>
            <p>${this.leaveAComment}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Request for clarification", emailContent, emailContent);
              /*              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Request for clarification", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You have asked the applicant to clarify the application " + this.projectNo + " with comment: <br><br><i>" + this.leaveAComment + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
              */
              const emailContentApp = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.applicationData.clientName}</p>
            <p>A reviewer has asked you to clarify your application ${this.projectNo} with the comment:</p>
            <p>${this.leaveAComment}</p>
               <p >Please login to the <a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a> and provide a response</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



              this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.ApplicationID, emailContentApp, emailContentApp);
/*              this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.ApplicationID, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>A reviewer has asked that you clarify your application " + this.ApplicationID + " with comment: <br><br><i>" + this.leaveAComment + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/              this.notificationsService.addUpdateNotification(0, "Wayleave Application Request", "Request for clarification", false, this.CurrentUser.appUserID, this.CurrentUser.appUserID, this.ApplicationID, "You have asked the applicant to clarify the application " + this.projectNo + " with comment:" + this.leaveAComment).subscribe((data: any) => {

                if (data.responseCode == 1) {


                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });
              this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Request for clarificaion", false, this.CurrentUser.appUserID, this.applicationData.userID, this.ApplicationID, "A reviewer has asked that you clarify your application " + this.ApplicationID + " with comment:" + this.leaveAComment).subscribe((data: any) => {

                if (data.responseCode == 1) {


                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });

              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Clarify", this.CurrentUser.appUserId, null, null, this.loggedInUserName).subscribe((data: any) => {

                if (data.responseCode == 1) {


                  this.viewProjectInfoComponent.getAllComments();
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
              this.refreshParent.emit();
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          // alert("In progress");
          this.modalService.dismissAll();
          this.openSnackBar("Application Actioned");
          this.router.navigate(["/home"]);
        }
        break;
      }
      case "Refer": {



        if (confirm("Are you sure you want to refer this application to Senior Reviewers?")) {

          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Referred", false, true, "Senior Reviewer to comment", false).subscribe((data: any) => {

            if (data.responseCode == 1) {
              const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have escalated application ${this.projectNo} with the comment:</p>
            <p>${this.leaveAComment}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;

              this.accessGroupsService.GetUserAndZoneBasedOnRoleName("Senior Reviewer", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
                if (data.responseCode === 1) {
                  // Filter out duplicates based on a unique property (e.g., email)
                  const uniqueFinalApprovers = this.getUniqueFinalApprovers(data.dateSet, 'email');

                  // Filter out final approvers for the current zone
                  const finalApproversForCurrentZone = uniqueFinalApprovers.filter(approver => approver.zoneID === this.CurrentUserProfile[0].zoneID);
                  finalApproversForCurrentZone.forEach(approver => {
                    const emailContent12 = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${approver.fullName}</p>
            <p>${this.loggedInUserName} has requested your perusal of ${this.projectNo}with comment:</p>
            <p>${this.leaveAComment}. Kindly login to the Wayleave Management System and provide input.</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;
                    this.notificationsService.sendEmail(approver.email, "Request for Perusal", emailContent12, emailContent12);
                  });
                  console.log("Filtered Final Approvers:", finalApproversForCurrentZone);
                } else {
                  alert(data.responseMessage);
                }
              }, error => {
                console.log("Error fetching final approvers:", error);
              });

              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application escalated", emailContent, emailContent);
/*                this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application escalated", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You have escalated application " + this.projectNo + " with comment: <br><br><i>" + this.leaveAComment + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/                this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application escalated", false, this.CurrentUser.appUserID, this.CurrentUserProfile[0].UserID, this.ApplicationID, "You have escalated application " + this.projectNo + " with comment:" + this.leaveAComment).subscribe((data: any) => {

                if (data.responseCode == 1) {


                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });

              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName,




                this.leaveAComment, "Referred", this.CurrentUser.appUserId, null, null, this.loggedInUserName).subscribe((data: any) => {

                  if (data.responseCode == 1) {

                    alert(data.responseMessage);
                    this.viewProjectInfoComponent.getAllComments();
                  }
                  else {
                    alert(data.responseMessage);

                  }
                  console.log("reponse", data);

                }, error => {
                  console.log("Error: ", error);
                })
              this.refreshParent.emit();
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          //alert("In progress");
          this.modalService.dismissAll();
          this.openSnackBar("Application Actioned");
          this.router.navigate(["/home"]);
        }



        break;
      }


      default: {

        break;
      }
    }
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 4 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }
  getUniqueFinalApprovers(approvers: any[], property: string): any[] {
    const uniqueApproversMap = new Map();
    for (const approver of approvers) {
      uniqueApproversMap.set(approver[property], approver);
    }
    return Array.from(uniqueApproversMap.values());
  }

  onCommentSR(interact: any) {
    debugger;
    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    //console.log("SubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentName", SubDepartmentName);

    switch (interact) {

      case "Approve": {


        //if (this.checked == true) {
        if (this.WBSCheck == true) { //seniorReviewer Sindiswa 19 January 2024

          //SubDepartmentForCommentService
          this.onDepositRequiredClick();
          if (confirm("Have you uploaded all revelevant documents?")) {
            if (confirm("Are you sure you want to approve this application?")) {

              this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved(Conditional)", false, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have approved application ${this.projectNo}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



                  this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application approved", emailContent, emailContent);
                  /*                this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application approved", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You, as a senior reviewer, have approved application " + this.projectNo + ".<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  */
                  this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application provisionally approved", false, this.CurrentUser.appUserID, this.CurrentUser.appUserID, this.ApplicationID, "You, as a senior reviewer, have approved application " + this.projectNo).subscribe((data: any) => {
                    debugger;
                    if (data.responseCode == 1) {
                      alert(data.responseMessage);

                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });

                  //alert(data.responseMessage);

                  //commentsService
                  this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Approved(Conditional)", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

                    if (data.responseCode == 1) {


                      alert(data.responseMessage);
                      this.viewProjectInfoComponent.getAllComments();

                    }
                    else {
                      alert(data.responseMessage);

                    }
                    console.log("reponse", data);

                  }, error => {
                    console.log("Error: ", error);
                  })


                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);


              }, error => {
                console.log("Error: ", error);
              })


              //this is for the wbs number to be sent to the table

              let SubDepartmentName = "";
              for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
                if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
                  SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
                }
              }
              let serviceItemCode = this.depositRequired.controls["selectServiceItemCode"].value;
              let rate = this.depositRequired.controls["rate"].value;
              let description = this.depositRequired.controls["description"].value;
              let quantity = this.depositRequired.controls["quantity"].value;
              //let total = this.depositRequired.controls["total"].value;


              this.depositRequiredService.addUpdateDepositRequired(0, this.forManuallyAssignSubForCommentID, Number(rate), this.ApplicationID, description, this.loggedInUsersSubDepartmentID, Number(quantity), this.CurrentUser.appUserId, SubDepartmentName, serviceItemCode, "True").subscribe((data: any) => {

                if (data.responseCode == 1) {

                  alert(data.responseMessage);
                  this.hopperButton = false;
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })

              //}
              this.refreshParent.emit();
              this.moveToFinalApprovalForDepartment();
              this.modalService.dismissAll();
              this.router.navigate(["/home"]);
            }
          }
        }
        else {
          if (confirm("Have you uploaded all revelevant documents?")) {
            if (confirm("Are you sure you want to approve this application?")) {

              this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved", false, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

                if (data.responseCode == 1) {

                  alert(data.responseMessage);

                  // #region seniorReviewer Sindiswa 19 January 2024
                  const emailContent = `
    <html>
    <head>
      <style>
        /* Define your font and styles here */
        body {yu
         font-family: 'Century Gothic';
        }
        .email-content {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .footer {
          margin-top: 20px;
          color: #777;

        }
        .footer-logo {
          display: inline-block;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <div class="email-content">
        <p>Dear ${this.loggedInUserName}</p>
        <p>You have provisionally approved application ${this.projectNo}</p>
           <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                      <p>
          <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
        </p>
         <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
      </div>

    </body>
  </html>
 
       
`;



                  this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application provisionally approved", emailContent, emailContent);

                  this.accessGroupsService.GetUserAndZoneBasedOnRoleName("Final Approver", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
                    if (data.responseCode === 1) {
                      // Filter out duplicates based on a unique property (e.g., email)
                      const uniqueFinalApprovers = this.getUniqueFinalApprovers(data.dateSet, 'email');

                      // Filter out final approvers for the current zone
                      const finalApproversForCurrentZone = uniqueFinalApprovers.filter(approver => approver.zoneID === this.CurrentUserProfile[0].zoneID);
                      finalApproversForCurrentZone.forEach(approver => {
                        const emailContent12 = `
    <html>
    <head>
      <style>
        /* Define your font and styles here */
        body {
         font-family: 'Century Gothic';
        }
        .email-content {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .footer {
          margin-top: 20px;
          color: #777;
        }
        .footer-logo {
          display: inline-block;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <div class="email-content">
        <p>Dear ${approver.fullName}</p>
        <p>Your sign-off is required on ${this.projectNo}. Kindly login to the Wayleave Management System and proceed accordingly.</p>
           <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                      <p>
          <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
        </p>
         <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
      </div>

    </body>
  </html>
 
       
`;
                        this.notificationsService.sendEmail(approver.email, "Request for Sign-of", emailContent12, emailContent12);
                      });
                      console.log("Filtered Final Approvers:", finalApproversForCurrentZone);
                    } else {
                      alert(data.responseMessage);
                    }
                  }, error => {
                    console.log("Error fetching final approvers:", error);
                  });

                  // Function to get unique final approvers based on a property

                  this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application provisionally approved", false, this.CurrentUser.appUserID, this.CurrentUser.appUserID, this.ApplicationID, "You have approved application " + this.projectNo).subscribe((data: any) => {

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


                  //commentsService                                                                                                                                                             //Change Wording Kyle 15/01/24
                  this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Provisionally Approved", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

                    if (data.responseCode == 1) {

                      alert(data.responseMessage);
                      this.viewProjectInfoComponent.getAllComments();
                    }
                    else {
                      alert(data.responseMessage);

                    }
                    console.log("reponse", data);

                  }, error => {
                    console.log("Error: ", error);
                  })
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })

            }

            this.moveToFinalApprovalForDepartment();
            this.modalService.dismissAll();
            this.router.navigate(["/home"]);


          }

        }

        break;
      }

      case "Reject": {
        if (confirm("Are you sure you want to reject this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Rejected", false, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Rejected", this.CurrentUser.appUserId, null, this.loggedInUserName).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You have not supported application ${this.projectNo} and have provided the following comment:</p>
              <p>${this.leaveAComment}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



                  this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application disapproved", emailContent, emailContent);
/*                  this.notificationsService.sendEmail(this.loggedInUsersEmail, "Application disapproved", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You, as a senior reviewer, have disapproved application " + this.projectNo + "with comment: <br><br><i>" + this.leaveAComment + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/                  this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application Disapproved", false, this.CurrentUser.appUserID, this.CurrentUserProfile[0].UserID, this.ApplicationID, "You, as a senior reviewer, have disapproved application " + this.projectNo + "with comment:" + this.leaveAComment).subscribe((data: any) => {

                    if (data.responseCode == 1) {
                      alert(data.responseMessage);

                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });

                  alert(data.responseMessage);
                  this.viewProjectInfoComponent.getAllComments();
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          this.moveToFinalApprovalForDepartment();
          this.modalService.dismissAll();
          this.router.navigate(["/home"]);
        }

        break;
      }

      case "Clarify": {
        // this.getDepartmentManagerUserID("Senior Reviewer");
        if (confirm("Are you sure you want to get clarity from applicant for this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Clarify", true, null, this.CurrentApplicant, null).subscribe((data: any) => {

            if (data.responseCode == 1) {
              const emailContent = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.loggedInUserName}</p>
            <p>You, as a senior reviewer, have asked the applicant to clarify the application ${this.projectNo} with comment:</p>
              <p>${this.leaveAComment}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Request for clarification", emailContent, emailContent);
              /*              this.notificationsService.sendEmail(this.loggedInUsersEmail, "Request for clarification", "Check html", "Dear " + this.loggedInUserName + ",<br><br>You, as a senior reviewer, have asked the applicant to clarify the application " + this.projectNo + " with comment: <br><br><i>" + this.leaveAComment + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
              */
              const emailContent2 = `
        <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.applicationData.clientName}</p>
            <p>A reviewer has asked that you clarify your application ${this.projectNo} with comment:</p>
              <p>${this.leaveAComment}</p>
               <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
     
           
    `;



              this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.projectNo, emailContent2, emailContent2);
/*              this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.projectNo, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>A reviewer has asked that you clarify your application " + this.projectNo + " with comment: <br><br><i>" + this.leaveAComment + "</i><br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/              this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Request for clarification", false, this.CurrentUserProfile[0].UserID, this.CurrentUserProfile[0].UserID, this.ApplicationID, "You, as a senior reviewer, have asked the applicant to clarify the application " + this.projectNo + " with comment:" + this.leaveAComment).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  alert(data.responseMessage);

                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });
              this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Request for clarification", false, this.CurrentUserProfile[0].UserIDhis.CurrentUser.UserID, this.applicationData.userID, this.ApplicationID, "A reviewer has asked that you clarify your application " + this.projectNo + " with comment: " + this.leaveAComment).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  alert(data.responseMessage);

                }
                else {
                  alert(data.responseMessage);
                }

                console.log("response", data);
              }, error => {
                console.log("Error", error);
              });

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Clarify", this.CurrentUser.appUserId, null, null, this.loggedInUserName).subscribe((data: any) => {

                if (data.responseCode == 1) {

                  alert(data.responseMessage);
                  this.viewProjectInfoComponent.getAllComments();
                }
                else {
                  alert(data.responseMessage);

                }
                console.log("reponse", data);

              }, error => {
                console.log("Error: ", error);
              })
              this.refreshParent.emit();
            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
          // alert("In progress");
          this.modalService.dismissAll();
          this.router.navigate(["/home"]);
        }
        break;
      }





      default: {

        break;
      }
    }
  }


  getAllUsersLinkedToZone(SubDepartmentID: any) {

    this.ZoneList.splice(0, this.ZoneList.length);

    this.zoneService.getZonesBySubDepartmentsID(SubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;


          this.ZoneList.push(tempZoneList);
          this.ZoneListTable?.renderRows();

        }
        console.log("this.ZoneListthis.ZoneListthis.ZoneListthis.ZoneList", this.ZoneList);
        this.ZoneListTable?.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      this.ZoneListTable?.renderRows();


    }, error => {
      console.log("Error: ", error);
    })
  }

  CheckIfCurrentUserCanUseHopper() {

    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.SubDepartmentLinkedList[i].UserAssaignedToComment == undefined) {

        for (var a = 0; a < this.UserZoneList.length; a++) {
          if (this.CurrentUser.appUserId == this.UserZoneList[a].id) {
            this.hopperButton = true;
            return;
          }
        }

      }
      else {
        this.hopperButton = false;
      }

    }

  }


  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  depositReqModal(deposit: any) {
    this.modalService.open(deposit, { backdrop: 'static', size: 'xl' });
  }

  openAssignToZone(assignProjectToZone: any) {
    //this.getAllSubDepartments();

    this.modalService.open(assignProjectToZone, { backdrop: 'static', size: 'xl' });
  }

  openAssignToUser(assignProjectToUser: any) {
    this.modalService.open(assignProjectToUser, { backdrop: 'static', size: 'xl' });
  }
  openAssignDepartment(assign: any) {
    this.modalService.open(assign, { backdrop: 'static', size: 'xl' });
  }
  openDepositOrWBSOption(depositOrWBSNumber: any) {
    this.modalService.open(depositOrWBSNumber, { centered: true });
  }
  enterWBSNumberModal(wbsNumberModal: any) {
    this.modalService.open(wbsNumberModal, { backdrop: 'static', size: 'xl' });
  }

  uncheck() {
    this.checked = false;
  }
  check() {
    this.checked = true;
    alert("Deposit Saved!");
  }
  panelOpenState = false;


  getAllSubDepartments() {


    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.SubDepartmentLinkedList.splice(0, this.SubDepartmentLinkedList.length);

    this.subDepartment.getAllNotLinkedSubDepartmentsForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];

          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;

          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);
          this.SubDepartmentListTable?.renderRows();
        }

        this.SubDepartmentListTable?.renderRows();
        // this.modalService.open(assign, { size: 'xl' });
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
        this.SubDepartmentListTable?.renderRows();

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    this.subDepartment.getAllLinkedSubDepartmentsForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentLinkedList = {} as SubDepartmentList;
          const current = data.dateSet[i];

          tempSubDepartmentLinkedList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentLinkedList.UserAssaignedToComment = current.userAssaignedToComment;
          tempSubDepartmentLinkedList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentLinkedList.departmentID = current.departmentID;
          tempSubDepartmentLinkedList.dateUpdated = current.dateUpdated;
          tempSubDepartmentLinkedList.dateCreated = current.dateCreated;
          tempSubDepartmentLinkedList.zoneID = current.zoneID;
          tempSubDepartmentLinkedList.subdepartmentForCommentID = current.subDepartmentForCommentID;

          this.SubDepartmentLinkedList.push(tempSubDepartmentLinkedList);
          this.SubDepartmentListTable?.renderRows();
        }

        this.setRoles();
        this.SubDepartmentListTable?.renderRows();
        this.SubDepartmentLinkedListTable?.renderRows();
        // this.modalService.open(assign, { size: 'xl' });
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
        this.SubDepartmentListTable?.renderRows();
        this.SubDepartmentLinkedListTable?.renderRows();

      }
      console.log("reponseGetAllLinkedSubDepartmentsForComment", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  deleteLinkedDepartmentForComment(index: number) {


    if (confirm("Are you sure to delete " + this.SubDepartmentLinkedList[index].subDepartmentName + "?")) {

      this.subDepartmentForCommentService.deleteDepartmentForComment(this.SubDepartmentLinkedList[index].subdepartmentForCommentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

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
  }

  populateComment(commentName: any) {
    //let currnetComment = this.leaveAComment;
    //console.log("commentName", commentName);
    //this.leaveAComment = currnetComment + " " + commentName;

    this.leaveAComment = commentName;
  }

  populateCommentPermit(commentName: any) {
    let currnetComment = this.leaveACommentPermit;
    console.log("commentName", commentName);
    this.leaveACommentPermit = currnetComment + " " + commentName;
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

  selectServiceItemCode(event: any, deposit: any) {

  }

  getAllServiceItmesForDropdown(deposit: any) {


    this.serviceItemService.getAllServiceItem().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemCodeDropdown;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;

          this.ServiceItemCodeDropdown.push(tempServiceItemList);
        }
        this.modalService.open(deposit, { backdrop: 'static', size: 'xl' });
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

  //getAllServiceItmes() {
  //  this.ServiceItemList.splice(0, this.ServiceItemList.length);

  //  this.serviceItemService.getAllServiceItem().subscribe((data: any) => {
  //    if (data.responseCode == 1) {


  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempServiceItemList = {} as ServiceItemList;
  //        const current = data.dateSet[i];
  //        tempServiceItemList.serviceItemID = current.serviceItemID;
  //        tempServiceItemList.serviceItemCode = current.serviceItemCode;
  //        tempServiceItemList.Description = current.description;
  //        tempServiceItemList.Rate = current.rate;
  //        tempServiceItemList.totalVat = current.totalVat;
  //        tempServiceItemList.dateCreated = current.dateCreated;
  //        this.ServiceItemList.push(tempServiceItemList);
  //      }

  //    }
  //    else {
  //      //alert("Invalid Email or Password");
  //      alert(data.responseMessage);
  //    }
  //    console.log("reponse", data);

  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  // 

  //}

  onPopulateDeposit() {

    let selectedServiceItem = Number(this.selectSI);

    console.log("THIS IS THE SERVICE ITEM CODE", selectedServiceItem);

    this.serviceItemService.getServiceItemByServiceItemID(selectedServiceItem).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;
          this.depositRequired.controls["vatApplicable"].setValue(current.vatApplicable);
          this.depositRequired.controls["description"].setValue(current.description);
          this.depositRequired.controls["rate"].setValue(current.rate);
          this.depositRequired.controls["total"].setValue(current.totalVat);
          this.depositRequired.controls["remarks"].setValue(current.remarks);
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

  departmentSelectedForLink(department: any) {

    this.selection.toggle(department);

  }


  userSelectedForManualLink(user: any) {
    this.UserSelectionForManualLink.clear();
    this.UserSelectionForManualLink.toggle(user);

  }

  zoneSelectedForLink(zone: any) {

    this.zoneSelection.toggle(zone);

  }

  onLinkDepartmentForComment() {



    const selectDepartments = this.selection.selected;




    for (var i = 0; i < selectDepartments.length; i++) {
      this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.ApplicationID, selectDepartments[i].subDepartmentID, selectDepartments[i].subDepartmentName, null, null, this.CurrentUser.appUserId, null, null).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.dateSet.subDepartmentName + " assigned to this Application");

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


  onLinkZoneForComment() {

    const selectZones = this.zoneSelection.selected;


    for (var i = 0; i < selectZones.length; i++) {
      this.zoneForCommentService.addUpdateZoneForComment(0, selectZones[i].subDepartmentID, this.ApplicationID, selectZones[i].zoneID, selectZones[i].zoneName, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.dateSet.zoneName + " assigned to this Application");
          this.getLinkedZones();
          this.viewProjectInfoComponent.getAllComments();
          this.refreshParent.emit();
          this.modalService.dismissAll();
        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponseAddUpdateZoneForComment", data);


      }, error => {
        console.log("Error: ", error);
      })
    }



  }


  getLinkedZones() {

    this.ZoneLinkedList.splice(0, this.ZoneLinkedList.length);

    this.zoneForCommentService.getZonesForComment(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;
          tempZoneList.zoneForCommentID = current.zoneForCommentID;


          this.ZoneLinkedList.push(tempZoneList);
          this.ZoneListTable?.renderRows();

        }


        this.ZoneListTable?.renderRows();
        this.getAllUsersLinkedToZoneByZoneID();


      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      this.ZoneListTable?.renderRows();


    }, error => {
      console.log("Error: ", error);
    })

  }
  @Output() dataEvent = new EventEmitter<string>();



  CheckALLLinkedDepartmentsCommented(isPlanning: boolean) {


    if (isPlanning === false) {

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
            tempSubDepartmentList.commentStatus = current.commentStatus;


            if (tempSubDepartmentList.commentStatus == "Final Approved") {
              this.countApprove++;
            }
            if (tempSubDepartmentList.commentStatus == "Rejected") {
              this.countReject++;
            }

            this.SubDepartmentListForCheck.push(tempSubDepartmentList);
          }

          if (this.SubDepartmentListForCheck.length == this.countApprove) {
            /*          this.viewProjectInfoComponent.getAllCommentsForSpecialConditions();*/


            /*          this.viewProjectInfoComponent.getAllSubDepForFinalApprove();*/


            this.viewProjectInfoComponent.getAllComments();


            this.countApprove = 0;
            this.countReject = 0;
            /*          this.viewProjectInfoComponent.onCreateApprovalPack();*/
            this.MoveToNextStage();
          } else if (this.countReject++ >= 1 && this.SubDepartmentListForCheck.length == this.countApprove + this.countReject) {
            //Rejection Pack
            this.viewProjectInfoComponent.getAllComments();
            this.viewProjectInfoComponent.onCrreateRejectionPack();
            this.countApprove = 0;
            this.countReject = 0;
            this.MoveToClosedStage(false);
          }
          else {
            this.countApprove = 0;
            this.countReject = 0;
          }

        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForComment", data);


      }, error => {
        console.log("Error: ", error);
      })

    }
    else {

      /*planning application moves to closed*/
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
            tempSubDepartmentList.commentStatus = current.commentStatus;

            if (tempSubDepartmentList.commentStatus == "Completed") {
              this.countApprove++;
            }
            if (tempSubDepartmentList.commentStatus == "Rejected") {
              this.countReject++;
            }

            this.SubDepartmentListForCheck.push(tempSubDepartmentList);
          }

          if (this.SubDepartmentListForCheck.length == this.countApprove) {

            this.countApprove = 0;
            this.countReject = 0;
            this.MoveToClosedStage(true);
          }
           //Service Information Kyle 31/01/24
          else {
            this.modalService.dismissAll();
            this.router.navigate(["/home"]);
          }
           //Service Information Kyle 31/01/24
        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForComment", data);


      }, error => {
        console.log("Error: ", error);
      })

    }

  }

  MoveApplicationToAllocated() {

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
          tempSubDepartmentList.commentStatus = current.commentStatus;
          tempSubDepartmentList.UserAssaignedToComment = current.userAssaignedToComment;


          if (tempSubDepartmentList.UserAssaignedToComment != null) {
            this.assaignedToComment++;
          }
        }
        if (this.SubDepartmentListForCheck.length == this.assaignedToComment) {
          this.applicationsService.addUpdateApplication(this.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Distributed/Allocated", null, null, null).subscribe((data: any) => {

            if (data.responseCode == 1) {
              alert(data.responseMessage);
              this.assaignedToComment = 0;
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
          this.assaignedToComment = 0;
        }

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })


  }

  MoveToNextStage() {



    this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, this.StagesList[4].StageName, this.StagesList[4].StageOrderNumber, "APG").subscribe((data: any) => {

      if (data.responseCode == 1) {
        const emailContent = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.applicationData.clientName},</p>
            <p>Congratulations, your application with reference ${this.projectNo} has been approved. Please login to the Wayleave Management System and download your Wayleave Approval Pack.</p>
                <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>

        </body>
      </html>
    `;


        this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.projectNo, emailContent, emailContent);
/*        this.notificationsService.sendEmail(this.applicationData.clientEmail, "Wayleave Application #" + this.projectNo, "Check html", "Dear " + this.applicationData.clientName + ",<br><br>Congratulations, your application has been approved. Please log into the system to download your Approval Pack.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
*/        this.notificationsService.addUpdateNotification(0, "Wayleave Application", "Application approved", false, this.CurrentUserProfile[0].UserID, this.applicationData.userID, this.ApplicationID, "Congratulations, your application has been approved. Please log into the system to download your Approval Pack.").subscribe((data: any) => {

          if (data.responseCode == 1) {


          }
          else {
            alert(data.responseMessage);
          }

          console.log("response", data);
        }, error => {
          console.log("Error", error);
        });

        //Audit Trail KyleS
        this.onSaveToAuditTrail2("Approval pack generated for application");
        //Audit Trail Kyle
        alert("Application moved to Approval Pack Generation");

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

  MoveToClosedStage(isPlanning: boolean) {


    /*    if (isPlanning === false) {
          this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[this.StagesList.length].StageName, this.StagesList[this.StagesList.length].StageOrderNumber, this.StagesList[this.StagesList.length].StageName, this.StagesList[this.StagesList.length].StageOrderNumber, "Rejected & Closed").subscribe((data: any) => {
    
            if (data.responseCode == 1) {
                alert("Application Rejected & Moved To Closed");
    
    
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
        else {*/

     //Service Information Kyle 31/01/24
    if (isPlanning == false) {
      //Service Information Kyle 31/01/24

      this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[4].StageName, this.StagesList[4].StageOrderNumber, this.StagesList[5].StageName, this.StagesList[5].StageOrderNumber, this.StagesList[6].StageName, this.StagesList[6].StageOrderNumber, "Monitoring", null).subscribe((data: any) => {

        if (data.responseCode == 1) {
          //Audit Trail Kyle 
          this.onSaveToAuditTrail2("Permit to Work Generated");
          this.onSaveToAuditTrail2("Application Moved To Monitoring Stage");
          //Audit Traik Kyle 
          alert("Application Moved To Monitoring");
          this.modalService.dismissAll();
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
     //Service Information Kyle 31/01/24
    else {
      this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[6].StageName, this.StagesList[6].StageOrderNumber, "Null", null, "Closed", null).subscribe((data: any) => {

        if (data.responseCode == 1) {
         
          alert("Application Moved To Closed");
          this.modalService.dismissAll();
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
     //Service Information Kyle 31/01/24
    /*}*/


    //}

    //else if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[2].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Distributing") {

    //}
    //else {
    //  alert("Application Status Is Not Paid");
    //}


  }

  getLinkedDepartments() {


    this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (var i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempSubDepartmentList = {} as SubDepartmentList;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          tempSubDepartmentList.commentStatus = current.commentStatus;
          this.selection.toggle(tempSubDepartmentList);
          this.selection.isSelected(tempSubDepartmentList);

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


  deleteLinkedZoneForComment(index: number) {


    if (confirm("Are you sure to delete " + this.ZoneLinkedList[index].zoneName + "?")) {

      this.zoneForCommentService.deleteZoneForComment(this.ZoneLinkedList[index].zoneForCommentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getLinkedZones();
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

  getUserInternalOrExternal() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        console.log("data", data.dateSet);
        const currentUserProfile = data.dateSet[0];
        console.log("WOPERIWEPORIPWEOIRPOWERIOPWERIPOWEIRPWEORIPWOERIPWEORIPWEOIRPOWER", currentUserProfile.isInternal);

        if (currentUserProfile.isInternal == true) {

          this.isInternalUser = true;
          this.isExternalUser = false;

        }
        else {
          this.isInternalUser = false;
          this.isExternalUser = true;

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


  /*WBS Number*/

  onCreateWBSNumber() {

    let WBS = String(this.wbs.controls["wbsnumber"].value);

    this.depositRequiredService.addUpdateWBSNUmber(this.CurrentUser.appUserId, WBS).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.viewProjectInfoComponent.getAllComments();
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  //this is to send the wbs number request

  @Output() optionEvent = new EventEmitter<string>();

  sendOption() {
    this.optionEvent.emit(this.option);
  }


  getUserRoles() {

    const templist = this.sharedService.getCurrentUserRoles();

    for (var i = 0; i < templist.length; i++) {
      const current = templist[i];
      const newList = {} as RolesList;

      newList.RoleID = current.RoleID;
      newList.RoleName = current.RoleName;

      this.UserROle.push(newList);

    }
    console.log("this.UserROlethis.UserROlethis.UserROlethis.UserROlethis.UserROlethis.UserROlethis.UserROlethis.UserROlethis.UserROlethis.UserROle:", this.UserROle);
    //const role = {} as UserROle;
    //this.RolesList.push(role);
  }

  lockViewForUserAccordingToRole() {
    for (var i = 0; i < this.UserROle.length; i++) {
      /*      if (this.UserROle[i].RoleName=="")
          }*/
    }
  }

  /*This is for the planning wayleave for deps to upload documents*/
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';



  progress: number = 0;
  message = '';

  fileName: string = '';
  fileUploadName = '';
  @Input() UploadFor: any;
  fileExtention = '';
  fileToUpload: any;
  fName = '';
  loading: boolean = false;
  uploadFile = (files: any) => {

    if (files.length === 0) {
      return;
    }

    this.fileToUpload = <File>files[0];
    this.fileExtention = this.fileToUpload.name.substring(this.fileToUpload.name.indexOf('.'));
    this.fileUploadName = this.fileToUpload.name.substring(0, this.fileToUpload.name.indexOf('.')) + this.UploadFor;
    let fName = this.fileUploadName;
    this.fileAttrs[0] = fName;
  }



  saveDocument() {
    this.loading = true;
    this.saveBtn = false;



    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileUploadName + this.fileExtention);



    /* const filesForUpload = this.sharedService.pullFilesForUpload();
 
       const formData = new FormData();
       let fileExtention = filesForUpload[0].UploadFor.substring(filesForUpload[0].UploadFor.indexOf('.'));
       let fileUploadName = filesForUpload[0].UploadFor.substring(0, filesForUpload[0].UploadFor.indexOf('.')) + "-appID-" + this.ApplicationID;
       formData.append('file', filesForUpload[0].formData, fileUploadName + fileExtention);*/




    this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event) => {


          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = Math.round(100 * event.loaded / event.total);
          }
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.uploadFinished(event.body);

          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });


  }

  uploadFinished = (event: any) => {

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, this.CurrentUser.appUserId, this.CurrentUser.appUserId, null, this.loggedInUsersSubDepartmentID, this.loggedInUserSubDepartmentName, true).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.loading = false;
        this.saveBtn = true;
        alert("Document Has Uploaded");
        this.fileAttrs[0] = '';
        this.Approve();

      }
    }, error => {
      console.log("Error: ", error);
    })


  }
  loggedInUserSubDepartmentName = '';
  getCurrentUserSubDepName() {
    this.subDepartment.getSubDepartmentBySubDepartmentID(this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      const current = data.dateSet[0];
      if (data.responseCode == 1) {
        this.loggedInUserSubDepartmentName = current.subDepartmentName
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }

  Approve() {
     //Service Information Kyle 31/01/24
    if (confirm("Have you uploaded all relevant documents ?")) {
       //Service Information Kyle 31/01/24
      this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Completed", false, false, "EndOfCommentProcess", true).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          //commentsService
          this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, this.loggedInUserSubDepartmentName, this.leaveAComment, "Complete", this.CurrentUser.appUserId, null, null, this.loggedInUserName, this.CurrentUserZoneName).subscribe((data: any) => {

            if (data.responseCode == 1) {


              alert(data.responseMessage);
              this.CheckALLLinkedDepartmentsCommented(true);
              /*            this.MoveToClosedStage(true);*/

            }
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })
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

  getServicesByDepID() {

    this.serviceItemService.getServiceItemByDepID(this.loggedInUsersDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemCodeDropdown;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;

          this.ServiceItemCodeDropdown.push(tempServiceItemList);
        }
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }

  CurrentUserZoneName = '';

  getZoneForCurrentUser() {

    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        let current = data.dateSet[0];

        this.CurrentUserZoneName = current.zoneName;

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);


      // this.CanCommentFinalApprover();
    }, error => {
      console.log("Error: ", error);
    })


  }

  checkIfWbsRequired() {

    if (this.CurrentApplication.wbsrequired == true) {
      this.WBSRequestedAlreadyLabel = true;
      this.WBSCHeckBox = false;

    }
    else {

    }
  }
  checkEmail = '';
  DepositCHeckBox: boolean = false;
  CheckApplicant() {
    debugger
    this.checkEmail = this.applicationData.clientEmail.substring(this.applicationData.clientEmail.indexOf('@'));
    console.log(this.checkEmail);
    if (this.checkEmail === "@capetown.gov.za") {
      this.WBSCHeckBox = true;
      this.DepositCHeckBox = false;
    }
    else {
      this.WBSCHeckBox = false;
      this.DepositCHeckBox = true;
    }
  }

  // #region actionCenterReassignReviewer Sindiswa 16 January 2024
  hasReviewerAssignment: boolean = false;
  assignedReviewerID: string = '';
  assignedReviewerName: string = '';

  newAssignORReassign() {


    this.subDepartmentForCommentService.getAssignedReviewer(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUserProfile[0].zoneID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log("Reviewer assignment information:", data.dateSet);

        let current = data.dateSet[0];
        if (current.userAssaignedToComment) {

          this.hasReviewerAssignment = true;
          this.assignedReviewerID = current.userAssaignedToComment;

          this.userPofileService.getUserProfileById(this.assignedReviewerID).subscribe((data: any) => {


            if (data.responseCode == 1) {


              console.log("data", data.dateSet);
              const assigned = data.dateSet[0]; //This should be the latest human's name!!
              this.assignedReviewerName = assigned.fullName;
              console.log("These are the assigned user's details", assigned);

            }

            else {

              alert(data.responseMessage);
            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })

          return;
        }
        else {
          this.hasReviewerAssignment = false;
        }
      }
      else {
        alert(data.responseMessage);

      }
    }, error => {
      console.log("Error in terms of trying to figure out if a reviewer has been assigned to application: ", error);
    })
  }


  specialText: string = '';
  checkUserAssignSituation() {

    this.subDepartmentForCommentService.getAssignedReviewer(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUserProfile[0].zoneID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log("Reviewer assignment information:", data.dateSet);

        let current = data.dateSet[0];
        if (current.userAssaignedToComment !== "EndOfCommentProcess" && current.userAssaignedToComment !== "All users in Subdepartment FA" && current.userAssaignedToComment !== "Senior Reviewer to comment") {

          this.hasReviewerAssignment = true;
          this.newAssignORReassign();
        }
        else if (current.userAssaignedToComment === "EndOfCommentProcess" || current.userAssaignedToComment === "All users in Subdepartment FA" || current.userAssaignedToComment === "Senior Reviewer to comment") {
          this.hasReviewerAssignment = false;
          this.specialText = "Please note that this is the current 'state' of the application: " + current.userAssaignedToComment;
          if (current.userAssaignedToComment === "EndOfCommentProcess") {
            this.specialText = "Please note that this is the current 'state' of the application: End Of Comment Process";
          }
        }
      }
      else {
        alert(data.responseMessage);

      }
    }, error => {
      console.log("Error in terms of trying to figure out if a reviewer has been assigned to application: ", error);
    })

  }
  newlySelectedReviewerID: string = '';
  newlySelectedReviewerName: string = '';
  adminNote: string = '';

  openAssignToNewUser(adminNotes: any) {
    this.newlySelectedReviewerID = this.UserSelectionForManualLink.selected[0].id;

    this.userPofileService.getUserProfileById(this.UserSelectionForManualLink.selected[0].id).subscribe((data: any) => {


      if (data.responseCode == 1) {


        console.log("data", data.dateSet);
        const newAssigned = data.dateSet[0]; //This should be the latest human's name!!
        this.newlySelectedReviewerName = newAssigned.fullName;
        console.log("These are the NEW assigned user's details", newAssigned);

      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    this.modalService.open(adminNotes, { backdrop: 'static', size: 'xl' });
  }

  textWithReviewerAssign() {

    if (this.hasReviewerAssignment == false) {
      this.reviwerforCommentService.addUpdateReviewerForComment(0, this.ApplicationID, this.UserSelectionForManualLink.selected[0].id, "Initial Reviewer Assignment", "This has been done with no notes.", this.CurrentUser.appUserId, this.loggedInUsersSubDepartmentID, this.loggedInUsersSubDepartmentName, this.CurrentUserProfile[0].zoneID, this.CurrentUserProfile[0].zoneName).subscribe((data: any) => {

        if (data.responseCode == 1) {


        }
        else {
          alert(data.responseMessage);

        }
        console.log("Assigned a reviewer to this zone", data);

      }, error => {
        console.log("Error: ", error);
      })

    }
    else {

      this.reviwerforCommentService.addUpdateReviewerForComment(0, this.ApplicationID, this.UserSelectionForManualLink.selected[0].id, "Assigning to Another Reviewer", this.adminNote, this.CurrentUser.appUserId, this.loggedInUsersSubDepartmentID, this.loggedInUsersSubDepartmentName, this.CurrentUserProfile[0].zoneID, this.CurrentUserProfile[0].zoneName).subscribe((data: any) => {

        if (data.responseCode == 1) {
          //need to make the other reviewer inactive or something
        }
        else {
          alert(data.responseMessage);

        }
        console.log("Assigned another reviewer to this zone", data);

      }, error => {
        console.log("Error: ", error);
      })

    }
  }


  subDPTforComment: number;
  userAssignedText: string = '';
  commentState: string = '';

  appointmentText: string = '';
  asWhat: string;

  actionCentreView(content: any) {
    debugger;
    this.subDepartmentForCommentService.getAssignedReviewer(this.ApplicationID, this.loggedInUsersSubDepartmentID, this.CurrentUserProfile[0].zoneID).subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        console.log("User assignment information:", data.dateSet);

        let current = data.dateSet[0];

        this.subDPTforComment = await current.subDepartmentForCommentID;
        this.userAssignedText = await current.userAssaignedToComment;
        this.commentState = await current.commentStatus;
      }
      else {
        alert(data.responseMessage);

      }
    }, error => {
      console.log("Error in terms of trying to figure out which 'state' the application is in:", error);
    });
   
    if (this.commentState == null) {
      //This is so the Admin can assign
      this.openXl(content);
    }
    else if (this.userAssignedText === this.CurrentUser.appUserId && (this.commentState == null || this.commentState == "Referred" || this.commentState == "Approved" || this.commentState == "Rejected")) {
      this.openXl(content);
    }
    else if (this.userAssignedText === "EndOfCommentProcess") {
      alert("This application has reached the 'End Of Comment Process' stage");
      // actionCentre Sindiswa 22 January 2024 - the permit issuer can't open their action centre view
      console.log("Can this user approvePermit?? PermitStage:" + this.permit + " CanApprove: " + this.canApprovePermit);
      if (this.permit && this.canApprovePermit) {
        this.openXl(content);
      }
    }
    else if ((this.userAssignedText == "Senior Reviewer to comment" && this.commentState == "Referred") || (this.userAssignedText == "All users in Subdepartment FA" && (this.commentState == "Approved" || this.commentState == "Approved(Conditional)" || this.commentState == "Rejected"))) {

      if (this.commentState == "Referred") {
        this.appointmentText = "Senior Reviewer - Self Appointed";
        this.asWhat = " Senior Reviewer"
      }
      else if (this.commentState == "Approved" || this.commentState == "Rejected") {
        this.appointmentText = "Final Approver - Self Appointed";
        this.asWhat = " Final Approver";

      }

      //var userConfirmed = window.confirm("This application stage is as follows: '" + this.userAssignedText + "' Do you want to take the application?");
      var userConfirmed = window.confirm("Do you want to take on this application as a" + this.asWhat + "?");


      if (userConfirmed) {



        // update the SubDepartmentForComment table

        this.subDepartmentForCommentService.assignSeniorReviewerOrFinalApprover(this.subDPTforComment, this.CurrentUser.appUserId).subscribe((data: any) => {

          //4. update the ReviewerForComment table - audit trail things
          this.reviwerforCommentService.addUpdateReviewerForComment(0, this.ApplicationID, this.CurrentUser.appUserId, this.appointmentText, "User Officially Took Application", this.CurrentUser.appUserId, this.loggedInUsersSubDepartmentID, this.loggedInUsersSubDepartmentName, this.CurrentUserProfile[0].zoneID, this.CurrentUserProfile[0].zoneName).subscribe((data: any) => {

            if (data.responseCode == 1) {
              this.openXl(content);
            }
            else {
              alert(data.responseMessage);

            }
            console.log("Official user role assignement!", data);

          }, error => {
            console.log("Error: ", error);
          });
        })
        console.log("Application taken!");
      } else {

        console.log("Application not taken.");
        return;
      }
    }

    //#region escalation Sindiswa 31 January 2024 - saw card while working on escalation tings, need to add someone has already taken application text
    else if ((this.userAssignedText != null && this.userAssignedText != "Senior Reviewer to comment" && this.userAssignedText != "All users in Subdepartment FA") && (this.commentState == "Approved" || this.commentState == "Referred"  || this.commentState == "Approved(Conditional)" || this.commentState == "Rejected")) {
      alert("This application is currently under review by a senior reviewer or final approver.");
    }
    //#endregion
  }

  onCommentFA(interact: any) {

  }
  onReturnToSeniorReviewerClick() {

  }
  letGoOFApplication() {

  }
  // #endregion



  //Audit Trail Kyle
  onSaveToAuditTrail2(description: string) {
    this.auditTrailService.addUpdateAuditTrailItem(0, this.ApplicationID, description, true, this.CurrentUserProfile[0].subDepartmentName, this.CurrentUserProfile[0].zoneName, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);

    })
  }
  //Audit Trail Kyle
  //Service Information Kyle 31/01/24
  AdminAssigningIsPlanningToSelf() {
    if (confirm("Are you sure you what to assign this project to yourself ?")) {
      this.subDepartmentForCommentService.departmentForCommentUserAssaignedToComment(this.forManuallyAssignSubForCommentID, this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.getLinkedZones();
          this.updateApplicationStatus();
          this.MoveApplicationToAllocated();
          this.viewProjectInfoComponent.getAllComments();
          this.hasReviewerAssignment = true;
        }
        else {
          alert(data.responseMessage);

        }
        console.log("Assigned to self", data);

      }, error => {
        console.log("Error: ", error);

      })


      this.reviwerforCommentService.addUpdateReviewerForComment(0, this.ApplicationID, this.CurrentUser.appUserId, "Initial Reviewer Assignment", "This has been done with no notes.", this.CurrentUser.appUserId, this.loggedInUsersSubDepartmentID, this.loggedInUsersSubDepartmentName, this.CurrentUserProfile[0].zoneID, this.CurrentUserProfile[0].zoneName).subscribe((data: any) => {

        if (data.responseCode == 1) {


        }
        else {
          alert(data.responseMessage);

        }
        console.log("Assigned a reviewer to this zone", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
  }

  getAllDocumentsForServiceInformation() {
    this.ServiceInfoDocumentsList.splice(0, this.ServiceInfoDocumentsList.length);
    this.documentUploadService.getAllDocumentsForApplicationForPlanning(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as ServiceInfoDocumentsList;
          const current = data.dateSet[i];

          if (current.subDepartmentName == this.CurrentUserProfile[0].subDepartmentName) {
            tempDocList.DocumentID = current.documentID;
            tempDocList.DocumentName = current.documentName;
            tempDocList.ApplicationID = current.applicationID;
            tempDocList.DocumentGroup = current.documentGroup;
            tempDocList.SubDepartmentName = current.subDepartmentName;
            tempDocList.DocumentLocation = current.documentLocalPath;
            tempDocList.isPlanning = current.isPlanning;

            this.ServiceInfoDocumentsList.push(tempDocList);
          }
         
        }

        this.dataSourceServiceInfoDocuments = this.ServiceInfoDocumentsList;
      }
      else {
        alert(data.responseMessage);

      }
      console.log("Got all isPlanning Docs", data);

    }, error => {
      console.log("Error: ", error)
    })
  }

  onSaveDocumentUpload(content: any) {
    this.modalService.dismissAll();
    this.getAllDocumentsForServiceInformation();
    this.actionCentreView(content);
  }

  onDeleteDocument(index: any,content:any) {
    const document = this.ServiceInfoDocumentsList[index];

    this.documentUploadService.deleteDocument(document.DocumentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.getAllDocumentsForServiceInformation();
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.actionCentreView(content);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("Got all isPlanning Docs", data);

    }, error => {
      console.log("Error: ", error)
    })
  }
   //Service Information Kyle 31/01/24
}

  //#region escalation Sindiswa 30 January 2024 & 31 January 2024
  async onGoToEscalationActionCentre(escalatedToEMB: any) {
    debugger;
    await this.getEscalationDetails();

    if (this.isEscalated == true) {
      await this.getRelavantDepartments();
      this.modalService.open(escalatedToEMB, { backdrop: 'static', size: 'xl' });
    }
    else {
      alert("This application has NOT been escalated.")
    }
  }
  isEscalated: boolean;
  async getEscalationDetails() {
    try {
      const data: any = await this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).toPromise();

      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        this.isEscalated = await current.isEscalated;
        console.log("Has this application been escalated?", this.isEscalated);
      } else {
        alert(data.responseMessage);
      }

      console.log("This application's data", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  totalDepartments: number = 0;
  departmentsYetToAssign: number = 0;
  departmentsDone: number = 0;

  embMessage: any;
  subDepartmentIDsNotDone: number[] = [];
  zoneIDsNotDone: number[] = [];
 async getRelavantDepartments() {
   debugger;
   try {
     this.LinkedSubDepartmentsList.splice(0, this.LinkedSubDepartmentsList.length);

     const data: any = await this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).toPromise();
     if (data.responseCode == 1) {
       debugger;
       for (let i = 0; i < data.dateSet.length; i++) {
         const current = data.dateSet[i];

         const departmentDone = current.userAssaignedToComment === "EndOfCommentProcess";
         const departmentYetToAssign = current.userAssaignedToComment === null && current.commentStatus === null;

         const tempSubdepartmentList: SubDepartmentListForComment = {
           subDepartmentName: current.subDepartmentName,
           zoneName: current.zoneName,
           subDepartmentID: current.subDepartmentID,
           zoneID: current.zoneID,
           UserAssaignedToComment: current.userAssaignedToComment,
           commentStatus: current.commentStatus,
           //
          departmentID: 0, //random default value
          dateUpdated: current.dateUpdated,
          dateCreated: current.dateCreated,
          subdepartmentForCommentID: current.subDepartmentForCommentID,
           //other
           departmentDone: departmentDone,
           departmentYetToAssign: departmentYetToAssign,
         };

         this.totalDepartments++;
         if (current.userAssaignedToComment == "EndOfCommentProcess") {
           this.departmentsDone++;

         }
         else if (current.userAssaignedToComment == null && current.commentStatus == null) {
           this.departmentsYetToAssign++;
           this.subDepartmentIDsNotDone.push(current.subDepartmentID);
           this.zoneIDsNotDone.push(current.zoneID);
         }
         else {
           this.subDepartmentIDsNotDone.push(current.subDepartmentID); //This will help me push the SubDepartmentIDs of the SUBDEP still in process
           this.zoneIDsNotDone.push(current.zoneID); 
         }

         this.LinkedSubDepartmentsList.push(tempSubdepartmentList);
       }
       this.SubDepartmentsListTable?.renderRows();
     }
     else {
       alert(data.responseMessage);

     }
     console.log("These are the departements linked to this application, gather and get EMB to commment", data.dateSet);
   }
   catch (error) {
     console.log("Error while getting details EMB needs to comment: ", error);
   }

  }

  async getUserListForSubDepartment(subDepartmentID: number, zoneID: number): Promise<any> {
    try {
      debugger;

      const userData: any = await this.accessGroupsService.getUsersBasedOnRoleName("Department Admin", subDepartmentID, zoneID).toPromise();
      // Get users with the role "Department Admin" for the specified subdepartment
      //const userData: any = await this.getUserBySubDepartmentAndRoleName(subDepartmentID, "Department Admin").toPromise(); //this method isn't specific enough?

      if (userData.responseCode === 1) {
        let departmentAdminUsers = userData.dateSet;

        // Remove duplicates based on subDepartmentID, zoneID, and email
        const tempList = departmentAdminUsers;

        const seenCombinations = {};

        departmentAdminUsers = tempList.filter(item => {
          const key = `${item.subDepartmentID}-${item.zoneID}-${item.email}`;

          if (!seenCombinations[key]) {
            seenCombinations[key] = true;
            return true;
          }

          return false;
        });

        // Return the processed user data
        return departmentAdminUsers;
      } else {
        console.error("Error while fetching Department Admin users:", userData.responseMessage);
        return null; // Or handle the error in an appropriate way
      }
    } catch (error) {
      console.error("Error while fetching Department Admin users:", error);
      return null; // Or handle the error in an appropriate way
    }
  }

  async sendEmailsToDepartments() {
    debugger;

    try {

      for (let i = 0; i < this.subDepartmentIDsNotDone.length; i++) {
        const subDepartmentID = this.subDepartmentIDsNotDone[i];
        const zoneID = this.zoneIDsNotDone[i];
        const departmentAdminUsers = await this.getUserListForSubDepartment(subDepartmentID, zoneID);

        if (departmentAdminUsers !== null) {
          console.log("Department Admin Users for Subdepartment ID", subDepartmentID, ":", departmentAdminUsers);

          for (const obj of departmentAdminUsers) {
            const emailContent2 = `
    <html>
      <head>
        <style>
          /* Define your font and styles here */
          body {
           font-family: 'Century Gothic';
          }
          .email-content {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .footer {
            margin-top: 20px;
            color: #777;
          }
          .footer-logo {
            display: inline-block;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        <div class="email-content">
          <p>Dear ${obj.fullName},</p>
          <p>A Wayleave application with Wayleave No. ${this.projectNo} was escalated by the applicant/client. As the zone admin of ${obj.zoneName} in ${obj.subDepartmentName}, please see to the completion of the approval/rejection process.</p>
           ${this.embMessage ? `<p>Additional Notes: ${this.embMessage}</p>` : ''}
          <p>Should you have any queries, please contact <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
              <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                        <p>
            <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
          </p>
           <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
        </div>

      </body>
    </html>
  `;


            this.notificationsService.sendEmail(obj.email, "Escalated wayleave application", emailContent2, emailContent2);
            this.notificationsService.addUpdateNotification(0, "Application Needs Immediate Attention", "Escalated wayleave application", false, obj.userID, this.CurrentUser.appUserID /*This is null for some reason??*/, this.ApplicationID, `The Wayleave application with Wayleave No. ${this.projectNo} was escalated by the applicant/client. As the zone admin of ` + obj.zoneName + " in " + obj.subDepartmentName + `, please see to the completion of the approval/rejection process. ${this.embMessage ? `\n\nAdditional Notes: ${this.embMessage}` : ''}`).subscribe((data: any) => {

              if (data.responseCode == 1) {
                console.log(data.responseMessage);

              }
              else {
                alert(data.responseMessage);
              }

              console.log("response", data);
            }, error => {
              console.log("Error", error);
            });

          }

        }
        else {
          console.error("Error while getting Department Admin users for Subdepartment ID", subDepartmentID);
        }
      }

      console.log("All emails sent successfully!?");

      this.applicationsService.cancelEscalation(this.ApplicationID).subscribe((data:any) => {
        if (data.responseCode == 1) {
          console.log(data.responseMessage);
          this.router.navigate(["/home"]);
          location.reload();
        }
        else {
          alert(data.responseMessage);
        }
        console.log("response", data);
      }, error => {
        console.log("Error", error);
      });
     
    }
    catch (error) {
      console.error("Error sending department escalation notices", error);
    }

  }
  
  
  //#endregion
}





