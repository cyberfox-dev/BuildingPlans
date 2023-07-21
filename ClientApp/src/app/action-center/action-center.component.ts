import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { ViewProjectInfoComponent } from 'src/app/view-project/view-project-info/view-project-info.component';
import { PermitComponentComponent } from 'src/app/permit-component/permit-component.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { RefreshService } from 'src/app/shared/refresh.service';
import { PermitService } from 'src/app/service/Permit/permit.service';
import { StagesService } from 'src/app/service/Stages/stages.service';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';




export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
}

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
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
  zoneLinkID?: any;
}

export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
  //RoleType: string;
  //RoleDescription: string;
}

 



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




  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  response: { dbPath: ''; } | undefined
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

  checked: boolean = false;
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



  closeResult!: string;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;
  loggedInUsersIsAdmin: any;
  loggedInUsersDepartment: void;
  loggedInUsersDepartmentID: number;
  loggedInUsersSubDepartmentID: any;
  loggedInUsersSubDepartmentName: any;
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
    private sharedService: SharedService,
    private accessGroupsService: AccessGroupsService,
    private viewProjectInfoComponent: ViewProjectInfoComponent,
    private router: Router,
    private refreshService: RefreshService,
    private stagesService: StagesService,
    private permitService: PermitService,
    private permitComponentComponent: PermitComponentComponent,
    private http: HttpClient,
    private documentUploadService: DocumentUploadService,
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
  leaveACommentPermit = "";
  FileUpload = "Please Upload file";
  @ViewChild("internalOpt", { static: true }) content!: ElementRef;
  @Output() refreshParent: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    // setTimeout(() => {
    //this.getDepartmentManagerUserID();
    //Get Current Application Infomation 



    this.getAllSubDepartments();


    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log(this.CurrentUser);
    }

    /*  this.getAllServiceItmes();*/
  /*  this.getAllServiceItmesForDropdown();*/
 
      /*  this.getAllServiceItmes();*/


   
    this.CurrentApplication = this.viewProjectInfoComponent.getCurrentApplication();



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
    console.log("WTFWTFWTFWTFWTFWTWFTWFWTFWTFWTWTF", this.CurrentUserProfile[0]);
    this.loggedInUsersIsAdmin = this.CurrentUserProfile[0].isDepartmentAdmin;
    this.loggedInUsersIsZoneAdmin = this.CurrentUserProfile[0].isZoneAdmin;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersSubDepartmentName = this.CurrentUserProfile[0].subDepartmentName;
    this.loggedInUsersDepartmentID = this.CurrentUserProfile[0].departmentID;
    this.getCurrentUserSubDepName();
    this.getAllUsersLinkedToZone(this.loggedInUsersSubDepartmentID);
    if (this.CurrentApplication.permitStartDate != null || this.CurrentApplication.permitStartDate != undefined) {
      this.getUsersByRoleName("Permit Issuer");
      this.showPermitTab = true;

    }
    else {
      this.showPermitTab = false;
    }
    this.getLinkedZones();
    this.CanComment();
    this.getAllStages();
    this.canApprovePTW();
    this.getAllPermitForComment();



    //this.CheckIfCurrentUserCanUseHopper();
    // }, 1000);

    this.getUserRoles();
    this.getServicesByDepID();
  }


  ngOnDestroy() {
    this.refreshService.disableRefreshNavigation();
  }


  canApprovePTW() {


    this.permitService.getPermitForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        let foundMatch = false;
        let current = data.dateSet[0];// Flag to track if a match is found
        
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
      } else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })


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

  onPassFileName(event: { uploadFor: string; fileName: string }) {
    const { uploadFor, fileName } = event;





    //for (var i = 0; i < filesForUpload.length; i++) {
    //  const formData = new FormData();
    //  let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
    //  let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.applicationID;
    //  formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);



    //  this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
    //    .subscribe({
    //      next: (event) => {

    //        if (event.type === HttpEventType.UploadProgress && event.total)
    //          this.progress = Math.round(100 * event.loaded / event.total);
    //        else if (event.type === HttpEventType.Response) {
    //          this.message = 'Upload success.';
    //          this.uploadFinished(event.body, this.applicationID, data.dateSet);
    //        }
    //      },
    //      error: (err: HttpErrorResponse) => console.log(err)
    //    });
    //}
    const index = parseInt(uploadFor.substring('CoverLetter'.length));
    this.fileAttrs[index] = fileName;
  }

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
    
    for (var i = 0; i < this.PTCList.length; i++) {
      
      if (this.PTCList[i].SubDepartmentID == this.loggedInUsersSubDepartmentID) {
        
        SubDepartmentName = this.PTCList[i].SubDepartmentName;
        PermitSubCommetID = this.PTCList[i].PermitSubForCommentID;
      }
    }
    switch (interact) {

      case "Approve": {
        if (confirm("Are you sure you want to approve permit this application?")) {
          
          this.permitService.addUpdatePermitSubForComment(PermitSubCommetID, null, null, null, this.CurrentUser.appUserId, this.leaveACommentPermit, "Approved", this.CurrentUser.appUserId).subscribe((data: any) => {
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
          this.permitService.addUpdatePermitSubForComment(PermitSubCommetID, null, null, null, this.CurrentUser.appUserId, this.leaveACommentPermit, "MeetOnSite", this.CurrentUser.appUserId).subscribe((data: any) => {
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
          this.permitService.addUpdatePermitSubForComment(PermitSubCommetID, null, null, null, this.CurrentUser.appUserId, this.leaveACommentPermit, "Rejected", this.CurrentUser.appUserId).subscribe((data: any) => {
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

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Final Approved", this.CurrentUser.appUserId).subscribe((data: any) => {

                if (data.responseCode == 1) {
               
                  this.viewProjectInfoComponent.getAllComments();
                  alert(data.responseMessage);
              
                  this.router.navigate(["/home"]);
                  this.CheckALLLinkedDepartmentsCommented(false);

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

      case "Reject": {
        if (confirm("Are you sure you want to final reject this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "FinalReject", null, null, "EndOfCommentProcess").subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "FinalReject", this.CurrentUser.appUserId).subscribe((data: any) => {

                if (data.responseCode == 1) {
           
                  this.viewProjectInfoComponent.getAllComments();
                  alert(data.responseMessage);
            
                  this.router.navigate(["/home"]);
                  this.CheckALLLinkedDepartmentsCommented(false);
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

      for (var j = 0; j < this.UserZoneList.length; j++) {
        var userZone = this.UserZoneList[j];
        
        if (reviewer.userID === userZone.id) {
          this.ReviewerUserList.push(userZone); // Save the matching userZone in the new list
        }
      }
    }
  }


  

  setRoles() {
  

    // this.getUsersByRoleName("Department Admin");

    console.log("this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].this.departmentAdminUsers[].", this.departmentAdminUsers);
    
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsAdmin == true) {
        
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

  //OLD Code 
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

  

  CanComment() {
   // this.getDepartmentManagerUserID("Senior Reviewer");
   
    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        for (var i = 0; i < data.dateSet.length; i++) {
          
          let current = data.dateSet[i];
         
          if (current.userAssaignedToComment == this.CurrentUser.appUserId) { /*&& current.userAssaignedToComment != this.userID*/
            this.canComment = true;
            
            //console.log("vvvvvvvcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent",current);
            return;
          }
          else {
            
            this.canComment = false;
          } 
        }
       

      

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);
      this.getUsersByRoleName("Senior Reviewer");
      this.getUsersByRoleName("Final Approver");
     // this.CanCommentFinalApprover();
    }, error => {
      console.log("Error: ", error);
    })
  }

 
  CanCommentSeniorReviewer() {
    


    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        let foundMatch = false;
        let current = data.dateSet[0];// Flag to track if a match is found
        


        if (current.userAssaignedToComment == "Senior Reviewer to comment") {
          


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
      } else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }


  CanCommentFinalApprover() {
    
   

    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        let foundMatch = false;
        let current = data.dateSet[0];// Flag to track if a match is found
        

       
        if (current.userAssaignedToComment == "All users in Subdepartment FA") {
          


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
          
          this.applicationsService.updateApplicationStage(this.ApplicationID, current.previousStageName, current.previousStageNumber ,current.currentStageName, current.currentStageNumber, current.nextStageName, current.nextStageNumber,"Distributed/Allocated").subscribe((data: any) => {
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
    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        

        this.forManuallyAssignSubForCommentID = current.subDepartmentForCommentID;

        for (var i = 0; i < this.UserZoneList.length; i++) {
          
          if (this.UserZoneList[i].id == current.userAssaignedToComment) {
            const tempUserList = {} as UserZoneList;
            tempUserList.fullName = this.UserZoneList[i].fullName;
            tempUserList.id = this.UserZoneList[i].id;
            tempUserList.zoneLinkID = this.UserZoneList[i].zoneLinkID;
            
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
          
          alert(data.responseMessage);
          this.getLinkedZones();
          this.updateApplicationStatus();
          this.MoveApplicationToAllocated();
          this.viewProjectInfoComponent.getAllComments();
          this.refreshParent.emit();

        }
        else {
          alert(data.responseMessage);

        }
        console.log("reponse", data);
        this.modalService.dismissAll();
        this.router.navigate(["/home"]);
        

      }, error => {
        console.log("Error: ", error);
      })

    }
  } 



  getUsersByRoleName(roleName?: string |null) {
    
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
      this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

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

  onHopperClick() {
    
    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {


          const current = data.dateSet[0];
          this.SubForCommentIDForHopper = current.subDepartmentForCommentID;

     

        if (confirm("Are you sure you what to assign this project to you?")) {
         
          this.subDepartmentForCommentService.departmentForCommentUserAssaignedToComment(this.SubForCommentIDForHopper, this.CurrentUser.appUserId ).subscribe((data: any) => {

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
     
    this.UserZoneList.splice(0, this.UserZoneList.length);
    for (var i = 0; i < this.ZoneLinkedList.length; i++) {


      this.zoneService.getUsersLinkedByZoneID(this.ZoneLinkedList[i].zoneID).subscribe((data: any) => {

     
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as UserZoneList;
          const current = data.dateSet[i];
          tempZoneList.id = current.id;
          tempZoneList.fullName = current.fullName;
          tempZoneList.zoneLinkID = current.zoneLinkID;


          this.UserZoneList.push(tempZoneList);
        }
        this.setRoles();
        this.CheckIfCurrentUserCanUseHopper();
       
        //for (var i = 0; i < this.UserZoneList.length; i++) {
        //  if (this.CurrentUser.appUserId == this.UserZoneList[i].id) {
        //    this.hopperButton = true;
        //  }
        //  else {
        //    this.hopperButton = false;
        //  }
        //}
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
  totalAmount = 0;
  rate: number;
  description: string;
  quantity: number;
  totalCheckVat: boolean = false;
  totalCheck: boolean = false;
  remarks = '';
  vatApp = '';
  calculateTotalAmount() {
    debugger;
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
    debugger;
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
    
    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    //console.log("SubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentName", SubDepartmentName);

    switch (interact) {

      case "Approve": {
        
        
          if (this.checked == true) {
            
          //SubDepartmentForCommentService
            this.onDepositRequiredClick();
            if (confirm("Are you sure you want to approve this application?")) {
              this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved(Conditional)", null, null, "All users in Subdepartment FA", false).subscribe((data: any) => {

                if (data.responseCode == 1) {

                  alert(data.responseMessage);

                  //commentsService
                  this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Approved(Conditional)", this.CurrentUser.appUserId).subscribe((data: any) => {

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
              this.refreshParent.emit();
              this.moveToFinalApprovalForDepartment();
              this.modalService.dismissAll();
              this.router.navigate(["/home"]);
            }
        }
        

        else {
          
          if (confirm("Are you sure you want to approve this application?")) {
            
            this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved", null, null, "All users in Subdepartment FA", false).subscribe((data: any) => {

              if (data.responseCode == 1) {
                
                alert(data.responseMessage);
                //commentsService
                this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Approved", this.CurrentUser.appUserId).subscribe((data: any) => {

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
            this.moveToFinalApprovalForDepartment();
            this.modalService.dismissAll();
            this.router.navigate(["/home"]);
            }

        }
       
        break;
      }

      case "Reject": {
        
        if (confirm("Are you sure you want to reject this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Rejected", null, null,"All users in Subdepartment FA",false).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Rejected", this.CurrentUser.appUserId).subscribe((data: any) => {

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

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Clarify", this.CurrentUser.appUserId).subscribe((data: any) => {

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
      case "Refer": {

        
     
        if (confirm("Are you sure you want to refer this application to Senior Reviewers?")) {
          
            this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Referred", false, true, "Senior Reviewer to comment",false).subscribe((data: any) => {

              if (data.responseCode == 1) {
                
                alert(data.responseMessage);
                //commentsService
                this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Referred", this.CurrentUser.appUserId).subscribe((data: any) => {

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
            this.router.navigate(["/home"]);
          }
        
       

        break;
      }




      default: {

        break;
      }
    }
  }

  onCommentSR(interact: any) {
    
    let SubDepartmentName = "";
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID) {
        SubDepartmentName = this.SubDepartmentLinkedList[i].subDepartmentName;
      }
    }
    //console.log("SubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentNameSubDepartmentName", SubDepartmentName);

    switch (interact) {

      case "Approve": {
        

        if (this.checked == true) {
          
          //SubDepartmentForCommentService
          this.onDepositRequiredClick();
          
          if (confirm("Are you sure you want to approve this application?")) {
            
            this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved(Conditional)", null, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

              if (data.responseCode == 1) {
                

                alert(data.responseMessage);

                //commentsService
                this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Approved(Conditional)", this.CurrentUser.appUserId).subscribe((data: any) => {

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
          
          }
          this.refreshParent.emit();
          this.moveToFinalApprovalForDepartment();
          this.modalService.dismissAll();
          this.router.navigate(["/home"]);
        }


        else {
          
          if (confirm("Are you sure you want to approve this application?")) {
            
            this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved", null, false, "All users in Subdepartment FA", false).subscribe((data: any) => {

              if (data.responseCode == 1) {
                
                alert(data.responseMessage);
                //commentsService
                this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Approved", this.CurrentUser.appUserId).subscribe((data: any) => {

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



        break;
      }

      case "Reject": {
        if (confirm("Are you sure you want to reject this application?")) {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Rejected", null, false, "All users in Subdepartment FA",false).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Rejected", this.CurrentUser.appUserId).subscribe((data: any) => {

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

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "Clarify", this.CurrentUser.appUserId).subscribe((data: any) => {

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
  enterWBSNumberModal(wbsNumberModal:any) {
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
    let currnetComment = this.leaveAComment;
    console.log("commentName", commentName);
    this.leaveAComment = currnetComment+" "+commentName;
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

  getAllServiceItmesForDropdown() {


    this.serviceItemService.getAllServiceItem().subscribe((data: any) => {
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
      this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.ApplicationID, selectDepartments[i].subDepartmentID, selectDepartments[i].subDepartmentName, null, null, this.CurrentUser.appUserId).subscribe((data: any) => {

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
      this.zoneForCommentService.addUpdateZoneForComment(0, selectZones[i].subDepartmentID, this.ApplicationID, selectZones[i].zoneID, selectZones[i].zoneName ,this.CurrentUser.appUserId).subscribe((data: any) => {

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
        this.viewSelectedUserForApplication();

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
          this.viewProjectInfoComponent.onCreateApprovalPack();
          this.countApprove = 0;
          this.countReject = 0;
          this.MoveToNextStage();
        } else if (this.countReject++ >= 1 && this.SubDepartmentListForCheck.length == this.countApprove + this.countReject) {
          //Rejection Pack
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

            if (tempSubDepartmentList.commentStatus == "Final Approved") {
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
    


    this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, this.StagesList[4].StageName, this.StagesList[4].StageOrderNumber, "PTW Pending").subscribe((data: any) => {

      if (data.responseCode == 1) {
        
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

  MoveToClosedStage(isPlanning: boolean) {
    
    
    if (isPlanning === false) {
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
    else {
      this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[5].StageName, this.StagesList[5].StageOrderNumber, this.StagesList[5].StageName, this.StagesList[5].StageOrderNumber, "Closed",null).subscribe((data: any) => {
        
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
  private readonly apiUrl: string = this.sharedService.getApiUrl();



  progress: number = 0;
  message = '';

  fileName: string = '';
  fileUploadName = '';
  @Input() UploadFor: any;
  fileExtention = '';
  fileToUpload : any;
  fName = '';
  loading: boolean = false;
  uploadFile = (files: any) => {
    
    if (files.length === 0) {
      return;
    }

    this.fileToUpload = <File>files[0];
    this.fileExtention =this.fileToUpload.name.substring(this.fileToUpload.name.indexOf('.'));
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

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, this.CurrentUser.appUserId, this.CurrentUser.appUserId, null, this.loggedInUsersSubDepartmentID, this.loggedInUserSubDepartmentName,true).subscribe((data: any) => {

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

  Approve(){
    this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Final Approved", null, null, "EndOfCommentProcess", true).subscribe((data: any) => {
      
      if (data.responseCode == 1) {

        alert(data.responseMessage);
        //commentsService
        this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, this.loggedInUserSubDepartmentName, this.leaveAComment, "Final Approved", this.CurrentUser.appUserId).subscribe((data: any) => {

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


}





