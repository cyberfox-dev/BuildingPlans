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
 
}
//Permit Kyle 13-02-24
export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
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

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private permitService: PermitService, private shared: SharedService, private applicationsService: ApplicationsService, private stagesService: StagesService, private auditTrailService: AuditTrailService,private router :Router , private financialService :FinancialService) { }

  ngOnInit(): void {
    this.getAllPermitForComment();

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataCurrentUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataCurrentUserProfile);
    
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedData);
    for (var i = 0; i < this.AllCurrentUserRoles.length; i++) {
      if (this.AllCurrentUserRoles[i].roleName == "Issue Permit") {
        this.CanIssuePermit = true;
      }
      else {
        this.CanIssuePermit = false;
      }
      this.isCalledInsidePermit = true;
      
    }
    
    this.getAllStages();//Permit Kyle 13-02-24
    if (this.CurrentUserProfile[0].subDepartmentName == "EMB") {
      this.isEMB = true;
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
      
      if (this.PTCList[i].PermitDocName != null && this.PTCList[i].isPaid == true) {
        x++;
      }
    }
    if (x === this.PTCList.length) {
      this.CanConsolidate = true;
    } else {
      this.CanConsolidate = false;
    }

    
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

    this.combinePDFs(this.pdfBlobs)

      .then(combinedPdfBlob => {
        // Do something with the combined PDF blob, like downloading it
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(combinedPdfBlob);
        link.download = 'combined.pdf';
        link.click();
        
      })
      .catch(error => {
        
        console.error('Error combining PDFs:', error);
      });

    this.moveToClosedStage();//Permit Kyle 13-02-24
  }

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
    if (confirm("Are you sure you want to move this to paid?")) {
      this.permitService.addUpdatePermitSubForComment(permitForComment.PermitSubForCommentID, permitForComment.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, true).subscribe((data: any) => {
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
}
