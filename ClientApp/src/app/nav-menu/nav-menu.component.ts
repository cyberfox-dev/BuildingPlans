import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild,TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentConfigComponent } from 'src/app/department-config/department-config.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from '../shared/shared.service';
import { RolesService } from '../service/Roles/roles.service';
import { MatTable } from '@angular/material/table';
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
  DateCreated: string;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
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

  cyberfoxConfigs: boolean = false;
  Configurations: boolean = false;
  CommentBuilder: boolean = false;

  public isInternalUser: boolean = false;
  Links: boolean = false;
  Icons: boolean = true;
  public addComment = this.formBuilder.group({
    newCommentName: ['', Validators.required],

  })

  public editComments = this.formBuilder.group({
    editCommentName: ['', Validators.required],
  })
    applica: any;
    UserRoles: import("C:/CyberfoxProjects/WayleaveManagementSystem/ClientApp/src/app/shared/shared.service").RolesList[];
    selectedOptionText: string;

  constructor(private offcanvasService: NgbOffcanvas,private modalService: NgbModal, private accessGroupsService: AccessGroupsService, private http: HttpClient, private documentUploadService: DocumentUploadService, private router: Router, private shared: SharedService, private formBuilder: FormBuilder, private commentService: CommentBuilderService, private userPofileService: UserProfileService, private notificationsService: NotificationsService, private subDepartment: SubDepartmentsService, private applicationsService: ApplicationsService, private faq: FrequentlyAskedQuestionsService) { }
  DocumentsList: DocumentsList[] = [];

  selected = 'none';
  select = 0;
  displayedColumns: string[] = ['DocumentName', 'actions'];
  dataSource = this.DocumentsList;

  displayedColumnsComment: string[] = ['Comment', 'actions'];
  dataSourceComment = this.CommentList;


  @ViewChild(MatTable) commentTable: MatTable<CommentList> | undefined;
  @ViewChild(MatTable) DocumentsListTable: MatTable<DocumentsList> | undefined;

  stringifiedData: any;
  CurrentUser: any;

  fileAttrs: string[] = [];

  ngOnInit() {
    
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));


    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getUserProfileByUserID();
    this.getRolesLinkedToUser();
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
  }

  uploadRepoDoc: boolean = false;
  deleteRepoDoc: boolean = false;
  groupName: boolean = true;
  depSelect: boolean = true;
  selectDepartmentForUpload: boolean = false;
  selectDepForUpload = 0;
 
  lockViewAccordingToRoles() {
  
   
    
    for (var i = 0; i < this.RolesList.length; i++) {
      
      if (this.RolesList[i].RoleName == "Developer Config") {
        this.Configurations = true;
      }
      if (this.RolesList[i].RoleName == "Developer Config" || this.RolesList[i].RoleName == "Configuration") {
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

  onPassFileName(event: { uploadFor: string; fileName: string }) {
    const { uploadFor, fileName } = event;
    const index = parseInt(uploadFor.substring('CoverLetter'.length));
    this.fileAttrs[index] = fileName;
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
 
    this.commentService.addUpdateComment(null, newCommentName,this.CurrentUser.appUserId).subscribe((data: any) => {

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

  goToSettings() {
    /*this.router.navigate(["/user-settings"]);*/

    this.deleteWayleaveWhenGoSettings();
  }
  goToCyberfoxCofig() {
/*    this.router.navigate(["/cyberfox-config"]);*/
    this.deleteWayleaveWhenGoCyberfoxConfig();
  }
/*This is to open the comment buider modal*/
  openCommentBuilder(commentBuilder:any) {
    this.modalService.open(commentBuilder, { centered:true,size: 'xl' });
  }

  /*Open Repository Modal*/
  openRepositoryModal(repositoryModal: any) {
    this.selected = undefined;
    this.selectedOptionText = "";
    this.getAllDocsForRepository(repositoryModal);
   
  }

  /*Open File Upload for repository*/
  onUploadFile(fileUpload:any) {
    this.modalService.open(fileUpload, { centered: true, size: 'lg', backdrop: 'static' });
  }

  closeCommentBuilder(commentBuilder: any) {
    this.modalService.dismissAll(commentBuilder);
  }
/*this is to open the notifications modal*/

  openNotificationsModal(notificationsCenter: any) {
    this.notiBell = false;
    this.modalService.open(notificationsCenter, { centered: true, size: 'xl' });
  }
  /*Notifications*/

  openCreateNewComment(createNewComment : any) {
    this.modalService.open(createNewComment, { centered: true, size: 'lg' });
  }

  openFAQModal(FAQModal: any) {
    this.offcanvasService.dismiss();
    this.modalService.open(FAQModal, { centered: true, size: 'xl' });
  }
  viewEditComment(editComment: any, index: any) {
    this.editComments.controls["editCommentName"].setValue(this.CommentList[index].Comment);
    this.forEditIndex = index;
    this.modalService.open(editComment, { centered: true, size: 'lg' });
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

  getAllNotifications() {
    this.applica = 3023;

    this.NotificationsList.splice(0, this.NotificationsList.length);
    this.notificationsService.getNotificationByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempNotificationsList = {} as NotificationsList;
          const current = data.dateSet[i];
          console.log(current);
          const date = current.dateCreated;
          tempNotificationsList.ApplicationID = current.applicationID;
          tempNotificationsList.NotificationID = current.notificationID;
          tempNotificationsList.NotificationName = current.notificationName;
          tempNotificationsList.NotificationDescription = current.notificationDescription;
          tempNotificationsList.DateCreated = date.substring(0, date.indexOf('T'));


          this.NotificationsList.push(tempNotificationsList);
          // this.sharedService.setStageData(this.StagesList);
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
      this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.shared.setApplicationID(0);
/*          this.homeComponent.getAllApplicationsByUserID();*/
          this.router.navigate(["/home"]);
        }
        else {
          alert("RefreshService Delete Application Error");
        }
       
        console.log("responseAddApplication", data);

      }, error => {
        console.log("Error", error);
      })
    }
    this.router.navigate(["/home"]);
  }

  deleteWayleaveWhenGoSettings() {
    
    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.shared.setApplicationID(0);
          /* this.homeComponent.getAllApplicationsByUserID();*/
          this.router.navigate(["/user-settings"]);
        }
        else {
          alert("RefreshService Delete Application Error");
        }

        console.log("responseAddApplication", data);

      }, error => {
        console.log("Error", error);
      })
    }
    this.router.navigate(["/user-settings"]);
  }

  deleteWayleaveWhenOnLogout() {
    
    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.shared.setApplicationID(0);
          /* this.homeComponent.getAllApplicationsByUserID();*/
          this.router.navigate(["/"]);
          localStorage.removeItem('LoggedInUserInfo');
          localStorage.removeItem('userProfile');
        }
        else {
          alert("RefreshService Delete Application Error");
        }

        console.log("responseAddApplication", data);

      }, error => {
        console.log("Error", error);
      })
    }
    this.router.navigate(["/"]);
    localStorage.removeItem('LoggedInUserInfo');
    localStorage.removeItem('userProfile');
  }

  deleteWayleaveWhenGoConfig() {
    
    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.shared.setApplicationID(0);
          /* this.homeComponent.getAllApplicationsByUserID();*/
          this.router.navigate(["/configuration"]);
        }
        else {
          alert("RefreshService Delete Application Error");
        }

        console.log("responseAddApplication", data);

      }, error => {
        console.log("Error", error);
      })
    }
    this.router.navigate(["/configuration"]);
  }

  deleteWayleaveWhenGoCyberfoxConfig() {
    
    let appID = this.shared.getApplicationID();
    if (appID != 0) {
      this.applicationsService.deleteApplication(appID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.shared.setApplicationID(0);
          /* this.homeComponent.getAllApplicationsByUserID();*/
          this.router.navigate(["/cyberfox-config"]);
        }
        else {
          alert("RefreshService Delete Application Error");
        }

        console.log("responseAddApplication", data);

      }, error => {
        console.log("Error", error);
      })
    }
    this.router.navigate(["/cyberfox-config"]);
  }









  /*Repository Section*/
  getAllDocsForRepository(repositoryModal) {
    this.DocumentsList.splice(0, this.DocumentsList.length);
    this.documentUploadService.getAllDocumentsForRepository().subscribe((data: any) => {

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
          console.log("THIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGS", current);
          this.DocumentsList.push(tempDocList);
        

        }

        this.DocumentsListTable?.renderRows();
        this.modalService.open(repositoryModal, { centered: true, size: 'xl' });
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

  private readonly apiUrl: string = this.shared.getApiUrl();

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
      this.getAllDocsForRepository(repositoryModal);
    }, error => {
      console.log("Error: ", error);
    })

  }
  progress: number = 0;
  message= '';
  save(repositoryModal) {
    if (this.selectDepartmentForUpload == undefined) {
      alert("Please Select a department");
    }
    else if (this.selected == "") {
      alert("Please Select A Group For Your Document");
    }
    else {

      const filesForUpload = this.shared.pullFilesForUpload();
      for (var i = 0; i < filesForUpload.length; i++) {
        const formData = new FormData();
        let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
        let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + null;
        formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);




        this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
          .subscribe({
            next: (event) => {


              if (event.type === HttpEventType.UploadProgress && event.total)
                this.progress = Math.round(100 * event.loaded / event.total);
              else if (event.type === HttpEventType.Response) {
                this.message = 'Upload success.';
                this.uploadFinished(event.body, repositoryModal);

              }
            },
            error: (err: HttpErrorResponse) => console.log(err)
          });
      }
    }
  }

  uploadFinished = (event: any, repositoryModal) => {

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, null, this.CurrentUser.appUserId, this.CurrentUser.appUserId, this.selectedOptionText, this.selectDepForUpload, this.SubDepartmentListFORDOCUMENTS[0].subDepartmentName).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.modalService.dismissAll(repositoryModal);
        this.getAllDocsForRepository(repositoryModal);
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
          this.getAllDocsForRepository(repositoryModal);
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

    if (this.select == undefined) {
      this.dataSource = this.DocumentsList.filter(df => df.DateCreated);
      this.groupName = false;
      this.selected = undefined;
      this.selectedOptionText = "";
    }
    else {

      this.groupName = true;
      console.log(this.select);
      this.dataSource = this.DocumentsList.filter(df => df.SubDepartmentID == this.select);
      console.log("FilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilter", this.DocumentsList.filter(df => df.SubDepartmentID == this.select))
    }
  }
  resetFilter() {
    this.select = undefined;
    this.selected = undefined;
    this.groupName = false;
    this.selectedOptionText = "";
    this.dataSource = this.DocumentsList.filter(df => df.DateCreated);
  }

  filerGroupName() {
    if (this.selectedOptionText == "") {
      this.dataSource = this.DocumentsList.filter(df => df.DateCreated && df.SubDepartmentID == this.select);
    }
    else {
      console.log(this.selectedOptionText);
      this.dataSource = this.DocumentsList.filter(df => df.GroupName == this.selectedOptionText && df.SubDepartmentID == this.select );
      console.log("FilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilter", this.DocumentsList.filter(df => df.SubDepartmentID == this.select))
    }
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
        console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg",this.SubDepartmentListFORDOCUMENTS);

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

}



