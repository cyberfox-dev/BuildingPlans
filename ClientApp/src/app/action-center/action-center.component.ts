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


export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
}

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
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


  })

  public wbs = this.formBuilder.group({
    wbsnumber: ['', Validators.required]
  })

  checked: boolean = false;



  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentLinkedList: SubDepartmentList[] = [];
  SingleSubDepartmentLinked: SubDepartmentList[] = [];
  CommentList: CommentList[] = [];
  RolesList: RolesList[] = [];
  UserROle: RolesList[] = [];
  CommentDropDown: CommentDropDown[] = [];
  ServiceItemCodeDropdown: ServiceItemCodeDropdown[] = [];
  ServiceItemList: ServiceItemList[] = [];

  ZoneList: ZoneList[] = [];
  ZoneLinkedList: ZoneList[] = [];
  UserZoneList: UserZoneList[] = [];
  LinkedUserToSub: UserZoneList[] = [];

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
  dataSourceViewUsersForLink = this.UserZoneList;

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
  loggedInUsersSubDepartmentID: any;
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
    canCommentSR: boolean;
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
  ) { }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  stringifiedData: any;
  CurrentUser: any;

  public isInternalUser: boolean = false;
  public isExternalUser: boolean = false;
  option = '';

  leaveAComment = "";
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
    this.getAllServiceItmesForDropdown();


       this.CurrentApplication = this.viewProjectInfoComponent.getCurrentApplication();

   //// this giving some shit
   // this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
   // this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);

    //end of shit
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
      this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
      this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.loggedInUsersIsAdmin = this.CurrentUserProfile[0].isDepartmentAdmin;
    this.loggedInUsersIsZoneAdmin = this.CurrentUserProfile[0].isZoneAdmin;
      this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
      this.getAllUsersLinkedToZone(this.loggedInUsersSubDepartmentID);
    this.getLinkedZones();
    this.CanComment();
 
 this.CanCommentSR();
    

   
      //this.CheckIfCurrentUserCanUseHopper();
   // }, 1000);

    this.getUserRoles();

  }


  onPassFileName(event: { uploadFor: string; fileName: string }) {
    console.log("............................................onPassFileNameEvent",event);
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
        if (confirm("Are you sure you want to final approve this application?") ){
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "FinalApproved", null, null, "EndOfCommentProcess", true).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName, this.leaveAComment, "FinalApproved", this.CurrentUser.appUserId).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  this.viewProjectInfoComponent.getAllComments();
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
            else {
              alert(data.responseMessage);

            }
            console.log("reponse", data);

          }, error => {
            console.log("Error: ", error);
          })

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
        
        break;
      }

      default: {

        break;
      }
    }
  }

  setRoles() {
   
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsAdmin == true) {
        this.AssignProjectToZone = true;



      }
      else if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsZoneAdmin == true) {
        this.AssignUserForComment = true;
      }
      else if (this.loggedInUsersSubDepartmentID == 1025) {
        this.CanAssignDepartment = true;
      }
      else {
        this.CanAssignDepartment = false;
      }
    }
  }

  

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

    }, error => {
      console.log("Error: ", error);
    })
  }

  CanCommentSR() {
    this.getDepartmentManagerUserID("Senior Reviewer");
    
    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (var i = 0; i < data.dateSet.length; i++) {
          let current = data.dateSet[i];
          
          if (current.userAssaignedToComment == this.CurrentUser.appUserId && current.userAssaignedToComment == this.userID) {
            this.canCommentSR = true;
            //console.log("vvvvvvvcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent",current);
            return;
          }
          else {
            this.canCommentSR = false;
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
          this.viewProjectInfoComponent.getAllComments();
          this.refreshParent.emit(); 
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



  getDepartmentManagerUserID(roleName?: string |null) {
    
    //const currentRole = this.sharedService.getCurrentUserRoles();
    //for (var i = 0; i < currentRole.length; i++) {
    //  if (currentRole[i].RoleName ==) {

    //  }

    //}
    

    this.accessGroupsService.getUserBasedOnRoleName(roleName, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.userID = data.dateSet[0].userID;
      }
      else {    
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })
    

  }

  //im here
  moveToFinalApprovalForDepartment() {
    this.getDepartmentManagerUserID("Department Admin");

    this.subDepartmentForCommentService.departmentForCommentFinalAppovalUserToComment(this.forManuallyAssignSubForCommentID, this.userID).subscribe((data: any) => {

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


  onDepositRequiredClick() {
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


    this.depositRequiredService.addUpdateDepositRequired(0 , this.forManuallyAssignSubForCommentID, Number(rate), this.ApplicationID, description, this.loggedInUsersSubDepartmentID, Number(quantity), this.CurrentUser.appUserId, SubDepartmentName, serviceItemCode).subscribe((data: any) => {

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
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved(Conditional)",null,null,this.userID,true).subscribe((data: any) => {

            if (data.responseCode == 1) {

              alert(data.responseMessage);
             
              //commentsService
              this.commentsService.addUpdateComment(0, this.ApplicationID, this.forManuallyAssignSubForCommentID, this.loggedInUsersSubDepartmentID, SubDepartmentName ,this.leaveAComment, "Approved(Conditional)", this.CurrentUser.appUserId).subscribe((data: any) => {

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
            

          this.depositRequiredService.addUpdateDepositRequired(0, this.forManuallyAssignSubForCommentID, Number(rate), this.ApplicationID, description, this.loggedInUsersSubDepartmentID, Number(quantity), this.CurrentUser.appUserId, SubDepartmentName, serviceItemCode,"True").subscribe((data: any) => {

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

        }
        else {
          this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Approved",null,null,this.userID,true).subscribe((data: any) => {

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
          this.refreshParent.emit();
        }

        break;
      }

      case "Reject": {
        this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Rejected",null).subscribe((data: any) => {

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
        this.refreshParent.emit();
        break;
      }

      case "Clarify": {
       // this.getDepartmentManagerUserID("Senior Reviewer");
        this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Clarify", true, null, this.CurrentApplicant,null).subscribe((data: any) => {

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
        break;
      }
      case "Refer": {

        this.getDepartmentManagerUserID("Senior Reviewer");
        this.subDepartmentForCommentService.updateCommentStatus(this.forManuallyAssignSubForCommentID, "Referred", false, true, this.userID).subscribe((data: any) => {

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

  onPopulateDeposit(event: any) {
    let selectedServiceItem = Number(this.depositRequired.controls["selectServiceItemCode"].value);

    console.log("THIS IS THE SERVICE ITEM CODE", selectedServiceItem);

    this.serviceItemService.getServiceItemByServiceItemID(selectedServiceItem).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;

          this.depositRequired.controls["description"].setValue(current.description);
          this.depositRequired.controls["rate"].setValue(current.rate);
          this.depositRequired.controls["total"].setValue(current.totalVat);

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






}





