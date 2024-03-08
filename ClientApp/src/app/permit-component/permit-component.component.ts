import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermitService } from 'src/app/service/Permit/permit.service'
import { SharedService } from "../shared/shared.service";
import { ApplicationsService } from '../service/Applications/applications.service';
import { PDFDocument } from 'pdf-lib';
//Permit Kyle 13-02-24
import { StagesService } from '../service/Stages/stages.service';
import { AuditTrailService } from '../service/AuditTrail/audit-trail.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FinancialService } from '../service/Financial/financial.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
//Permit Kyle 13-02-24

//PTC = Permit To Comment
export interface PTCList {
  ZoneName: any;
  ZoneID: any;
  PermitSubForCommentID: number;
  ApplicationID: number;
  SubDepartmentID: number;
  UserAssaignedToComment: string;
  SubDepartmentName: string;
  PermitComment: string;
  PermitCommentStatus: string;
  PermitDocName: string;
  DocumentLocalPath: string;
  isPaid: boolean;
  hasDoc: boolean;
  hasSuperVisionFee: boolean;
  
 
}
//Permit Kyle 13-02-24
export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
}

//Request for delete Kyle 22-02-24
export interface EMBUsersList {
  UserProfileID: string;
  UserID: string;
  UserFullName: string;
  UserEmail: string;
}
//Permit Kyle 13-02-24
@Component({
  selector: 'app-permit-component',
  templateUrl: './permit-component.component.html',
  styleUrls: ['./permit-component.component.css']
})

export class PermitComponentComponent implements OnInit {

  PTCList: PTCList[] = [];
  StagesList: StagesList[] = [];//Permit Kyle 13-02-24
  EMBUsersList: EMBUsersList[] = [];

  //permitupload Sindiswa 08 January 2024
  displayedColumns: string[] = ['subDepartmentName','zoneName' ,'comment' ,'indication', 'addDocument','status','moveToPaid'];
  dataSource = this.PTCList;
  MeetOnSite = "MeetOnSite";
  Approved = "Approved";
  Rejected = "Rejected";
  null = null;// what is this
  pdfBlobs = [];
  @ViewChild(MatTable) PTCListTable: MatTable<PTCList> | undefined;
    AllCurrentUserRoles: any;
    stringifiedData: any;
    stringifiedDataCurrentUser: any;
    CurrentUser: any;
    stringifiedDataCurrentUserProfile: any;
    CurrentUserProfile: any;
    CanIssuePermit: boolean;
  CanConsolidate: boolean;
  isEMB: boolean;
  isCalledInsidePermit: boolean;
  projectNumber: string;
  currentStageName: string;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private permitService: PermitService, private shared: SharedService, private applicationsService: ApplicationsService, private stagesService: StagesService, private auditTrailService: AuditTrailService, private router: Router, private financialService: FinancialService, private userProfileService: UserProfileService, private notificationsService: NotificationsService, private documentUploadService: DocumentUploadService, private http: HttpClient, private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.getAllPermitForComment();

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataCurrentUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataCurrentUserProfile);
    
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedData);

       //Request for delete Kyle 22-02-24
    this.getProjectNumberForApplication();
    this.getAllEMBUsers();

    for (var i = 0; i < this.AllCurrentUserRoles.length; i++) {
      if (this.AllCurrentUserRoles[i].roleName == "Issue Permit") {
        this.CanIssuePermit = true;
        break;
      }
      else {
        this.CanIssuePermit = false;
      }
     
      
    }
    this.isCalledInsidePermit = true;
    
    this.getAllStages();//Permit Kyle 13-02-24
    if (this.CurrentUserProfile[0].subDepartmentName == "EMB") {
      this.isEMB = true;
      console.log("isEMB", this.isEMB);
    }
  }

  @Input() ApplicationID;
  @Input() ApplicantID;
  @Input() OriginatorID;
  @Input() PermitBtn: boolean | null;//Permit Kyle 13-02-24
  openPermitModal(content:any) {

    this.modalService.open(content, { size: 'lg' });
  }

  getAllPermitForComment() {
    this.PTCList.splice(0, this.PTCList.length);
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
          if (current.permitComment == null) {
            tempPTCList.PermitComment = "Awaiting Comment...";
          }
          else {
            tempPTCList.PermitComment = current.permitComment;
          }
          
          tempPTCList.PermitCommentStatus = current.permitCommentStatus;
          tempPTCList.ZoneID = current.zoneID;
          tempPTCList.ZoneName = current.zoneName;
          tempPTCList.PermitDocName = current.permitDocName;
          tempPTCList.DocumentLocalPath = current.documentLocalPath;
          tempPTCList.isPaid = current.isPaid;
          
          if (current.permitDocName != null && current.documentLocalPath != null) {
            
            tempPTCList.hasDoc = true;
          }
          else {
            tempPTCList.hasDoc = false;
          }
          if (tempPTCList.isPaid == null) {
            tempPTCList.isPaid = false;
          }
          debugger;
          tempPTCList.hasSuperVisionFee = current.hasSuperVisionFee; //Request For Delete Kyle 22-02-24
          this.PTCList.push(tempPTCList);

        }
        this.PTCListTable?.renderRows();
        this.checkIfCanConsolidate();//Permit Kyle 13-02-24
      /*  this.updateApplicationStatus();*/
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      this.PTCListTable?.renderRows();
      console.log("reponse", data);
      console.log("PTCList", this.PTCList, this.CurrentUserProfile[0].userID);
    }, error => {
      console.log("Error: ", error);
    })
  }

  checkIfCanConsolidate() {
    let x = 0;
    
    for (var i = 0; i < this.PTCList.length; i++) {
      debugger;
      //Request for delete Kyle 22-02-24
      if (this.PTCList[i].hasSuperVisionFee == true) {
        if (this.PTCList[i].PermitDocName != null && this.PTCList[i].isPaid == true) {
          x++;
        }

      }
      else {
        if (this.PTCList[i].PermitDocName != null) {
          x++;
        }
      }

     
    }
    
    if (x === this.PTCList.length ) {
      this.CanConsolidate = true;
    } else {
      this.CanConsolidate = false;
    }
    console.log("CanConsolidate", this.CanConsolidate)
    
  }

  updateApplicationStatus() {
    let x = 0;
    
    for (var i = 0; i < this.PTCList.length; i++) {
      
      if (this.PTCList[i].PermitDocName != null) {
        x++; 
      }
     
    }

    if (x === this.PTCList.length) {
      this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          const current = data.dateSet[0];

          this.applicationsService.updateApplicationStage(this.ApplicationID, current.previousStageName, current.previousStageNumber, current.currentStageName, current.currentStageNumber, current.nextStageName, current.nextStageNumber, "PTW Genaration").subscribe((data: any) => {
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



  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';
  async CombinePTW() {
  
    for (var i = 0; i < this.PTCList.length; i++) {

      const currentDocName = this.PTCList[i].PermitDocName;
      if (currentDocName != null) {
        const blob = await fetch(this.apiUrl + `documentUpload/GetDocument?filename=${currentDocName}`)
          .then(response => {
            if (response.ok) {
              // The response status is in the 200 range

              return response.blob(); // Extract the response body as a Blob

            } else {
              throw new Error('Error fetching the document');
            }
          })
          .then(blob => {
            this.pdfBlobs.push(blob);
            console.log("this.pdfBlobsthis.pdfBlobsthis.pdfBlobsthis.pdfBlobsthis.pdfBlobs", this.pdfBlobs);
          })
          .catch(error => {
            console.log(error);
            // Handle the error appropriately
          });
      }


    }
    //Combine permit Kyle 29-02-24
    this.combinePDFs(this.pdfBlobs)

      .then(combinedPdfBlob => {
        // Do something with the combined PDF blob, like downloading it

        //const link = document.createElement('a');
        //link.href = URL.createObjectURL(combinedPdfBlob);
        //link.download = 'combined.pdf';
        //link.click();
        debugger;
        const file = new File([combinedPdfBlob], 'permits.pdf', { type: 'application/pdf' });

        const formData = new FormData();
        formData.append('file', file);

        this.shared.pushFileForTempFileUpload(file, "Permits" + ".pdf");
        this.save();
      })
      .catch(error => {
        
        console.error('Error combining PDFs:', error);
      });
   
   //Permit Kyle 13-02-24

  }


  response: { dbPath: ''; } | undefined
  progress: number = 0;
  message = '';

  save() {
    debugger;
    const filesForUpload = this.shared.pullFilesForUpload();
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
    debugger;
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, "System Generated Pack", "System Generated Pack","Permits").subscribe((data: any) => {
      /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      debugger;
      if (data.responseCode == 1) {
        this.moveToClosedStage();
      }

    }, error => {
      console.log("Error: ", error);
    })


  }
  //Combine permit Kyle 29-02-24
  private async combinePDFs(pdfBlobs: Blob[]): Promise<Blob> {
    
    const combinedPdfDoc = await PDFDocument.create();

    for (const pdfBlob of pdfBlobs) {
      const blobAsArrayBuffer = await pdfBlob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(blobAsArrayBuffer);
     
      const copiedPages = await combinedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => {
        
        combinedPdfDoc.addPage(page);
      });
    }
    
    const combinedPdfBytes = await combinedPdfDoc.save();
    
    return new Blob([combinedPdfBytes], { type: 'application/pdf' });
  }
  //Permit Kyle 13-02-24
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

  moveToClosedStage() {
    
    this.applicationsService.updateApplicationStage(this.ApplicationID, this.StagesList[4].StageName, this.StagesList[4].StageOrderNumber, this.StagesList[5].StageName, this.StagesList[5].StageOrderNumber, this.StagesList[6].StageName, this.StagesList[6].StageOrderNumber, "Monitoring", null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        
        //Audit Trail Kyle 
        this.onSaveToAuditTrail2("Permit to Work Generated");
        this.onSaveToAuditTrail2("Application Moved To Monitoring Stage");
        //Audit Traik Kyle 
        this.openSnackBar("Application moved to monitoring");
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

  onSaveToAuditTrail2(description: string) {
    this.auditTrailService.addUpdateAuditTrailItem(0, this.ApplicationID, description, true, this.CurrentUserProfile[0].subDepartmentName, this.CurrentUserProfile[0].zoneName, this.CurrentUserProfile[0].userID).subscribe((data: any) => {
      if (data.responseCode == 1) {

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);

    })
  }
  //Permit Kyle 13-02-24
  getPermitDocument(index: any) {
    const category = "Financial-" + this.PTCList[index].SubDepartmentName;
    this.financialService.getFinancialsForApplicationByType(this.ApplicationID, category).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];

        this.getPermitInvoice(current.documentName);
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }
  getPermitInvoice(permitDocumentName: any) {
    
    
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${permitDocumentName}`)
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
        link.download = permitDocumentName; // Set the downloaded file name
        link.click();
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });
  }

  moveToPaid(index: any) {
    const permitForComment = this.PTCList[index];
    const movedToPaidDate = new Date();
    if (confirm("Are you sure you want to move this to paid?")) {
      this.permitService.addUpdatePermitSubForComment(permitForComment.PermitSubForCommentID, permitForComment.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, true, null, movedToPaidDate).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert("Permit for Sub Department moved to paid");
          this.router.navigate(["/home"]);
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);
      })
    }
  }

  requestForDelete(index: any) {
    const permitForSubComment = this.PTCList[index];
    if (confirm("Are you sure you want to request an EMB user to remove the permit document ?")) {
      this.permitService.addUpdatePermitSubForComment(permitForSubComment.PermitSubForCommentID, null, null, null, null, null, null, null, null, null, null, null, true).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.RequestForDeleteEmail(); //Request for delete Kyle 22-02-24
          alert("Request for delete submitted successfully");
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);
      })
    }
  }
  //Permit Kyle 13-02-24
  //Request for delete Kyle 22-02-24
  RequestForDeleteEmail() {
    const emailContentOriginator = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
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
            <p>Dear ${this.CurrentUserProfile[0].fullName},</p>
            <p>You have successfully requested a permit document to delete by an EMB User for ${this.projectNumber}. You will be notified once your request has been carried out which will then allow you to upload a new permit document. </p>
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

    this.notificationsService.sendEmail(this.CurrentUser.email, "Request For Delete", emailContentOriginator, emailContentOriginator);
    this.notificationsService.addUpdateNotification(0, "Request Submmited", "Request For Delete", false, this.CurrentUser.appUserId, this.ApplicationID, this.CurrentUser.appUserID, "Your request for a delete of a permit document for project " + this.projectNumber + "was successful.  You will be notified once the document has been deleted.").subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })

    for (let i = 0; i < this.EMBUsersList.length; i++) {
      const EMBUser = this.EMBUsersList[i];

      const emailContentEMBUsers = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
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
            <p>Dear ${this.EMBUsersList[i].UserFullName},</p>
            <p>A user has submitted a request for a permit document be delete for  ${this.projectNumber} in ${this.CurrentUserProfile[0].subDepartmentName}  ${this.CurrentUserProfile[0].zoneName}. The application will appear in a pop up on your dash board until this request has been attenden to. </p>
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

      this.notificationsService.sendEmail(EMBUser.UserEmail, "Request For Delete", emailContentEMBUsers, emailContentEMBUsers);
      this.notificationsService.addUpdateNotification(0, "Request For Delete", " Requested for permit document delete.", false, EMBUser.UserID, this.ApplicationID, this.CurrentUser.appUserId, "A user has requested a permit document to be delete for " + this.projectNumber + " in " + this.CurrentUserProfile[0].subDepartmentName + " " + this.CurrentUserProfile[0].zoneName + " . PLease attend to this as soon as possible.").subscribe((data: any) => {
        if (data.responseCode == 1) {
          console.log(data.responseMessage)
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error", error);
      })
    }
  }

  getAllEMBUsers() {
    this.userProfileService.getUsersBySubDepartmentName("EMB").subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempUser = {} as EMBUsersList;
          const current = data.dateSet[i];

          tempUser.UserProfileID = current.userProfileID;
          tempUser.UserID = current.userID;
          tempUser.UserFullName = current.fullName;
          tempUser.UserEmail = current.eamil;

          this.EMBUsersList.push(tempUser);
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }

  getProjectNumberForApplication() {
    this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];

        this.projectNumber = current.projectNumber;
        this.currentStageName = current.currentStageName;
        console.log("Permits Stage name and project number", current);
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 4 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }
   //Request for delete Kyle 22-02-24
 
}
