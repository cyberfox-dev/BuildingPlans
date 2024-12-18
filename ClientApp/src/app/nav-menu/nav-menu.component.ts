import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, TemplateRef, HostListener, QueryList } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentConfigComponent } from 'src/app/department-config/department-config.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from '../shared/shared.service';
import { RolesService } from '../service/Roles/roles.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
import { ApplicationsService } from '../service/Applications/applications.service';
import { HomeComponent } from 'src/app/home/home.component';
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { DepartmentsService } from 'src/app/service/Departments/departments.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { FrequentlyAskedQuestionsService} from '../service/FAQ/frequently-asked-questions.service';
import { NGB_DATEPICKER_TIME_ADAPTER_FACTORY } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DocumentRepositoryComponent } from 'src/app/document-repository/document-repository.component';
import { NotificationCenterComponent } from 'src/app/notification-center/notification-center.component';
import { ConfigActingDepartmentComponent } from 'src/app/config-acting-department/config-acting-department.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { BugsService } from '../service/Bugs/bugs.service';


export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}

export interface SubDepartmentListFORDOCUMENTS {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}


export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
  DateCreated: any;
  GroupName: string;
  SubDepartmentID: number;
  Description: string;
}

export interface UserList {
  DepartmentID: number;
  SubDepID: number;
}

export interface FAQList {
  FAQID: number;
  Question: string;
  Answer: string;
  DateCreated: Date;
  DateUpdated: any;
}

export interface FileDocument {
  fileName: string;
  file: any;
}

export interface CommentList {
  CommentID: number;
  Comment: string;
  DateCreated: string;
  createdBy:any;
}
export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}

export interface NotificationsList {
  NotificationID: number;
  NotificationName: string;
  NotificationDescription: string;
  ApplicationID: number;
  UserID: number;
  IsRead: boolean;
  DateCreated: string;
  Message: string;
}


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NavMenuComponent implements OnInit {

  @Input() isTransparent: boolean = true;
 
  isExpanded = false;
  configShow: number | undefined;
  notiBell = true;
  CommentList: CommentList[] = [];
  NotificationsList: NotificationsList[] = [];

  RolesList: RolesList[] = [];
  FileDocument: FileDocument[] = [];
  UserList: UserList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentListFORDOCUMENTS: SubDepartmentListFORDOCUMENTS[] = [];
  FAQList: FAQList[] = [];
  forEditIndex: any;
  index: number;
  MessageList: any;
  fullName: string;
  projectNumber: string;
  ApplicationID: number;

  DocumentsList: DocumentsList[] = [];

  cyberfoxConfigs: boolean = false;
  Configurations: boolean = false;
  CommentBuilder: boolean = false;
  actingDep: boolean = false;
  public isInternalUser: boolean = false;
  Links: boolean = false;
  Icons: boolean = true;
  fileAttrsName = "Doc";
  public addComment = this.formBuilder.group({
    newCommentName: ['', Validators.required],

  })

  public editComments = this.formBuilder.group({
    editCommentName: ['', Validators.required],
  })
  applica: any;
  UserRoles: import("C:/CyberfoxProjects/BuildingPlans/ClientApp/src/app/shared/shared.service").RolesList[];
  selectedOptionText: string;
  lastUploadEvent: any;
    public InternalExternalUser: boolean = false;
    dp: any;
    devConfig: boolean = false;
    Config: boolean = false;
  isDarkMode: boolean = false;

  constructor(private offcanvasService: NgbOffcanvas, private sanitizer: DomSanitizer, private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private http: HttpClient, private documentUploadService: DocumentUploadService, private router: Router, private shared: SharedService, private formBuilder: FormBuilder, private commentService: CommentBuilderService, private userPofileService: UserProfileService, private notificationsService: NotificationsService, private subDepartment: SubDepartmentsService, private applicationsService: ApplicationsService, private faq: FrequentlyAskedQuestionsService, private dialog: MatDialog, private bugsService: BugsService) { }


 
  bugDescription: string = "";
  bugCategory: string;
  bugComponent: string;

  selected = 'none';
  select = 0;
  isLoading: boolean = false;


  //Audit Trail Kyle
  stringifiedDataRoles: any;
  AllCurrentUserRoles: any;
  Reports: boolean = false;
  //Audit Trail Kyle




  /*  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement = this.DocumentsList;*/

  displayedColumnsComment: string[] = ['Comment', 'actions'];
  dataSourceComment = this.CommentList;
  stringifiedData: any;
  CurrentUser: any;

  fileAttrs: string[] = [];
  isRep = "isRep";

  editorContent: string = ''; // This will store the editor content
  placeholderText: string = 'Eg. This is good.';

  onEditorBlur(event: FocusEvent): void {
    if (this.editorContent.trim() === '') {
      // Editor is empty, set the placeholder
      this.editorContent = `<p>${this.placeholderText}</p>`;
    }
  }

  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // #region notifications Sindiswa 12 February 2024
  hasNotifications: boolean;
  notificationsQuantity: number;
  getNotificationDetails(userId: string) {
    
    this.notificationsService.getNotificationsCount(userId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.shared.setNotificationsQuantity(data.dateSet);

        if (data.dateSet > 0) {
          this.shared.sethasNotifications(true);
        }
        else {
          this.shared.sethasNotifications(false);
        }
      } else {
        alert(data.responseMessage);
      }
      console.log("I tried getting the notifications count", data);
      this.notificationsQuantity = this.shared.getNotificationsQuantity(); //this.notificationsQuantity
      this.hasNotifications = this.shared.getHasNotifications(); //this.hasNotifications

      console.log("This is the quantity", this.notificationsQuantity);
      console.log("This is the notifications boolean", this.hasNotifications);
    }, error => {
      console.log("Error while getting the notifications count: ", error);
    });
  }

  // #endregion
  ngOnInit() {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));


    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getUserProfileByUserID();
    this.getRolesLinkedToUser();
    const fullName = this.CurrentUser.fullName;

    // Find the index of the first space
    const firstSpaceIndex = fullName.indexOf(' ');

    // Get the first name using substring
    const firstName = fullName.substring(0, firstSpaceIndex);

    // Find the index of the last space
    const lastSpaceIndex = fullName.lastIndexOf(' ');

    // Get the last name using substring
    const lastName = fullName.substring(lastSpaceIndex + 1);

    // Get initials
    const initials = firstName.charAt(0) + lastName.charAt(0);

    // Store initials in variable dp
    this.dp = initials.toUpperCase(); // Optionally convert to uppercase
    //Audit Trail Kyle
    this.stringifiedDataRoles = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedDataRoles);
    this.onCheckAllCurrentUserRoles();
    //Audit Trail Kyle
    /*    this.UserRoles = this.shared.getCurrentUserRoles();*/
    /*    this.setCurrentUserRoles();*/

    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log(this.CurrentUser);
    }

    this.getAllDepartments();
    this.getAllFAQ();

    this.getNotificationDetails(this.CurrentUser.appUserId); // notifications Sindiswa 12 February 2024

    this.notificationsQuantity = this.shared.getNotificationsQuantity(); //this.notificationsQuantity
    this.hasNotifications = this.shared.getHasNotifications(); //this.hasNotifications

    console.log("This is the quantity", this.notificationsQuantity);
    console.log("This is the notifications boolean", this.hasNotifications);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    this.updateTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  updateTheme(): void {
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  onPageChange(event: PageEvent) {
    // This function is called when the user changes the page
  /*  this.pageIndex = event.pageIndex;*/
    const pageSize = event.pageSize;

    // Perform actions based on the new page index and size
    // Call the function to load data with the updated page size or index
    // this.getAllDocsForRepository(pageSize, pageIndex);
  }

  @ViewChild('repositoryModal') templateRef: TemplateRef<any>;
  @ViewChildren(MatPaginator) paginator: QueryList<MatPaginator>;
  @ViewChild(MatTable) commentTable: MatTable<CommentList> | undefined;
  @ViewChild(MatTable) DocumentsListTable: MatTable<DocumentsList> | undefined;


  uploadRepoDoc: boolean = false;
  deleteRepoDoc: boolean = false;
  groupName: boolean = true;
  depSelect: boolean = true;
  selectDepartmentForUpload: boolean = false;
  selectDepForUpload = 0;

  displayedColumns: string[] = ['DocumentName'];
  dataSource = new MatTableDataSource<DocumentsList>([]);

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  length: any;
 
  lockViewAccordingToRoles() {

    for (var i = 0; i < this.RolesList.length; i++) {

      if (this.RolesList[i].RoleName == "Developer Config" || this.RolesList[i].RoleName == "Department Admin") {
        this.Configurations = true;
      }
      if (this.RolesList[i].RoleName == "Developer Config" ) {
        this.cyberfoxConfigs = true;
      }

      if (this.RolesList[i].RoleName == "Department Admin" || this.RolesList[i].RoleName == "EMB" || this.RolesList[i].RoleName == "Developer Config") {
        this.uploadRepoDoc = true;
        this.groupName = false;
        this.depSelect = false;
        this.deleteRepoDoc = true;
        this.CommentBuilder = true;
        this.selectDepartmentForUpload = true;
      }
    
    }


  }

  isAtTop: boolean = true;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // Detect the scroll position
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // You can adjust this threshold value as needed
    const threshold = 100;

    // Update the isAtTop variable based on the scroll position
    this.isAtTop = scrollPosition < threshold;
  }




  onUploadFinished(event: any) {
    this.lastUploadEvent = event;  // Store the event data
    // Other logic (if any)...
  }

  ConfirmUpload() {
    if (!window.confirm("Are you sure you want to upload the file?")) {
      // Use the stored event data
      this.onFileDelete(this.lastUploadEvent, 0);
    }
    // Rest of the logic...
  }
  changeHasFile() {

  }
  onPassFileName(event: { uploadFor: string; fileName: string }) {
    
    const { uploadFor, fileName } = event;
    const index = parseInt(uploadFor.substring('CoverLetter'.length));
    this.fileAttrsName = "Doc";
    

    this.shared.RepFileUploadCat = this.selected;

    for (var i = 0; i < this.SubDepartmentList.length; i++) {
      const current = this.SubDepartmentList[i];
      if (current.subDepartmentID == this.selectDepForUpload) {
        this.shared.RepFileUploadSubID = current.subDepartmentID;
        this.shared.RepFileUploadSubName = current.subDepartmentName;
      }

    }




  }
  //Audit Trail Kyle
  openReports(reports: any) {
    this.modalService.open(reports, { centered: true, size: 'xl' });
    this.shared.isReports = true;
  }
  openUserActingDepModal() {
    this.dialog.open(ConfigActingDepartmentComponent, {
      width: '60%',
      maxHeight: 'calc(100vh - 90px)',
      height: 'auto'
    });
  }


  onFileDelete(event: any, index: number) {

    this.fileAttrsName = "Doc";

  }

  onFileUpload(event: any) {


  }

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

  setCurrentUserRoles() {

    this.RolesList[0].RoleName = this.UserRoles[0].RoleName;
    this.RolesList[0].RoleID = this.UserRoles[0].RoleID;

    console.log("SJDHFKSHFKJSDJKFHJKSDFHKLDFSHKSDJFHLKJSDFHLKJSDFKSDFSDFSDFSDFSDF", this.RolesList)
  }

  getUserProfileByUserID() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;

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


  onCommentCreate(commentBuilder: any) {
    let newCommentName = this.addComment.controls["newCommentName"].value;


    this.CommentList.splice(0, this.CommentList.length);

    this.commentService.addUpdateComment(null, newCommentName, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.addComment.controls["newCommentName"].setValue(null);
        this.getAllCommentsByUserID(commentBuilder);
      }
      else {
        alert("Please type a comment");
      }
      alert(data.responseMessage);

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  getAllCommentsByUserID(commentBuilder: any) {




    this.CommentList.splice(0, this.CommentList.length);

    this.commentService.getCommentByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCommentList = {} as CommentList;
          const current = data.dateSet[i];
          tempCommentList.CommentID = current.commentID;
          tempCommentList.Comment = current.commentName;
          tempCommentList.DateCreated = current.dateCreated;


          this.CommentList.push(tempCommentList);

        }

        this.commentTable?.renderRows();
        this.closeCommentBuilder(commentBuilder);
        this.openCommentBuilder(commentBuilder);

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



  onCommentDelete(index: any, commentBuilder: any) {
    console.log(this.CommentList[index].Comment);
    if (confirm("Are you sure to delete " + this.CommentList[index].Comment + "?")) {

      this.commentService.deleteComment(Number(this.CommentList[index].CommentID)).subscribe((data: any) => {
        this.CommentList.splice(0, this.CommentList.length);

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllCommentsByUserID(commentBuilder);
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

  onCommentEdit(index: any, commentBuilder: any, editComment: any) {

  }
  onEditCommentSave(commentBuilder: any) {
    let editCommentName = this.editComments.controls["editCommentName"].value;
    this.commentService.addUpdateComment(this.CommentList[this.forEditIndex].CommentID.toString(), editCommentName, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllCommentsByUserID(commentBuilder);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  //refresh() {
  //  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //    this.router.navigate([this.router.url]));
  //  location.reload();
  //}

  LogoutUser() {
    /*    this.router.navigate(["/"]);
        localStorage.removeItem('LoggedInUserInfo');
        localStorage.removeItem('userProfile');*/
    this.deleteWayleaveWhenOnLogout();

  }
  /*routes for nav buttons*/
  goToConfig() {
    /*    this.router.navigate(["/configuration"]);*/
    this.deleteWayleaveWhenGoConfig();
  }
  goToBPConfig() {

    this.router.navigate(["/bp-configuration"]);
  }

  goToSettings() {
    /*this.router.navigate(["/user-settings"]);*/

    this.deleteWayleaveWhenGoSettings();
  }
  goToCyberfoxCofig() {
    /*    this.router.navigate(["/cyberfox-config"]);*/
    this.deleteWayleaveWhenGoCyberfoxConfig();
  }
  /*This is to open the comment buider modal*/
  openCommentBuilder(commentBuilder: any) {
    this.modalService.open(commentBuilder, { centered: true, size: 'xl' });
  }

  /*Open Repository Modal*/
  openRepositoryModal(repositoryModal: any) {
    /*    this.ngAfterViewInit();
        this.selected = undefined;
        this.selectedOptionText = "";
        this.getAllDocsForRepository(repositoryModal);
        *//*this.getAllDocsForRepository();*//*
    this.modalService.open(repositoryModal, { centered: true, size: 'xl' });*/

    this.dialog.open(DocumentRepositoryComponent, {
      width: '60%',
      maxHeight: 'calc(100vh - 90px)',
      height: 'auto'
    });
  }

  /*Open File Upload for repository*/
  onUploadFile(fileUpload: any) {
    this.modalService.open(fileUpload, { centered: true, size: 'lg', backdrop: 'static' });
  }

  closeCommentBuilder(commentBuilder: any) {
    this.modalService.dismissAll(commentBuilder);
  }
  /*this is to open the notifications modal*/

  openNotificationsModal() {


    this.dialog.open(NotificationCenterComponent, {
      width: '70%',
      maxHeight: 'calc(100vh - 90px)',
      height: 'auto'
    });
  }
  /*Notifications*/

  openCreateNewComment(createNewComment: any) {
    this.modalService.open(createNewComment, { centered: true, size: 'lg' });
  }

  openFAQModal(FAQModal: any) {

    this.modalReference = this.modalService.open(FAQModal, { centered: true, size: 'xl', backdrop: 'static' });
  }
  modalReference: NgbModalRef | undefined;
  viewEditComment(editComment: any, index: any) {
    this.editComments.controls["editCommentName"].setValue(this.CommentList[index].Comment);
    this.forEditIndex = index;
    this.modalService.open(editComment, { centered: true, size: 'lg' });
  }

  closeModal() {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.modalService.open(DepartmentConfigComponent);
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }


  goHome() {
    
    this.deleteWayleaveWhenGoHome();

  }

  

  disableIcons() {

    this.Icons = false;
    if (this.Links == false) {
      this.Links = true

    }
    else {
      this.Links = false
    }
  }


  /*For something to to not something*/
  deleteWayleaveWhenGoHome() {
    
    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      //this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
      //  if (data.responseCode == 1) {

      //    this.shared.setApplicationID(0);
      //    /*          this.homeComponent.getAllApplicationsByUserID();*/
      //    this.router.navigate(["/home"]);
      //  }
      //  else {
      //    alert("RefreshService Delete Application Error");
      //  }

      //  console.log("responseAddApplication", data);

      //}, error => {
      //  console.log("Error", error);
      //})
      this.shared.setApplicationID(0);
    }
    this.shared.setApplicationID(0);
    this.router.navigate(["/home"]);
  }

  deleteWayleaveWhenGoSettings() {

    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.shared.setApplicationID(0);
      //this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
      //  if (data.responseCode == 1) {

        
      //    /* this.homeComponent.getAllApplicationsByUserID();*/
      //    this.router.navigate(["/user-settings"]);
      //  }
      //  else {
      //    alert("RefreshService Delete Application Error");
      //  }

      //  console.log("responseAddApplication", data);

      //}, error => {
      //  console.log("Error", error);
      //})
    }
    this.shared.setApplicationID(0);
    this.router.navigate(["/user-settings"]);
  }

  deleteWayleaveWhenOnLogout() {
    
    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.shared.setApplicationID(0);
      //this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
      //  if (data.responseCode == 1) {

         
      //    /* this.homeComponent.getAllApplicationsByUserID();*/
      //    this.router.navigate(["/"]);
      //    localStorage.removeItem('LoggedInUserInfo');
      //    localStorage.removeItem('userProfile');
      //  }
      //  else {
      //    alert("RefreshService Delete Application Error");
      //  }

      //  console.log("responseAddApplication", data);

      //}, error => {
      //  console.log("Error", error);
      //})
    }
    this.router.navigate(["/"]);
    localStorage.removeItem('LoggedInUserInfo');
    localStorage.removeItem('userProfile');
  }

  deleteWayleaveWhenGoConfig() {

    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.shared.setApplicationID(0);
    //  this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
    //    if (data.responseCode == 1) {

    //      this.shared.setApplicationID(0);
    //      /* this.homeComponent.getAllApplicationsByUserID();*/
    //      this.router.navigate(["/configuration"]);
    //    }
    //    else {
    //      alert("RefreshService Delete Application Error");
    //    }

    //    console.log("responseAddApplication", data);

    //  }, error => {
    //    console.log("Error", error);
    //  })
    }
    this.shared.setApplicationID(0);
    this.router.navigate(["/configuration"]);
  }

  deleteWayleaveWhenGoCyberfoxConfig() {

    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.shared.setApplicationID(0);
      //this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
      //  if (data.responseCode == 1) {


      //    /* this.homeComponent.getAllApplicationsByUserID();*/
      //    this.router.navigate(["/cyberfox-config"]);
      //  }
      //  else {
      //    alert("RefreshService Delete Application Error");
      //  }

      //  console.log("responseAddApplication", data);

      //}, error => {
      //  console.log("Error", error);
      //})
    }
    this.shared.setApplicationID(0);
    this.router.navigate(["/cyberfox-config"]);
  }




  refreshModal(repositoryModal) {
    
/*    this.cdr.detectChanges();*/
    this.modalService.dismissAll(repositoryModal);
    this.modalService.open(repositoryModal, { centered: true, size: 'xl' });
  }




/*  *//*Repository Section*//*
  getAllDocsForRepository() {
    
    this.DocumentsList.splice(0, this.DocumentsList.length);
    this.documentUploadService.getAllDocumentsForRepository().subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];
          console.log(current);
          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.DocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.AssignedUserID = current.assignedUserID;
          tempDocList.DateCreated = current.dateCreated;
          tempDocList.GroupName = current.groupName;
          tempDocList.SubDepartmentID = current.subDepartmentID;
          tempDocList.Description = current.description;
          console.log("THIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGS", current);
          this.DocumentsList.push(tempDocList);
        
       
        }
*//*        this.length = this.DocumentsList.length;
        this.dataSource.data = this.DocumentsList;
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        const displayedData = this.DocumentsList.slice(startIndex, endIndex);
        this.dataSource.data = displayedData;*//*



        // Trigger change detection
        this.cdr.detectChanges();

        // Ensure that renderRows is called (optional)
        if (this.DocumentsListTable) {
          this.DocumentsListTable.renderRows();
        }
        

       
       // console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })
  
  }*/

  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';

  viewDocument(element: any) {
    
    // Make an HTTP GET request to fetch the document
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${element.DocumentName}`)
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
        link.download = element.DocumentName; // Set the downloaded file name
        link.click();
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  CoverLetterChooseFileText = 'Choose File';
  uploadFileEvtCoverLetter(File: any) {

    const tempFileDocumentList = {} as FileDocument;

    tempFileDocumentList.fileName = File.target.files[0].name;
    tempFileDocumentList.file = File.target.files[0];


    this.FileDocument.push(tempFileDocumentList);
    console.log("this.FileDocument", this.FileDocument);


    // Check if one or more files were selected
    if (File.target.files.length > 0) {
      // Reset the fileAttr property
      this.CoverLetterChooseFileText = '';
      // Iterate over the selected files
      Array.from(File.target.files).forEach((file: any) => {
        // Create a new File object
        let fileObject = new File([file], file.name);
        // Concatenate the file names and add a separator
        this.CoverLetterChooseFileText += file.name + ' - ';
        // Create a new FileReader object
        let reader = new FileReader();
        // Set the onload event handler 
        reader.onload = (e: any) => {
          // Create a Byte[] array from the file contents
          let fileBytes = new Uint8Array(e.target.result);
          console.log("fileBytes", fileBytes);
        };
        // Start reading the file as an ArrayBuffer
        reader.readAsArrayBuffer(fileObject);

        console.log("fileObject", fileObject);
        console.log("reader.readAsArrayBuffer(fileObject)", reader.readAsArrayBuffer(fileObject));

      });
      // Reset the value of the file input element
      this.fileInput.nativeElement.value = '';
    } else {
      // If no file was selected, set fileAttr to the default value
      this.CoverLetterChooseFileText = 'Choose File';
    }
  }

  response: { dbPath: ''; } | undefined

  uploadFileForRepository(repositoryModal) {

    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, null, this.CurrentUser.appUserId, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert("Uploaded Document");
      }

    }, error => {
      console.log("Error: ", error);
    })

  }
  progress: number = 0;
  message = '';
  save(repositoryModal) {
    this.modalService.dismissAll();
    

    //if (this.selectDepartmentForUpload == undefined) {
    //  alert("Please Select a department");
    //}
    //else if (this.selected == "") {
    //  alert("Please Select A Group For Your Document");
    //}
    //else {

    //  //const filesForUpload = this.shared.pullFilesForUpload();
    //  //for (var i = 0; i < filesForUpload.length; i++) {
    //  //  const formData = new FormData();
    //  //  let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
    //  //  let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + null;
    //  //  formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);




    //  //  this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
    //  //    .subscribe({
    //  //      next: (event) => {


    //  //        if (event.type === HttpEventType.UploadProgress && event.total)
    //  //          this.progress = Math.round(100 * event.loaded / event.total);
    //  //        else if (event.type === HttpEventType.Response) {
    //  //          this.message = 'Upload success.';
    //  //          this.uploadFinished(event.body, repositoryModal);

    //  //        }
    //  //      },
    //  //      error: (err: HttpErrorResponse) => console.log(err)
    //  //    });

    //}
  }
  descriptionForDocRepo = '';

  uploadFinished = (event: any, repositoryModal) => {
    
    this.response = event;
    console.log("this.response", this.response);
    console.log(this.descriptionForDocRepo);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, null, this.CurrentUser.appUserId, this.CurrentUser.appUserId, this.selectedOptionText, this.selectDepForUpload, this.SubDepartmentListFORDOCUMENTS[0].subDepartmentName, null, true, this.descriptionForDocRepo).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.modalService.dismissAll(repositoryModal);
      
      }





    }, error => {
      console.log("Error: ", error);
    })


  }

  onDeleteRepositoryDocument(index: any, repositoryModal: any) {
    const confirmation = confirm("Are you sure you want to delete this document?");

    if (confirmation) {
      this.documentUploadService.deleteDocument(this.DocumentsList[index].DocumentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          this.modalService.dismissAll(repositoryModal);
       
        }
      }, error => {
        console.log("Error: ", error);
      })
    }
  }

  onOptionSelected(event: MatSelectChange) {
    this.selectedOptionText = event.source.triggerValue;
    console.log(this.selectedOptionText);
    this.getCurrentUserInfo();
  }


  getCurrentUserInfo() {
    this.UserList.splice(0, this.UserList.length);
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        const tempuserList = {} as UserList;
        const current = data.dateSet[0];
        tempuserList.DepartmentID = current.departmentID;
        tempuserList.SubDepID = current.subDepartmentID;
        this.UserList.push(tempuserList);
        console.log("jjioegjiogjkljkljklfgjklfgjkljkljkljklfgjklfgjkldfgjklfgkjlfg", current);
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllDepartments() {
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.subDepartment.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          console.log("DepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListh", current);
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);

        }

        //this.DepartmentList = data.dateSet;


        console.log("DepartmentListh", this.SubDepartmentList);
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
  filter = false;



  filterDepartment() {
/*    
    let string = this.select.toString();
    if (string == "All") {

      this.dataSource = this.DocumentsList.filter(df => df.DateCreated);
      this.groupName = false;


    }
    else {

      this.groupName = true;
      console.log(this.select);
      this.dataSource = this.DocumentsList.filter(df => df.SubDepartmentID == this.select);
      console.log("FilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilter", this.DocumentsList.filter(df => df.SubDepartmentID == this.select))
    }*/
  }
  resetFilter() {
/*    this.select = undefined;
    this.selected = undefined;
    this.groupName = false;
    this.selectedOptionText = "";
    this.dataSource = this.DocumentsList.filter(df => df.DateCreated);*/
  }

  filerGroupName() {
/*    if (this.selectedOptionText == "" || this.selectedOptionText == "All Departments") {
      this.dataSource = this.DocumentsList.filter(df => df.DateCreated && df.SubDepartmentID == this.select);
    }
    else {
      console.log(this.selectedOptionText);
      this.dataSource = this.DocumentsList.filter(df => df.GroupName == this.selectedOptionText && df.SubDepartmentID == this.select);
      console.log("FilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilter", this.DocumentsList.filter(df => df.SubDepartmentID == this.select))
    }*/
  }

  selectDepartment() {
    this.subDepartment.getSubDepartmentBySubDepartmentID(this.selectDepForUpload).subscribe((data: any) => {
      const tempSubDocList = {} as SubDepartmentListFORDOCUMENTS;
      const current = data.dateSet[0];
      console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg", current);
      console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg", this.selectDepForUpload);
      if (data.responseCode == 1) {
        tempSubDocList.subDepartmentName = current.subDepartmentName
        this.SubDepartmentListFORDOCUMENTS.push(tempSubDocList);
        console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg", this.SubDepartmentListFORDOCUMENTS);

      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }

  /*FAQ*/
  getAllFAQ() {
    this.faq.getAllFAQ().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempfaqList = {} as FAQList;
          const current = data.dateSet[i];
          tempfaqList.FAQID = current.faqID;
          tempfaqList.Question = current.question;
          tempfaqList.Answer = current.answer;
          tempfaqList.DateCreated = current.dateCreated;
          tempfaqList.DateUpdated = current.dateUpdated;
          this.FAQList.push(tempfaqList);
        }

        console.log("FAQLIST", this.FAQList);
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  private getDismissReason(reason: any): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  dismiss() {

    this.modalService.dismissAll();
    this.offcanvasService.open("");
    this.offcanvasService.dismiss();
  }



  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isTransparent = scrollY < 460; // Adjust the scroll threshold as needed
  }

  //Audit Trail Kyle
  onCheckAllCurrentUserRoles() {
    
    for (let i = 0; i < this.AllCurrentUserRoles.length; i++) {
      const roleName = this.AllCurrentUserRoles[i].roleName;
      if (roleName === "Audit Trail") {
        this.Reports = true;
      }
      if (roleName === 'Dev') {
        this.devConfig = true;
      }
      if (roleName === 'Admin') {
        this.Config = true;
      }
    }
  }
  changeMode() {
    const themeSwitcher = document.querySelector("[data-theme-picker]");

    // Get the current theme from the data attribute
/*    const currentTheme = document.body.getAttribute('data-theme') || 'light'; // Default to 'light' if null
    alert(currentTheme);
    // Switch to the opposite theme
    if (currentTheme === 'light') {
      this.changeToDarkMode();
    } else {
      this.changeToLightMode();
    }*/
  }

  changeToLightMode() {
    document.body.setAttribute('data-theme', 'light');
  }

  changeToDarkMode() {
    document.body.setAttribute('data-theme', 'dark');
  }


  opensideNav() {
    let btn = document.querySelector('#menu');
    let sideBar = document.querySelector('.sidebar');

    sideBar.classList.toggle('active');
  }

  openBugReport(bugs: any) {

    this.modalService.open(bugs, { centered: true, size: 'l' });
  }

  onSaveBugReport() {

    this.bugsService.addUpdateBug(0, this.bugDescription, false, null,this.bugComponent,this.bugCategory, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {

        this.bugCategory = '';
        this.bugComponent = '';
        this.bugDescription = '';
        this.modalService.dismissAll();
        alert(data.responseMessage);
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Bug report error", error);
    })
  }
  
}



